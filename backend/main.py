from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from auth import verify_api_key
from model import predict, load_model
from database import log_request
import time

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="SceneScript API",
    version="1.0.0",
    description="AI-powered multimodal content moderation API. Built on KID-VLM research."
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    load_model()

@app.get("/")
def root():
    return {
        "name": "SceneScript API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/v1/health"
    }

@app.get("/v1/health")
def health():
    return {"status": "ok", "model": "scenescript-v1"}

@app.post("/v1/moderate")
@limiter.limit("10/minute")
async def moderate(
    request: Request,
    image: UploadFile = File(...),
    text: str = Form(...),
    api_key: str = Depends(verify_api_key)
):
    start = time.time()
    result = predict(await image.read(), text)
    result["latency_ms"] = round((time.time() - start) * 1000, 2)
    log_request(api_key, result["label"], result["latency_ms"])
    return result

@app.post("/v1/moderate/batch")
@limiter.limit("5/minute")
async def moderate_batch(
    request: Request,
    images: list[UploadFile] = File(...),
    texts: list[str] = Form(...),
    api_key: str = Depends(verify_api_key)
):
    if len(images) != len(texts):
        raise HTTPException(400, "Number of images and texts must match")
    if len(images) > 10:
        raise HTTPException(400, "Maximum 10 items per batch request")
    results = []
    for img, txt in zip(images, texts):
        results.append(predict(await img.read(), txt))
    return {"results": results, "count": len(results)}

@app.post("/v1/explain")
@limiter.limit("5/minute")
async def explain(
    request: Request,
    image: UploadFile = File(...),
    text: str = Form(...),
    api_key: str = Depends(verify_api_key)
):
    start = time.time()
    result = predict(await image.read(), text, explain=True)
    result["latency_ms"] = round((time.time() - start) * 1000, 2)
    log_request(api_key, result["label"], result["latency_ms"])
    return result
