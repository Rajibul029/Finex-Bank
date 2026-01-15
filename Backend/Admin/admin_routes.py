from fastapi import APIRouter, Depends, HTTPException
from app.db import accounts_collection, loans_collection
from app.auth import get_current_admin, hash_password
from datetime import datetime
from app.utils import serialize_list, serialize_doc
from .admin_models import LoanSchemeModel
from bson import ObjectId
from app.db import loan_schemes_collection
from app.models import Account
import uuid

router = APIRouter(prefix="/admin", tags=["Admin"])

#  -------------------- Account Creation (for testing) --------------------
@router.post("/create")
async def create_account(
    account: Account,
    current_admin: dict = Depends(get_current_admin)
):

    # Check duplicate email
    existing = await accounts_collection.find_one({"customer.email": account.customer.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Unique account number
    while True:
        account_number = "ACC" + str(uuid.uuid4().int)[:6]
        if not await accounts_collection.find_one({"account_number": account_number}):
            break

    # Convert & hash
    account_data = account.dict()
    account_data["customer"]["password"] = hash_password(account.customer.password)
    balance = round(float(account.initial_deposit), 2)
    new_account = {
        "account_number": account_number,
        "account_type": account.account_type,
        "balance": balance,
        "status": "active",
        "created_at": datetime.utcnow(),
        "customer": account_data["customer"]
    }

    result = await accounts_collection.insert_one(new_account)
    if result.inserted_id:
        return {"message": "Account created successfully", "account_number": account_number}

    raise HTTPException(status_code=500, detail="Account creation failed")


# -------------------- Account Management --------------------
@router.get("/accounts")
async def get_all_accounts(current_admin: dict = Depends(get_current_admin)):
    accounts = await accounts_collection.find().to_list(100)
    return {"total_accounts": len(accounts), "accounts": serialize_list(accounts)}


@router.put("/block/{account_id}")
async def block_account(account_id: str, current_admin: dict = Depends(get_current_admin)):
    """
    Block a specific account by its ID
    """
    try:
        obj_id = ObjectId(account_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid account ID format")

    result = await accounts_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": "blocked"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=f"Account with ID {account_id} not found")

    return {"message": f"Account {account_id} has been blocked successfully."}


@router.put("/unblock/{account_id}")
async def unblock_account(account_id: str, current_admin: dict = Depends(get_current_admin)):
    """
    Unblock a specific account by its ID
    """
    try:
        obj_id = ObjectId(account_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid account ID format")

    result = await accounts_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": "active"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=f"Account with ID {account_id} not found")

    return {"message": f"Account {account_id} has been unblocked successfully."}


# -------------------- Loan Management --------------------

@router.get("/loans")
async def view_all_loans(current_admin: dict = Depends(get_current_admin)):
    loans = await loans_collection.find().to_list(100)
    loans = serialize_list(loans)           # <-- MUST be called here
    return {"total_loans": len(loans), "loans": loans}

@router.put("/loans/approve/{loan_id}")
async def approve_loan(loan_id: str, current_admin: dict = Depends(get_current_admin)):
    try:
        loan = await loans_collection.find_one({"_id": ObjectId(loan_id)})
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")

        status = loan.get("status", "Pending")
        if status == "Approved":
            raise HTTPException(status_code=400, detail="Loan already approved")
        elif status == "Rejected":
            raise HTTPException(status_code=400, detail="Loan has been rejected previously")

        # calculate EMI and totals
        amount = float(loan.get("amount", 0))
        rate = float(loan.get("interest_rate", 0))
        months = int(loan.get("duration_months", 1))
        interest = (amount * rate * months) / (12 * 100)
        total = amount + interest
        emi = round(total / months, 2)
        update_data = {
            "status": "Approved",
            "approved_at": datetime.utcnow(),
            "emi_amount": emi,
            "total_amount": total,
            "remaining_months": months,
            "next_due_date": datetime.utcnow(),
            "admin_approved_by": str(current_admin["id"]),
        }

        await loans_collection.update_one({"_id": ObjectId(loan_id)}, {"$set": update_data})
        return {"message": "✅ Loan approved successfully!"}

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Error in approve_loan:", e)
        raise HTTPException(status_code=500, detail="Failed to approve loan due to server error")


@router.put("/loans/reject/{loan_id}")
async def reject_loan(loan_id: str, current_admin: dict = Depends(get_current_admin)):
    try:
        loan = await loans_collection.find_one({"_id": ObjectId(loan_id)})
        if not loan:
            raise HTTPException(status_code=404, detail="Loan not found")

        status = loan.get("status", "Pending")
        if status == "Rejected":
            raise HTTPException(status_code=400, detail="Loan already rejected")
        elif status == "Approved":
            raise HTTPException(status_code=400, detail="Loan already approved")

        await loans_collection.update_one(
            {"_id": ObjectId(loan_id)},
            {
                "$set": {
                    "status": "Rejected",
                    "rejected_at": datetime.utcnow(),
                    "admin_rejected_by": str(current_admin["id"]),
                }
            },
        )

        return {"message": "❌ Loan rejected successfully!"}

    except HTTPException as e:
        raise e
    except Exception as e:
        print("Error in reject_loan:", e)
        raise HTTPException(status_code=500, detail="Failed to reject loan due to server error")



@router.post("/loans/launch")
async def launch_loan_scheme(scheme: LoanSchemeModel, current_admin: dict = Depends(get_current_admin)):
    existing = await loan_schemes_collection.find_one({"name": scheme.name})
    if existing:
        raise HTTPException(status_code=400, detail="Loan scheme already exists.")

    scheme_data = scheme.dict()
    scheme_data["created_at"] = datetime.utcnow()

    result = await loan_schemes_collection.insert_one(scheme_data)
    new_scheme = await loan_schemes_collection.find_one({"_id": result.inserted_id})

    return {"message": "Loan scheme launched successfully!", "loan_scheme": serialize_doc(new_scheme)}



@router.get("/loans/schemes")
async def get_all_loan_schemes(current_admin: dict = Depends(get_current_admin)):
    schemes = await loan_schemes_collection.find().to_list(100)
    return {"total_schemes": len(schemes), "loan_schemes": serialize_list(schemes)}

@router.put("/loans/schemes/{scheme_id}/status")
async def update_scheme_status(scheme_id: str, status: str, current_admin: dict = Depends(get_current_admin)):
    try:
        obj_id = ObjectId(scheme_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid scheme ID")

    result = await loan_schemes_collection.update_one(
        {"_id": obj_id},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Loan scheme not found")

    return {"message": f"Loan scheme status updated to {status}"}