from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
from jose import jwt
from .admin_models import AdminLogin
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(prefix="/admin/auth", tags=["Admin Authentication"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ADMIN = {
    "email": os.getenv("ADMIN_EMAIL"),
    "password": os.getenv("ADMIN_PASSWORD")
}

@router.post("/login")
async def admin_login(credentials: AdminLogin):
    if credentials.email != ADMIN["email"] or credentials.password != ADMIN["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "sub": credentials.email,
        "role": "admin",
        "exp": datetime.utcnow() + timedelta(hours=6)
    }

    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

