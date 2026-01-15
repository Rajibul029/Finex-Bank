from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
from ..auth import get_current_user
from ..db import accounts_collection, transactions_collection
from ..utils import serialize_account
from ..models import TransferRequest,WithdrawRequest,DepositRequest


router = APIRouter(prefix="/accounts", tags=["accounts"])

# View account details-----------------------
@router.get("/me")
async def view_account(current_account: dict = Depends(get_current_user)):
    return {"account_details": serialize_account(current_account)}



# Deposit money into account-----------------------
@router.post("/deposit")
async def deposit_money(deposit: DepositRequest, current_account: dict = Depends(get_current_user)):
    if deposit.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be positive")

    new_balance = round(current_account["balance"] + deposit.amount, 2)
    await accounts_collection.update_one(
        {"_id": current_account["_id"]},
        {"$set": {"balance": new_balance}}
    )

    transaction = {
    "account_id": str(current_account["_id"]),  
    "type": "deposit",
    "amount": deposit.amount,
    "balance_after": new_balance,
    "timestamp": datetime.utcnow()
}
    await transactions_collection.insert_one(transaction)


    updated_account = await accounts_collection.find_one({"_id": current_account["_id"]})

    return {
        "message": f"Successfully deposited {deposit.amount}",
        "new_balance": updated_account["balance"],
        "account": serialize_account(updated_account)
    }



@router.post("/withdraw")
async def withdraw_money(withdraw: WithdrawRequest, current_account: dict = Depends(get_current_user)):
    if withdraw.amount <= 0:
        raise HTTPException(status_code=400, detail="Withdraw amount must be positive")

    if withdraw.amount > current_account["balance"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    new_balance = round(current_account["balance"] - withdraw.amount, 2)
    await accounts_collection.update_one(
        {"_id": current_account["_id"]},
        {"$set": {"balance": new_balance}}
    )
    transaction = {
        "account_id": str(current_account["_id"]),
        "type": "withdraw",
        "amount": withdraw.amount,
        "balance_after": new_balance,
        "timestamp": datetime.utcnow()
    }
    await transactions_collection.insert_one(transaction)

    updated_account = await accounts_collection.find_one({"_id": current_account["_id"]})

    return {
        "message": f"Successfully withdrew {withdraw.amount}",
        "new_balance": updated_account["balance"],
        "account": serialize_account(updated_account)
    }
    

    
# Transfer money to another account----------------------
@router.post("/transfer")
async def transfer_money(transfer: TransferRequest, current_account: dict = Depends(get_current_user)):
    if transfer.amount <= 0:
        raise HTTPException(status_code=400, detail="Transfer amount must be positive")

    if transfer.amount > current_account["balance"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    receiver = await accounts_collection.find_one({"account_number": transfer.receiver_account_number})
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver account not found")

    if str(receiver["_id"]) == str(current_account["_id"]):
        raise HTTPException(status_code=400, detail="Cannot transfer money to your own account")

    new_sender_balance = round(current_account["balance"] - transfer.amount, 2)
    await accounts_collection.update_one(
        {"_id": current_account["_id"]},
        {"$set": {"balance": new_sender_balance}}
    )

    new_receiver_balance = round(receiver["balance"] + transfer.amount, 2)
    await accounts_collection.update_one(
        {"_id": receiver["_id"]},
        {"$set": {"balance": new_receiver_balance}}
    )

    sender_transaction = {
        "account_id": str(current_account["_id"]),
        "type": "transfer_sent",
        "amount": transfer.amount,
        "balance_after": new_sender_balance,
        "to_account": transfer.receiver_account_number,
        "timestamp": datetime.utcnow()
    }
    await transactions_collection.insert_one(sender_transaction)

    receiver_transaction = {
        "account_id": str(receiver["_id"]),
        "type": "transfer_received",
        "amount": transfer.amount,
        "balance_after": new_receiver_balance,
        "from_account": current_account["account_number"],
        "timestamp": datetime.utcnow()
    }
    await transactions_collection.insert_one(receiver_transaction)

    updated_sender = await accounts_collection.find_one({"_id": current_account["_id"]})

    return {
        "message": f"Successfully transferred {transfer.amount} to account {transfer.receiver_account_number}",
        "sender_new_balance": updated_sender["balance"],
        "receiver_new_balance": new_receiver_balance,
        "sender_account": serialize_account(updated_sender)
    }

# transaction history-----------------------

@router.get("/transactions")
async def get_transaction_history(current_account: dict = Depends(get_current_user)):
    if not current_account:
        raise HTTPException(status_code=404, detail="Account not found")

    account_id = str(current_account["_id"])

    cursor = transactions_collection.find({"account_id": account_id}).sort("timestamp", -1)

    transactions = []
    async for txn in cursor:
        txn["_id"] = str(txn["_id"])

        if "amount" in txn:
            txn["amount"] = round(float(txn["amount"]), 2)
        if "balance_after" in txn:
            txn["balance_after"] = round(float(txn["balance_after"]), 2)

        if "timestamp" in txn and isinstance(txn["timestamp"], datetime):
            txn["timestamp"] = txn["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

        transactions.append(txn)

    return {
        "account_number": current_account["account_number"],
        "total_transactions": len(transactions),
        "transactions": transactions
    }

