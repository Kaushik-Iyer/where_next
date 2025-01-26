from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from main import templates, GOOGLE_MAPS_API_KEY

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "google_maps_api_key": GOOGLE_MAPS_API_KEY})