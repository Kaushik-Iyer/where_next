from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import google.generativeai as genai
import httpx
import os
import json
import random
import asyncio
from dotenv import load_dotenv
app = FastAPI()

load_dotenv()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="""You are a travel guide who provides structured information about locations.
    Always return in JSON formats."""
)

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "google_maps_api_key": GOOGLE_MAPS_API_KEY})

async def get_country_from_coords(lat: float, lng: float) -> str:
    """Get country name from coordinates using Google Geocoding API"""
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "latlng": f"{lat},{lng}",
        "key": GOOGLE_MAPS_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            for result in data.get("results", []):
                for component in result.get("address_components", []):
                    if "country" in component["types"]:
                        return component["long_name"]
    return "Unknown Country"

async def process_single_place(place, client):
    """Process a single place concurrently"""
    try:
        # Get photo
        photo_url = None
        if place.get("photos"):
            photo_ref = place["photos"][0]["photo_reference"]
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={GOOGLE_PLACES_API_KEY}"
        
        # Get Gemini description
        prompt = f"""Describe {place['name']} in one interesting sentence. Return in format: {{"description": "your description here"}}"""
        description = model.generate_content(prompt).text
        start_idx = description.find('{')
        end_idx = description.rfind('}') + 1
        
        return {
            "name": place["name"],
            "description": json.loads(description[start_idx:end_idx])["description"],
            "photo_url": photo_url,
            "location": {
                "lat": place["geometry"]["location"]["lat"],
                "lng": place["geometry"]["location"]["lng"]
            }
        }
    except Exception as e:
        print(f"Error processing place {place['name']}: {str(e)}")
        return None

@app.get("/places")
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
            places_response = await client.get(places_url, params=places_params)
            places_data = places_response.json()
            
            if not places_data.get("results"):
                return {"places": []}
            
            nearby_places = places_data["results"][:4]
            
            # Process all places concurrently
            tasks = [process_single_place(place, client) for place in nearby_places]
            formatted_places = await asyncio.gather(*tasks)
            
            # Filter out any failed places
            formatted_places = [p for p in formatted_places if p is not None]
            
            return {
                "origin": {"lat": lat, "lng": lng},
                "places": formatted_places
            }
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return {"places": []}
        

async def is_on_land(lat: float, lng: float) -> bool:
    """Check if coordinates are on land using Google Maps Geocoding API"""
    url = f"https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "latlng": f"{lat},{lng}",
        "key": GOOGLE_MAPS_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        
    if response.status_code != 200:
        return False
        
    data = response.json()
    results = data.get("results", [])
    return len(results) > 0  # If we get results, it's likely on land

CONTINENT_BOUNDS = {
    "Africa": {"north": 37.5, "south": -35, "west": -17.5, "east": 51.5},
    "Asia": {"north": 82, "south": -8, "west": 26, "east": 170},
    "Europe": {"north": 71, "south": 36, "west": -11, "east": 40},
    "North America": {"north": 83, "south": 7, "west": -167, "east": -52},
    "South America": {"north": 12.5, "south": -55, "west": -81, "east": -34},
    "Oceania": {"north": -0, "south": -47, "west": 110, "east": 180}
}

@app.get("/random")
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
    """Generate random coordinates within a specific continent"""
    # Get continent bounds
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": continent,
        "key": GOOGLE_MAPS_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(geocode_url, params=params)
        data = response.json()
        
        if not data.get("results"):
            return await get_global_random()
            
        bounds = data["results"][0]["geometry"]["viewport"]
        max_attempts = 10
        attempts = 0
        
        while attempts < max_attempts:
            lat = random.uniform(
                bounds["southwest"]["lat"],
                bounds["northeast"]["lat"]
            )
            lng = random.uniform(
                bounds["southwest"]["lng"],
                bounds["northeast"]["lng"]
            )
            
            # Verify point is in continent
            verify_params = {
                "latlng": f"{lat},{lng}",
                "key": GOOGLE_MAPS_API_KEY
            }
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
                                "formatted_address": result["formatted_address"]
                            }
            attempts += 1
    
    return await get_global_random()

