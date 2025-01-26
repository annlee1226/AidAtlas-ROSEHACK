from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from geopy.geocoders import Nominatim

app = Flask(__name__)
CORS(app)

your_location = {"latitude": None, "longitude": None}
geolocator = Nominatim(user_agent="geoapi")

@app.route('/location', methods=['POST'])
def location():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')


    your_location["latitude"] = latitude
    your_location["longitude"] = longitude

    print(f"Received Latitude: {latitude}, Longitude: {longitude}")


    return jsonify({"status": "success", "latitude": latitude, "longitude": longitude})



@app.route('/shelters')
def shelters():
    latitude = your_location.get("latitude")
    longitude = your_location.get("longitude")


    if not latitude or not longitude:
        return jsonify({"error": "Latitude and longitude not detected"}), 400

    url = f'https://gis.fema.gov/arcgis/rest/services/NSS/OpenShelters/MapServer/0/query'
    parameters = {
        "geometry": f"{longitude},{latitude}",
        "geometryType": "esriGeometryPoint",
        "spatialRel": "esriSpatialRelIntersects",
        "distance": 100,
        "units": "esriSRUnit_StatuteMile",
        "outFields": "*",
        "f": "json"
    }

    response = requests.get(url, params=parameters)

    if response.status_code == 200:
        available_shelters = response.json()
        return jsonify(available_shelters)
    else:
        return jsonify(f"Error {response.status_code}, no available shelters")


@app.route('/searchLocalJobs', methods=['POST'])
def searchLocalJobs():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    # Get the country using geopy
    geolocator = Nominatim(user_agent="myApp")
    location = geolocator.reverse((latitude, longitude))
    if location:
        country = location.raw.get('address', {}).get('country', 'Country not found')
        city = location.raw.get('address', {}).get('city', 'City not found')
    else:
        return jsonify({"error": "Location could not be determined"}), 400

    # Reliefweb API query
    query = {
        "filter": {
            "conditions": [
                {"field": "country.name", "value": country}
            ]
        },
        "fields": {
            "include": ["title", "country", "city", "url"]
        },
        "limit": 10  # Adjust as needed
    }

    reliefweb_url = "https://api.reliefweb.int/v1/jobs"

    # Request volunteer data from the API
    response = requests.post(reliefweb_url, json=query)
    
    if response.status_code == 200:
        data = response.json()
        filtered_jobs = []
        
        for job in data.get('data', []):
            job_fields = job.get('fields', {})
            filtered_jobs.append({
                "title": job_fields.get('title', ''),
                "country": [c['name'] for c in job_fields.get('country', [])],
                "city": [c['name'] for c in job_fields.get('city', [])],
                "url": job_fields.get('url', '')
            })
        
        if not filtered_jobs:
            return jsonify({"message": "No job listings were found"}), 404
        
        return jsonify(filtered_jobs)
    else:
        return jsonify({
            "error": "Failed to retrieve volunteer data", 
            "status_code": response.status_code
        }), response.status_code    
@app.route('/')
def home():
    return "HOMMEEE"


if __name__ == "__main__":
    app.run(debug=True)


