from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from db.seed_data import seed_database
from api import auth, orders, risk, graph, investigate, appeals, audit, metrics

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Multi-Actor Fraud Detection & Remediation Platform powered by Graph AI, IEEE-CIS ML, Multi-Agent Systems, and Cryptographic SHA-256 Audit Trail."
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize and seed DB on startup
@app.on_event("startup")
def startup_event():
    seed_database()

# Include API Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(orders.router, prefix=settings.API_PREFIX)
app.include_router(risk.router, prefix=settings.API_PREFIX)
app.include_router(graph.router, prefix=settings.API_PREFIX)
app.include_router(investigate.router, prefix=settings.API_PREFIX)
app.include_router(appeals.router, prefix=settings.API_PREFIX)
app.include_router(audit.router, prefix=settings.API_PREFIX)
app.include_router(metrics.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "status": "ONLINE",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_prefix": settings.API_PREFIX
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
