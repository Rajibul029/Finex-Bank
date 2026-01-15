
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")
client = AsyncIOMotorClient(MONGO_URL)

db = client["banking_system"]  
accounts_collection = db["accounts"] 
transactions_collection = db["transactions"]
loans_collection = db["loans"]
loan_schemes_collection = db["loan_schemes"]
admin_collection = db["admins"]
