from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timedelta
from decimal import Decimal, ROUND_HALF_UP
from bson.decimal128 import Decimal128
from bson import ObjectId
from ..auth import get_current_user
from ..db import accounts_collection, loans_collection, loan_schemes_collection
from ..utils import serialize_account
from pydantic import BaseModel, Field
from ..utils import serialize_list, serialize_doc
from ..models import LoanApplicationModel, CustomLoan


router = APIRouter(prefix="/loans", tags=["Loans"])

# Loan Constants
LOAN_TYPES = {
    "personal": {"max_amount": 100000, "interest_rate": 8},
    "education": {"max_amount": 200000, "interest_rate": 8},
    "home": {"max_amount": 1000000, "interest_rate": 10},
    "vehicle": {"max_amount": 500000, "interest_rate": 10},
}

MIN_BALANCE = 5000
LATE_PENALTY = 200
DEFAULT_MONTHS = 3

# Pydantic Models

class LoanRequest(BaseModel):
    loan_type: str = Field(..., example="personal")
    amount: float
    tenure_months: int  # between 6 to 60


class LoanPayment(BaseModel):
    loan_id: str
    amount: float


class AdminLoanAction(BaseModel):
    loan_id: str
    action: str  # "approve" or "reject"
    remarks: str = None

# Helper Functions

def calculate_emi(principal, rate, tenure):
    """
    EMI formula: [P x R x (1+R)^N] / [(1+R)^N – 1]
    """
    R = (rate / 100) / 12
    N = tenure
    emi = (principal * R * (1 + R) ** N) / ((1 + R) ** N - 1)
    return round(emi, 2)

# Route: Apply for Loan

