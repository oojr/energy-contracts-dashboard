from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import date

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
