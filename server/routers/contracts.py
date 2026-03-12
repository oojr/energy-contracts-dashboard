from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from datetime import date, datetime
from database import get_supabase
from models import EnergyContract, ContractCreate
from auth import get_current_user

router = APIRouter(prefix="/contracts", tags=["contracts"])

@router.get("/trends")
def get_price_trends(user: any = Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("contracts").select("energy_type, price_per_mwh, delivery_start").execute()
    data = response.data

    trends = {}
    for item in data:
        dt = datetime.strptime(item["delivery_start"], "%Y-%m-%d")
        month = dt.strftime("%Y-%m")
        etype = item["energy_type"]

        if month not in trends:
            trends[month] = {}
        if etype not in trends[month]:
            trends[month][etype] = []

        trends[month][etype].append(item["price_per_mwh"])

    result = []
    sorted_months = sorted(trends.keys())
    for month in sorted_months:
        entry = {"month": month}
        for etype, prices in trends[month].items():
            entry[etype] = sum(prices) / len(prices)
        result.append(entry)

    return result

@router.get("", response_model=List[EnergyContract])
def get_contracts(
    user: any = Depends(get_current_user),
    energy_types: Optional[List[str]] = Query(None),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_quantity: Optional[float] = None,
    max_quantity: Optional[float] = None,
    location: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    sort_by: Optional[str] = "delivery_start",
    sort_order: Optional[str] = "asc"
):
    supabase = get_supabase()
    query = supabase.table("contracts").select("*")

    if energy_types:
        query = query.in_("energy_type", energy_types)
    if min_price is not None:
        query = query.gte("price_per_mwh", min_price)
    if max_price is not None:
        query = query.lte("price_per_mwh", max_price)
    if min_quantity is not None:
        query = query.gte("quantity_mwh", min_quantity)
    if max_quantity is not None:
        query = query.lte("quantity_mwh", max_quantity)
    if location:
        query = query.ilike("location", f"%{location}%")
    if start_date:
        query = query.gte("delivery_start", start_date.isoformat())
    if end_date:
        query = query.lte("delivery_end", end_date.isoformat())

    if sort_by:
        query = query.order(sort_by, desc=(sort_order == "desc"))

    response = query.execute()
    return response.data

@router.get("/{contract_id}", response_model=EnergyContract)
def get_contract(contract_id: str, user: any = Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("contracts").select("*").eq("id", contract_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Contract not found")
    return response.data

@router.post("", response_model=EnergyContract)
def create_contract(contract: ContractCreate, user: any = Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("contracts").insert(contract.model_dump()).execute()
    return response.data[0]

@router.put("/{contract_id}", response_model=EnergyContract)
def update_contract(contract_id: str, updated_contract: ContractCreate, user: any = Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("contracts").update(updated_contract.model_dump()).eq("id", contract_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Contract not found")
    return response.data[0]

@router.delete("/{contract_id}")
def delete_contract(contract_id: str, user: any = Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("contracts").delete().eq("id", contract_id).execute()
    return {"message": "Contract deleted"}

@router.post("/{contract_id}/sell", response_model=EnergyContract)
def sell_contract(contract_id: str, user: any = Depends(get_current_user)):
    supabase = get_supabase()
    response = supabase.table("contracts").update({"status": "Sold"}).eq("id", contract_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Contract not found")
    return response.data[0]
