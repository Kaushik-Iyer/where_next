import httpx
from main import GOOGLE_MAPS_API_KEY

async def is_on_land(lat: float, lng: float) -> bool:
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"latlng": f"{lat},{lng}", "key": GOOGLE_MAPS_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
    if response.status_code != 200:
        return False
    data = response.json()
    results = data.get("results", [])
    return len(results) > 0

async def get_country_from_coords(lat: float, lng: float) -> str:
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {"latlng": f"{lat},{lng}", "key": GOOGLE_MAPS_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            for result in data.get("results", []):
                for component in result.get("address_components", []):
                    if "country" in component["types"]:
                        return component["long_name"]
    return "Unknown Country"