@router.post("/apply")
async def apply_for_loan(
    application: LoanApplicationModel,
    current_user: dict = Depends(get_current_user)
):

    try:
        scheme_obj_id = ObjectId(application.scheme_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid scheme ID")

    scheme = await loan_schemes_collection.find_one({"_id": scheme_obj_id})
    if not scheme:
        raise HTTPException(status_code=404, detail="Loan scheme not found")
    if scheme.get("status") != "active":
        raise HTTPException(status_code=400, detail="This loan scheme is not active")

    user_account = await accounts_collection.find_one({"_id": ObjectId(current_user["_id"])})
    if not user_account:
        raise HTTPException(status_code=404, detail="User account not found")


    if application.amount > scheme["max_amount"]:
        raise HTTPException(
            status_code=400,
            detail=f"Requested amount exceeds scheme limit ({scheme['max_amount']})"
        )


    loan_data = {
        "user_id": str(user_account["_id"]),
        "scheme_id": str(scheme["_id"]),
        "scheme_name": scheme["name"],
        "amount": application.amount,
        "duration_months": application.duration_months,
        "interest_rate": scheme["interest_rate"],
        "status": "pending",
        "applied_at": datetime.utcnow()
    }

    result = await loans_collection.insert_one(loan_data)
    created_loan = await loans_collection.find_one({"_id": result.inserted_id})

    return {
        "message": "Loan application submitted successfully!",
        "loan": serialize_doc(created_loan)
    }

# custome loan apply
@router.post("/custom-apply")
async def custom_loan_apply(data: CustomLoan, current_user: dict = Depends(get_current_user)):
    user_account = await accounts_collection.find_one({"_id": ObjectId(current_user["_id"])})
    if not user_account:
        raise HTTPException(status_code=404, detail="User not found")

    loan_data = {
        "user_id": str(user_account["_id"]),
        "account_number": user_account["account_number"],
        "user_name": user_account["customer"]["full_name"],
        "user_email": user_account["customer"]["email"],
        "loan_name": data.name,
        "amount": data.amount,
        "duration_months": data.duration_months,
        "description": data.description,
        "status": "pending",
        "type": "Personalized",
        "created_at": datetime.utcnow(),
    }

    await loans_collection.insert_one(loan_data)
    return {"message": "Personalized loan request submitted successfully!"}

# Route: View My Loans

@router.get("/my-loans")
async def get_my_loans(current_user: dict = Depends(get_current_user)):
    """
    Fetch all loans applied by the current user (both scheme-based and personalized).
    """
    try:
        user_account = await accounts_collection.find_one({"_id": ObjectId(current_user["_id"])})
        if not user_account:
            raise HTTPException(status_code=404, detail="User account not found")

        user_id = str(user_account["_id"])

        user_loans = await loans_collection.find({"user_id": user_id}).to_list(None)

        for loan in user_loans:
            loan["_id"] = str(loan["_id"])
            if "created_at" in loan and isinstance(loan["created_at"], datetime):
                loan["created_at"] = loan["created_at"].isoformat()

        return {"loans": user_loans}

    except Exception as e:
        print("Error fetching user loans:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch user loans")

# Route: Pay EMI
@router.get("/active")
async def get_active_loans(current_user: dict = Depends(get_current_user)):
    """
    Fetch all approved (active) loans for the logged-in user.
    """
    try:
        user_account = await accounts_collection.find_one(
            {"_id": ObjectId(current_user["_id"])}
        )
        if not user_account:
            raise HTTPException(status_code=404, detail="User account not found")

        user_id = str(user_account["_id"])

        active_loans = await loans_collection.find({
            "user_id": user_id,
            "status": {"$in": ["Approved", "Ongoing"]}
        }).to_list(None)

        for loan in active_loans:
            loan["_id"] = str(loan["_id"])
            if "next_due_date" in loan and isinstance(loan["next_due_date"], datetime):
                loan["next_due_date"] = loan["next_due_date"].isoformat()
            else:
                loan["next_due_date"] = datetime.utcnow().isoformat()

            loan.setdefault("emi_amount", round(loan["amount"] / max(loan.get("duration_months", 1), 1), 2))
            loan.setdefault("remaining_months", loan.get("duration_months", 0))
            loan.setdefault("total_amount", loan["amount"])

        return {"active_loans": active_loans}

    except Exception as e:
        print("Error in /loans/active:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch active loans")

# pay emi------------------------
@router.post("/pay-emi/{loan_id}")
async def pay_emi(loan_id: str, current_user: dict = Depends(get_current_user)):
    """
    Process EMI payment for a given loan.
    Deducts one EMI, updates next due date, and marks loan 'Completed' when finished.
    """
    try:
        loan = await loans_collection.find_one({"_id": ObjectId(loan_id)})
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")

        if str(loan["user_id"]) != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Access denied")

        if loan.get("status") not in ["Approved", "Ongoing"]:
            raise HTTPException(status_code=400, detail="Loan is not active for EMI payment")

        remaining_months = loan.get("remaining_months", loan.get("duration_months", 0))
        if remaining_months <= 0:
            raise HTTPException(status_code=400, detail="Loan already paid off")

        next_due_date = datetime.utcnow() + timedelta(days=30)
        updated_months = remaining_months - 1

        update_data = {
            "remaining_months": updated_months,
            "next_due_date": next_due_date,
            "status": "Ongoing" if updated_months > 0 else "Completed",
        }

        await loans_collection.update_one(
            {"_id": ObjectId(loan_id)},
            {"$set": update_data}
        )

        emi_record = {
            "loan_id": str(loan["_id"]),
            "amount_paid": loan.get("emi_amount", 0),
            "paid_on": datetime.utcnow(),
            "user_id": str(current_user["_id"]),
        }
        await loans_collection.database["emi_history"].insert_one(emi_record)

        return {
            "message": "EMI payment successful!",
            "remaining_months": updated_months,
            "next_due_date": next_due_date.isoformat(),
        }

    except HTTPException:
        raise
    except Exception as e:
        print("Error in /loans/pay-emi:", e)
        raise HTTPException(status_code=500, detail="Failed to process EMI payment")

# pay advance emi------------------------
@router.post("/pay-advance/{loan_id}")
async def pay_advance(loan_id: str, current_user: dict = Depends(get_current_user)):
    """
    Allows user to pay the next EMI in advance.
    """
    try:
        loan = await loans_collection.find_one({"_id": ObjectId(loan_id)})
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")

        if str(loan["user_id"]) != str(current_user["_id"]):
            raise HTTPException(status_code=403, detail="Access denied")

        if loan.get("status") not in ["Approved", "Ongoing"]:
            raise HTTPException(status_code=400, detail="Loan is not active for EMI payment")

        remaining_months = loan.get("remaining_months", 0)
        if remaining_months <= 0:
            raise HTTPException(status_code=400, detail="Loan already fully paid")

        next_due_date = datetime.utcnow() + timedelta(days=30)
        updated_months = remaining_months - 1

        update_data = {
            "remaining_months": updated_months,
            "next_due_date": next_due_date,
            "status": "Ongoing" if updated_months > 0 else "Completed",
        }

        await loans_collection.update_one({"_id": ObjectId(loan_id)}, {"$set": update_data})

        emi_record = {
            "loan_id": str(loan["_id"]),
            "user_id": str(current_user["_id"]),
            "amount_paid": loan.get("emi_amount", 0),
            "paid_on": datetime.utcnow(),
            "payment_type": "Advance",
        }
        await loans_collection.database["emi_history"].insert_one(emi_record)

        return {
            "message": "Advance EMI paid successfully!",
            "remaining_months": updated_months,
            "next_due_date": next_due_date.isoformat(),
        }

    except Exception as e:
        print("Error in pay_advance:", e)
        raise HTTPException(status_code=500, detail="Failed to process advance EMI payment")

@router.get("/schemes")
async def get_active_loan_schemes(current_user: dict = Depends(get_current_user)):
    """
    Fetch all active loan schemes for users to view
    """
    schemes = await loan_schemes_collection.find({"status": "active"}).to_list(100)
    return {"total_schemes": len(schemes), "loan_schemes": serialize_list(schemes)}

