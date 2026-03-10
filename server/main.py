from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
import uuid

app = FastAPI(title="Energy Contract Marketplace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EnergyContract(BaseModel):
    id: str
    energy_type: str
    quantity_mwh: float
    price_per_mwh: float
    delivery_start: date
    delivery_end: date
    location: str
    status: str

class ContractCreate(BaseModel):
    energy_type: str
    quantity_mwh: float
    price_per_mwh: float
    delivery_start: date
    delivery_end: date
    location: str
    status: str = "Available"

# In-memory database
contracts = [
    {
        "id": "1",
        "energy_type": "Solar",
        "quantity_mwh": 500,
        "price_per_mwh": 45.50,
        "delivery_start": "2024-06-01",
        "delivery_end": "2024-12-31",
        "location": "California",
        "status": "Available"
    },
    {
        "id": "2",
        "energy_type": "Wind",
        "quantity_mwh": 1200,
        "price_per_mwh": 38.00,
        "delivery_start": "2024-07-01",
        "delivery_end": "2025-06-30",
        "location": "Texas",
        "status": "Reserved"
    },
    {
        "id": "3",
        "energy_type": "Nuclear",
        "quantity_mwh": 5000,
        "price_per_mwh": 60.00,
        "delivery_start": "2024-05-01",
        "delivery_end": "2026-05-01",
        "location": "Northeast",
        "status": "Sold"
    }
]

@app.get("/contracts", response_model=List[EnergyContract])
def get_contracts():
    return contracts

@app.get("/contracts/{contract_id}", response_model=EnergyContract)
def get_contract(contract_id: str):
    contract = next((c for c in contracts if c["id"] == contract_id), None)
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    return contract

@app.post("/contracts", response_model=EnergyContract)
def create_contract(contract: ContractCreate):
    new_contract = contract.dict()
    new_contract["id"] = str(uuid.uuid4())
    contracts.append(new_contract)
    return new_contract

@app.put("/contracts/{contract_id}", response_model=EnergyContract)
def update_contract(contract_id: str, updated_contract: ContractCreate):
    index = next((i for i, c in enumerate(contracts) if c["id"] == contract_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Contract not found")

    contracts[index].update(updated_contract.dict())
    return contracts[index]

@app.delete("/contracts/{contract_id}")
def delete_contract(contract_id: str):
    index = next((i for i, c in enumerate(contracts) if c["id"] == contract_id), None)
    if index is None:
        raise HTTPException(status_code=404, detail="Contract not found")

    contracts.pop(index)
    return {"message": "Contract deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)