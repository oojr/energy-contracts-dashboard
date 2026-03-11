import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

@app.post("/api/login")
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

app.include_router(contracts.router, prefix="/api")
app.include_router(portfolio.router, prefix="/api")

# Serve static files from the Vite build directory
client_dist_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "client", "dist")

@app.get("/{path:path}")
async def serve_spa(path: str):
    # Check if the requested path corresponds to a real file (like .js, .css, .svg)
    file_path = os.path.join(client_dist_path, path)
    if path != "" and os.path.isfile(file_path):
        return FileResponse(file_path)
    # For any other route, serve index.html to support SPA client-side routing
    index_path = os.path.join(client_dist_path, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)
    return {"error": "Frontend build not found. Run 'npm run build' in the client directory."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
