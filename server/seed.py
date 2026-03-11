import uuid
from database import supabase
from datetime import date, timedelta

contracts = [
    {"energy_type": "Solar", "quantity_mwh": 500, "price_per_mwh": 45.50, "delivery_start": "2026-03-01", "delivery_end": "2026-05-31", "location": "California", "status": "Available"},
    {"energy_type": "Wind", "quantity_mwh": 1200, "price_per_mwh": 38.75, "delivery_start": "2026-04-01", "delivery_end": "2026-09-30", "location": "Texas", "status": "Sold"},
    {"energy_type": "Natural Gas", "quantity_mwh": 800, "price_per_mwh": 52.00, "delivery_start": "2026-02-15", "delivery_end": "2026-08-15", "location": "Northeast", "status": "Reserved"},
    {"energy_type": "Nuclear", "quantity_mwh": 2000, "price_per_mwh": 65.00, "delivery_start": "2026-01-01", "delivery_end": "2026-12-31", "location": "Illinois", "status": "Available"},
    {"energy_type": "Hydro", "quantity_mwh": 1500, "price_per_mwh": 42.25, "delivery_start": "2026-05-01", "delivery_end": "2026-10-31", "location": "Washington", "status": "Available"},
    {"energy_type": "Coal", "quantity_mwh": 2500, "price_per_mwh": 32.00, "delivery_start": "2026-01-01", "delivery_end": "2026-12-31", "location": "West Virginia", "status": "Sold"},
    {"energy_type": "Solar", "quantity_mwh": 350, "price_per_mwh": 48.00, "delivery_start": "2026-06-01", "delivery_end": "2026-08-31", "location": "Arizona", "status": "Available"},
    {"energy_type": "Wind", "quantity_mwh": 900, "price_per_mwh": 40.50, "delivery_start": "2026-03-15", "delivery_end": "2026-06-15", "location": "Iowa", "status": "Reserved"},
    {"energy_type": "Geothermal", "quantity_mwh": 250, "price_per_mwh": 55.00, "delivery_start": "2026-01-01", "delivery_end": "2026-12-31", "location": "Nevada", "status": "Available"},
    {"energy_type": "Coal", "quantity_mwh": 1800, "price_per_mwh": 34.50, "delivery_start": "2026-03-01", "delivery_end": "2026-08-31", "location": "Kentucky", "status": "Available"},
    {"energy_type": "Solar", "quantity_mwh": 600, "price_per_mwh": 44.00, "delivery_start": "2026-04-01", "delivery_end": "2026-07-31", "location": "Florida", "status": "Available"},
    {"energy_type": "Wind", "quantity_mwh": 1100, "price_per_mwh": 39.25, "delivery_start": "2026-05-15", "delivery_end": "2026-11-15", "location": "Oklahoma", "status": "Sold"},
    {"energy_type": "Natural Gas", "quantity_mwh": 750, "price_per_mwh": 51.50, "delivery_start": "2026-03-01", "delivery_end": "2026-09-30", "location": "Ohio", "status": "Available"},
    {"energy_type": "Hydro", "quantity_mwh": 1300, "price_per_mwh": 41.75, "delivery_start": "2026-04-01", "delivery_end": "2026-08-31", "location": "Oregon", "status": "Reserved"},
    {"energy_type": "Solar", "quantity_mwh": 450, "price_per_mwh": 46.50, "delivery_start": "2026-02-01", "delivery_end": "2026-05-31", "location": "Georgia", "status": "Available"},
    {"energy_type": "Oil", "quantity_mwh": 1000, "price_per_mwh": 75.00, "delivery_start": "2026-01-01", "delivery_end": "2026-12-31", "location": "Texas", "status": "Available"},
    {"energy_type": "Oil", "quantity_mwh": 500, "price_per_mwh": 78.50, "delivery_start": "2026-06-01", "delivery_end": "2026-12-31", "location": "Louisiana", "status": "Available"}
]

def seed():
    print("--- Energy Marketplace Seeding Utility ---")

    # Check for tables existence and seed contracts if empty
    try:
        # 1. Check/Seed Contracts
        contract_resp = supabase.table("contracts").select("*", count="exact").limit(1).execute()
        contract_count = contract_resp.count if contract_resp.count is not None else 0

        if contract_count > 0:
            print(f"[SKIP] Table 'contracts' already contains {contract_count} records.")
        else:
            print("[INFO] Table 'contracts' is empty. Beginning seed...")
            supabase.table("contracts").insert(contracts).execute()
            print(f"[SUCCESS] Successfully seeded {len(contracts)} contracts.")

        # 2. Verify Portfolio table exists
        supabase.table("portfolio").select("id").limit(1).execute()
        print("[OK] Table 'portfolio' exists.")

    except Exception as e:
        err_msg = str(e).lower()
        if ("relation" in err_msg and "does not exist" in err_msg) or "pgrst205" in err_msg or "schema cache" in err_msg:
            print("\n[!] ERROR: Required tables are missing.")
            print("Please run the following SQL in your Supabase SQL Editor to create the necessary tables:\n")
            print("""-- 1. Create Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    energy_type TEXT NOT NULL,
    quantity_mwh NUMERIC NOT NULL,
    price_per_mwh NUMERIC NOT NULL,
    delivery_start DATE NOT NULL,
    delivery_end DATE NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'Available',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Portfolio Table
CREATE TABLE IF NOT EXISTS portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, contract_id)
);""")
            print("\nAfter creating the tables, run this script again to seed the data.")
        else:
            print(f"[ERROR] An unexpected error occurred: {e}")

if __name__ == "__main__":
    seed()