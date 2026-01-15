
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class Address(BaseModel):
    street: str
    city: str
    state: str
    zip: str
    country: str

class IDProof(BaseModel):
    type: str
    number: str

class Nominee(BaseModel):
    name: str
    relation: str
    phone: str

class Customer(BaseModel):
    full_name: str
    dob: str
    gender: str
    email: EmailStr
    password: str  
    phone: str
    address: Address
    id_proof: IDProof
    nominee: Optional[Nominee] = None

class Account(BaseModel):
    account_type: str = Field(..., example="savings")  # savings/current/fixed
    initial_deposit: float = Field(..., gt=0)
    customer: Customer
    
class Transaction(BaseModel):
    account_id: str          # store account _id here as a string
    type: str                # deposit, withdraw, transfer
    amount: float
    balance_after: float
    timestamp: datetime = datetime.utcnow()


class DepositRequest(BaseModel):
    amount: float
    
class WithdrawRequest(BaseModel):
    amount: float

class TransferRequest(BaseModel):
    receiver_account_number: str
    amount: float

class TransactionFilter(BaseModel):
    limit: Optional[int] = 10
    skip: Optional[int] = 0

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
    remarks: Optional[str] = None

class LoanScheme(BaseModel):
    name: str = Field(..., example="Personal Loan")
    description: str = Field(..., example="Loan for personal expenses")
    max_amount: float = Field(..., example=100000.0)
    interest_rate: float = Field(..., example=8.0)
    tenure_months: int = Field(..., example=60)  # max duration in months
    status: str = Field(default="active")  # active/inactive

class LoanApplicationModel(BaseModel):
    scheme_id: str
    amount: float = Field(..., gt=0)
    duration_months: int = Field(..., gt=0)

class CustomLoan(BaseModel):
    name: str = Field(..., description="Custom loan name, e.g. Wedding Loan")
    amount: float = Field(..., gt=0, description="Requested loan amount")
    duration_months: int = Field(..., gt=0, description="Loan duration in months")
    description: Optional[str] = Field(None, description="Loan purpose or description")