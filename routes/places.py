from fastapi import APIRouter
import asyncio
import httpx
from main import GOOGLE_PLACES_API_KEY

router = APIRouter()

async def get_place_details(place_id: str, client: httpx.AsyncClient, api_key: str):
    details_url = "https://maps.googleapis.com/maps/api/place/details/json"
    details_params = {
        "place_id": place_id,
        "fields": "name,formatted_address,editorial_summary,rating,user_ratings_total,types,photos",
        "key": api_key
    }
    
    response = await client.get(details_url, params=details_params)
    return response.json().get("result", {})

async def process_single_place(place: dict, client: httpx.AsyncClient, api_key: str):
    try:
        details = await get_place_details(place["place_id"], client, api_key)
        
        # Get description from editorial summary or create from available data
        description = details.get("editorial_summary", {}).get("overview")
        if not description:
            place_types = [t.replace("_", " ").title() for t in place.get("types", [])[:2]]
            rating_text = f"Rated {place.get('rating', 'N/A')}/5 from {place.get('user_ratings_total', 0)} reviews" if place.get('rating') else ""
            description = f"{', '.join(place_types)}. {rating_text}"

        photo_url = None
        if place.get("photos"):
            photo_ref = place["photos"][0]["photo_reference"]
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={photo_ref}&key={api_key}"

        return {
            "name": place["name"],
            "location": {
                "lat": place["geometry"]["location"]["lat"],
                "lng": place["geometry"]["location"]["lng"]
            },
            "description": description,
            "photo_url": photo_url,
            "place_id": place["place_id"]
        }
    except Exception as e:
        print(f"Error processing place: {str(e)}")
        return None


@router.get("/places")
async def get_places(lat: float, lng: float, place_type: str = None):
    try:
        places_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        places_params = {
            "location": f"{lat},{lng}",
            "radius": "10000", # 10km radius
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