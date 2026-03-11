from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import supabase
from models import LoginRequest
from routers import contracts, portfolio

app = FastAPI(title="Energy Contract Marketplace API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

app.include_router(contracts.router)
app.include_router(portfolio.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