async def get_random_in_country(country: str):
    """Generate random coordinates within a specific country"""
    # Get country bounds
    geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "address": country,
        "key": GOOGLE_MAPS_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(geocode_url, params=params)
        data = response.json()
        
        if not data.get("results"):
            return await get_global_random()
            
        bounds = data["results"][0]["geometry"]["viewport"]
        max_attempts = 10
        attempts = 0
        
        while attempts < max_attempts:
            lat = random.uniform(
                bounds["southwest"]["lat"],
                bounds["northeast"]["lat"]
            )
            lng = random.uniform(
                bounds["southwest"]["lng"],
                bounds["northeast"]["lng"]
            )
            
            # Verify point is in country
            verify_params = {
                "latlng": f"{lat},{lng}",
                "key": GOOGLE_MAPS_API_KEY
            }
            verify_response = await client.get(geocode_url, params=verify_params)
            verify_data = verify_response.json()
            
            for result in verify_data.get("results", []):
                for component in result.get("address_components", []):
                    if "country" in component["types"]:
                        if component["long_name"].lower() == country.lower():
                            return {
                                "lat": lat,
                                "lng": lng,
                                "country": country,
                                "formatted_address": result["formatted_address"]
                            }
            
            attempts += 1
    
    return await get_global_random()

async def get_global_random():
    """Generate random coordinates anywhere on land"""
    max_attempts = 10
    attempts = 0
    
    while attempts < max_attempts:
        lat = random.uniform(-90, 90)
        lng = random.uniform(-180, 180)
        
        if await is_on_land(lat, lng):
            # Get address using reverse geocoding
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                "latlng": f"{lat},{lng}",
                "key": GOOGLE_MAPS_API_KEY
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("results"):
                        return {
                            "lat": lat,
                            "lng": lng,
                            "formatted_address": data["results"][0]["formatted_address"]
                        }
        attempts += 1
    
    # Fallback if no valid location found
    return {
        "lat": random.uniform(-90, 90),
        "lng": random.uniform(-180, 180),
        "formatted_address": "Unknown Location"
    }

async def is_in_continent(lat: float, lng: float, continent: str) -> bool:
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    params = {
        "latlng": f"{lat},{lng}",
        "key": GOOGLE_MAPS_API_KEY
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            for result in data.get("results", []):
                for component in result.get("address_components", []):
                    if "continent" in component.get("types", []):
                        return component["long_name"] == continent
    return False

@app.get("/place_photo")
async def get_place_photo(place_name: str):
    try:
        # Step 1: Get Place ID
        search_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
        search_params = {
            "input": place_name,
            "inputtype": "textquery",
            "fields": "place_id",
            "key": GOOGLE_PLACES_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            search_response = await client.get(search_url, params=search_params)
            if search_response.status_code != 200:
                return {"photo_url": None}
            
            search_data = search_response.json()
            if not search_data.get("candidates"):
                return {"photo_url": None}
            
            place_id = search_data["candidates"][0]["place_id"]
            
            # Step 2: Get photo reference
            details_url = "https://maps.googleapis.com/maps/api/place/details/json"
            details_params = {
                "place_id": place_id,
                "fields": "photos",
                "key": GOOGLE_PLACES_API_KEY
            }
            
            details_response = await client.get(details_url, params=details_params)
            if details_response.status_code != 200:
                return {"photo_url": None}
            
            details_data = details_response.json()
            if not details_data.get("result", {}).get("photos"):
                return {"photo_url": None}
            
            # Step 3: Generate photo URL
            photo_reference = details_data["result"]["photos"][0]["photo_reference"]
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={GOOGLE_PLACES_API_KEY}"
            
            return {"photo_url": photo_url}
            
    except Exception as e:
        print(f"Error fetching photo: {str(e)}")
        return {"photo_url": None}