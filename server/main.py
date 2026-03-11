from fastapi import FastAPI, HTTPException, Query, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
import uuid
from database import supabase

app = FastAPI(title="Energy Contract Marketplace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractBase(BaseModel):
    energy_type: str
    quantity_mwh: float
    price_per_mwh: float
    delivery_start: date
    delivery_end: date
    location: str
    status: str
    provider: Optional[str] = None
    description: Optional[str] = None
    carbon_intensity: Optional[float] = None

class EnergyContract(ContractBase):
    id: str

class PortfolioItem(BaseModel):
    id: str
    user_id: str
    contract_id: str
    contract: Optional[EnergyContract] = None

class PortfolioMetrics(BaseModel):
    total_contracts: int
    total_capacity_mwh: float
    total_cost: float
    avg_price_per_mwh: float
    breakdown: dict

class ContractCreate(ContractBase):
    status: str = "Available"

class LoginRequest(BaseModel):
    email: str
    password: str

def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing authorization header")

    token = authorization.split(" ")[1]
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid session")
        return user.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))



@app.get("/contracts", response_model=List[EnergyContract])
def get_contracts(
    user: any = Depends(get_current_user),
    energy_types: Optional[List[str]] = Query(None),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_quantity: Optional[float] = None,
    max_quantity: Optional[float] = None,
    location: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
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

    response = query.execute()
    return response.data

@app.get("/contracts/{contract_id}", response_model=EnergyContract)
def get_contract(contract_id: str, user: any = Depends(get_current_user)):
    response = supabase.table("contracts").select("*").eq("id", contract_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Contract not found")
    return response.data

@app.post("/login")
def handle_login(request: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({"email": request.email, "password": request.password})
        return {
            "access_token": response.session.access_token,
            "user": {
                "id": response.user.id,
                "email": response.user.email
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/contracts", response_model=EnergyContract)
def create_contract(contract: ContractCreate, user: any = Depends(get_current_user)):
    response = supabase.table("contracts").insert(contract.model_dump()).execute()
    return response.data[0]

@app.put("/contracts/{contract_id}", response_model=EnergyContract)
def update_contract(contract_id: str, updated_contract: ContractCreate, user: any = Depends(get_current_user)):
    response = supabase.table("contracts").update(updated_contract.model_dump()).eq("id", contract_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Contract not found")
    return response.data[0]

@app.delete("/contracts/{contract_id}")
def delete_contract(contract_id: str, user: any = Depends(get_current_user)):
    response = supabase.table("contracts").delete().eq("id", contract_id).execute()
    return {"message": "Contract deleted"}

# Portfolio Endpoints

@app.post("/portfolio/{contract_id}")
def add_to_portfolio(contract_id: str, user: any = Depends(get_current_user)):
    user_id = user.id
    # Check if already in portfolio
    existing = supabase.table("portfolio").select("*").eq("user_id", user_id).eq("contract_id", contract_id).execute()
    if existing.data:
        return {"message": "Already in portfolio"}

    supabase.table("portfolio").insert({"user_id": user_id, "contract_id": contract_id}).execute()
    return {"message": "Added to portfolio"}

@app.delete("/portfolio/{contract_id}")
def remove_from_portfolio(contract_id: str, user: any = Depends(get_current_user)):
    user_id = user.id
    supabase.table("portfolio").delete().eq("user_id", user_id).eq("contract_id", contract_id).execute()
    return {"message": "Removed from portfolio"}

@app.get("/portfolio")
def get_portfolio(user: any = Depends(get_current_user)):
    user_id = user.id
    response = supabase.table("portfolio").select("*, contracts(*)").eq("user_id", user_id).execute()

    portfolio_contracts = [item["contracts"] for item in response.data if item["contracts"]]

    # Metrics Calculation
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)