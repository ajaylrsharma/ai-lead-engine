import os
import requests

GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY', '')
TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"


def scrape_google_maps(query: str, location: str = '', max_results: int = 20) -> list:
    if not GOOGLE_MAPS_API_KEY:
        return []

    search_query = f"{query} {location}".strip()
    params = {'query': search_query, 'key': GOOGLE_MAPS_API_KEY}

    try:
        resp = requests.get(TEXT_SEARCH_URL, params=params, timeout=10)
        resp.raise_for_status()
        places = resp.json().get('results', [])[:max_results]
    except Exception:
        return []

    results = []
    for place in places:
        details = _get_place_details(place.get('place_id', ''))
        results.append({
            'name': place.get('name', ''),
            'address': place.get('formatted_address', ''),
            'category': ', '.join(place.get('types', [])[:2]).replace('_', ' '),
            'rating': place.get('rating'),
            'phone': details.get('phone', ''),
            'website': details.get('website', ''),
        })

    return results


def _get_place_details(place_id: str) -> dict:
    if not place_id:
        return {}
    params = {
        'place_id': place_id,
        'fields': 'formatted_phone_number,website',
        'key': GOOGLE_MAPS_API_KEY,
    }
    try:
        resp = requests.get(DETAILS_URL, params=params, timeout=10)
        data = resp.json().get('result', {})
        return {
            'phone': data.get('formatted_phone_number', ''),
            'website': data.get('website', ''),
        }
    except Exception:
        return {}
