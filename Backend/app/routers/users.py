
from fastapi import APIRouter, HTTPException
from ..db import accounts_collection
from ..schemas import UserLogin
from ..auth import verify_password, create_access_token


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/login")
async def login(user: UserLogin):

    account = await accounts_collection.find_one({"customer.email": user.email})
    if not account:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    hashed_password = account.get("customer", {}).get("password", None)
    if not hashed_password or not verify_password(user.password, hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=user.email)

    return {"access_token": token, "token_type": "bearer"}
