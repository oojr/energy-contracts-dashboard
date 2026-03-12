from fastapi import APIRouter, Depends
from database import get_supabase
from auth import get_current_user

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

@router.post("/{contract_id}")
def add_to_portfolio(contract_id: str, user: any = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user.id
    existing = supabase.table("portfolio").select("*").eq("user_id", user_id).eq("contract_id", contract_id).execute()
    if existing.data:
        return {"message": "Already in portfolio"}

    supabase.table("portfolio").insert({"user_id": user_id, "contract_id": contract_id}).execute()
    return {"message": "Added to portfolio"}

@router.delete("/{contract_id}")
def remove_from_portfolio(contract_id: str, user: any = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user.id
    supabase.table("portfolio").delete().eq("user_id", user_id).eq("contract_id", contract_id).execute()
    return {"message": "Removed from portfolio"}

@router.get("")
def get_portfolio(user: any = Depends(get_current_user)):
    supabase = get_supabase()
    user_id = user.id
    response = supabase.table("portfolio").select("*, contracts(*)").eq("user_id", user_id).execute()

    portfolio_contracts = [item["contracts"] for item in response.data if item["contracts"]]

    total_contracts = len(portfolio_contracts)
    total_capacity = sum(c["quantity_mwh"] for c in portfolio_contracts)
    total_cost = sum(c["quantity_mwh"] * c["price_per_mwh"] for c in portfolio_contracts)
    avg_price = total_cost / total_capacity if total_capacity > 0 else 0

    breakdown = {}
    for c in portfolio_contracts:
        etype = c["energy_type"]
        breakdown[etype] = breakdown.get(etype, 0) + c["quantity_mwh"]

    return {
        "contracts": portfolio_contracts,
        "metrics": {
            "total_contracts": total_contracts,
            "total_capacity_mwh": total_capacity,
            "total_cost": total_cost,
            "average_price_per_mwh": avg_price,
            "breakdown_by_type": breakdown
        }
    }
