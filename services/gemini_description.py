import json
from google.generativeai import GenerativeModel

# Create a separate file or manage the model object here. Example:
model = GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction="You are a travel guide who provides structured information about locations. Always return in JSON formats."
)

async def process_single_place(place, client, GOOGLE_PLACES_API_KEY):
    try:
        photo_url = None
        if place.get("photos"):
            photo_ref = place["photos"][0]["photo_reference"]
            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_ref}&key={GOOGLE_PLACES_API_KEY}"

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