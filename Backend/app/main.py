
from fastapi import FastAPI, APIRouter, HTTPException
from .models import Account
from .db import accounts_collection
from datetime import datetime
from .routers import users, accounts, loans
import uuid
from .auth import hash_password
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Admin.admin_routes import router as admin_router
from Admin.admin_auth import router as admin_auth_router

app = FastAPI()
router = APIRouter(prefix="/users", tags=["users"])
app.include_router(users.router)
router = APIRouter(prefix="/accounts", tags=["accounts"])
app.include_router(accounts.router)
app.include_router(loans.router)
app.include_router(admin_router)
app.include_router(admin_auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fbi-2tr3.onrender.com"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is working!"}
