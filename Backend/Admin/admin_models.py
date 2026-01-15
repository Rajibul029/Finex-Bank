from pydantic import BaseModel, EmailStr,Field

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class LoanSchemeModel(BaseModel):
    name: str = Field(..., example="Education Loan")
    interest_rate: float = Field(..., example=7.5)
    max_amount: float = Field(..., example=200000)
    description: str | None = Field(None, example="For students pursuing higher education")
    status: str = Field(default="active")