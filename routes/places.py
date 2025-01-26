from fastapi import APIRouter
import asyncio
import httpx
from main import GOOGLE_PLACES_API_KEY
from services.gemini_description import process_single_place

router = APIRouter()

@router.get("/places")
async def get_places(lat: float, lng: float, place_type: str = None):
    try:
        places_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        places_params = {
            "location": f"{lat},{lng}",
            "radius": "10000",
            "type": "tourist_attraction" if not place_type else place_type,
            "key": GOOGLE_PLACES_API_KEY
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(places_url, params=places_params)
            data = response.json()

            if not data.get("results"):
                return {"places": []}

            nearby_places = data["results"][:4]
            tasks = [process_single_place(place, client, GOOGLE_PLACES_API_KEY) for place in nearby_places]
            formatted_places = await asyncio.gather(*tasks)

            formatted_places = [p for p in formatted_places if p is not None]
            return {"origin": {"lat": lat, "lng": lng}, "places": formatted_places}
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"places": []}