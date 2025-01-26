from flask import Flask, request, jsonify
import requests

app = Flask(__name__)


your_location = {"latitude": None, "longitude": None}


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
        "distance": 10,
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


@app.route('/searchVolunteering', methods=['POST'])
def searchVolunteering():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    params = {"latitude" : latitude, "longitude": longitude, "scope": "regional", "page_size":10 }
    volunteer_url = "https://www.volunteerconnector.org/api/search/"
    response = requests.get(volunteer_url, params=params)
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch volunteer opportunities."}), 500

    data = response.json()
    results = data.get("results", [])
    volunteer_jobs = [{
        "title": result["title"],
            "description": result["description"],
            "url": result["url"],
            "organization_name": result["organization"]["name"],
            "organization_url": result["organization"]["url"],
            "remote_or_online": result["remote_or_online"],
        }
        for result in results
    ]
    return jsonify({"volunteer_jobs": volunteer_jobs})


@app.route('/')
def home():
    return "HOMMEEE"


if __name__ == "__main__":
    app.run(debug=True)


