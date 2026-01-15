def format_currency(amount: float):
    return f"₹{amount:,.2f}"

def calculate_total_loans(loans):
    return sum(loan.get("amount", 0) for loan in loans)
