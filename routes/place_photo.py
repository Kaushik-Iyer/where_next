from fastapi import APIRouter
import httpx
from main import GOOGLE_PLACES_API_KEY

router = APIRouter()

@router.get("/place_photo")
async def get_place_photo(place_name: str):
    try:
        search_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
        params = {
            "input": place_name,
            "inputtype": "textquery",
            "fields": "place_id",
            "key": GOOGLE_PLACES_API_KEY,
        }
        async with httpx.AsyncClient() as client:
            search_response = await client.get(search_url, params=params)
            if search_response.status_code != 200:
                return {"photo_url": None}
            search_data = search_response.json()
            if not search_data.get("candidates"):
                return {"photo_url": None}

            place_id = search_data["candidates"][0]["place_id"]

            details_url = "https://maps.googleapis.com/maps/api/place/details/json"
            details_params = {"place_id": place_id, "fields": "photos", "key": GOOGLE_PLACES_API_KEY}
            details_response = await client.get(details_url, params=details_params)
            if details_response.status_code != 200:
                return {"photo_url": None}
            details_data = details_response.json()
            if not details_data.get("result", {}).get("photos"):
                return {"photo_url": None}

            photo_ref = details_data["result"]["photos"][0]["photo_reference"]
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={GOOGLE_PLACES_API_KEY}"
            return {"photo_url": photo_url}
    except Exception as e:
        print(f"Error fetching photo: {str(e)}")
        return {"photo_url": None}