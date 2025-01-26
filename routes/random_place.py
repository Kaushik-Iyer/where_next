from fastapi import APIRouter
import random
import httpx
from main import GOOGLE_MAPS_API_KEY
from services.coords import is_on_land
router = APIRouter()

@router.get("/random")
async def get_random_place(country: str = None, continent: str = None):
    try:
        if country:
            return await get_random_in_country(country)
        elif continent:
            return await get_random_in_continent(continent)
        return await get_global_random()
    except Exception as e:
        print(f"Error in random: {str(e)}")
        return await get_global_random()

async def get_random_in_continent(continent: str):
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": continent, "key": GOOGLE_MAPS_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(geocode_url, params=params)
        data = response.json()

        if not data.get("results"):
            return await get_global_random()

        bounds = data["results"][0]["geometry"]["viewport"]
        max_attempts = 10
        attempts = 0

        while attempts < max_attempts:
            lat = random.uniform(bounds["southwest"]["lat"], bounds["northeast"]["lat"])
            lng = random.uniform(bounds["southwest"]["lng"], bounds["northeast"]["lng"])
            verify_params = {"latlng": f"{lat},{lng}", "key": GOOGLE_MAPS_API_KEY}
            verify_response = await client.get(geocode_url, params=verify_params)
            verify_data = verify_response.json()

            for result in verify_data.get("results", []):
                for component in result.get("address_components", []):
                    if "continent" in component["types"]:
                        if component["long_name"].lower() == continent.lower():
                            return {
                                "lat": lat,
                                "lng": lng,
                                "continent": continent,
                                "formatted_address": result["formatted_address"],
                            }
            attempts += 1
    return await get_global_random()

async def get_random_in_country(country: str):
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"address": country, "key": GOOGLE_MAPS_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(geocode_url, params=params)
        data = response.json()

        if not data.get("results"):
            return await get_global_random()

        bounds = data["results"][0]["geometry"]["viewport"]
        max_attempts = 10
        attempts = 0

        while attempts < max_attempts:
            lat = random.uniform(bounds["southwest"]["lat"], bounds["northeast"]["lat"])
            lng = random.uniform(bounds["southwest"]["lng"], bounds["northeast"]["lng"])
            verify_params = {"latlng": f"{lat},{lng}", "key": GOOGLE_MAPS_API_KEY}
            vr = await client.get(geocode_url, params=verify_params)
            vdata = vr.json()

            for result in vdata.get("results", []):
                for component in result.get("address_components", []):
                    if "country" in component["types"]:
                        if component["long_name"].lower() == country.lower():
                            return {
                                "lat": lat,
                                "lng": lng,
                                "country": country,
                                "formatted_address": result["formatted_address"],
                            }
            attempts += 1
    return await get_global_random()

async def get_global_random():
    max_attempts = 10
    attempts = 0
    while attempts < max_attempts:
        lat = random.uniform(-90, 90)
        lng = random.uniform(-180, 180)
        if await is_on_land(lat, lng):
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {"latlng": f"{lat},{lng}", "key": GOOGLE_MAPS_API_KEY}
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("results"):
                        return {
                            "lat": lat,
                            "lng": lng,
                            "formatted_address": data["results"][0]["formatted_address"],
                        }
        attempts += 1
    return {"lat": random.uniform(-90, 90), "lng": random.uniform(-180, 180), "formatted_address": "Unknown Location"}