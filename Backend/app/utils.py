
from bson import ObjectId

def serialize_account(account: dict) -> dict:
    """
    Convert MongoDB ObjectId to string and remove sensitive info
    """
    account_copy = account.copy()

    if "_id" in account_copy:
        account_copy["_id"] = str(account_copy["_id"])

    if "customer" in account_copy and "password" in account_copy["customer"]:
        del account_copy["customer"]["password"]

    return account_copy

from bson import ObjectId, Decimal128
from decimal import Decimal

def clean_mongo_value(value):
    """Recursively convert MongoDB-specific types to safe JSON types."""
    if isinstance(value, ObjectId):
        return str(value)

    if isinstance(value, Decimal128):
        try:
            return round(float(value.to_decimal()), 2)
        except Exception:
            return 0.0

    if isinstance(value, Decimal):
        return round(float(value), 2)

    if isinstance(value, dict):
        return {k: clean_mongo_value(v) for k, v in value.items()}

    if isinstance(value, list):
        return [clean_mongo_value(v) for v in value]

    return value

def serialize_doc(doc):
    if not doc:
        return None
    return clean_mongo_value(doc)

def serialize_list(docs):
    return [clean_mongo_value(d) for d in docs]
