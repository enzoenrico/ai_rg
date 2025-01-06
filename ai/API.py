from fastapi import FastAPI, HTTPException, Depends, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import logging
from datetime import datetime
import time
from RAG import RAG
import uvicorn
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Digital Self API",
    description="API for interacting with your digital self",
    version="1.0.0",
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return _rate_limit_exceeded_handler(request, exc)


# Initialize RAG instance
rag = RAG()


# Request/Response models
class Query(BaseModel):
    query: str


class Response(BaseModel):
    response: str
    timestamp: str


# Auth middleware
async def verify_token(x_token: str = Header(...)):
    if x_token != "your-secret-token":  # Replace with secure token validation
        raise HTTPException(status_code=401, detail="Invalid X-Token header")
    return x_token


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


# Main query endpoint
@app.post("/ai", response_model=Response)
@limiter.limit("5/minute")
async def query_ai(request: Request, query: Query, token: str = Depends(verify_token)):
    try:
        logger.info(f"Received query: {query.query}")
        response = rag.query(query.query)
        return Response(response=response, timestamp=datetime.now().isoformat())
    except Exception as e:
        logger.error(f"Error processing query: {str(e)}")
        raise HTTPException(
            status_code=500, detail="An error occurred while processing your request"
        )


# Error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global error handler caught: {str(exc)}")
    return JSONResponse(
        status_code=500, content={"detail": "An unexpected error occurred"}
    )


if __name__ == "__main__":
    uvicorn.run("API:app", host="0.0.0.0", port=5000, reload=True, log_level="info")
