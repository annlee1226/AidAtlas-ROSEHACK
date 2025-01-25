from flask import Flask, request, jsonify
import requests

app = Flask(__name__)






@app.route('/location', methods=['POST'])
def location():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    print(f"Received Latitude: {latitude}, Longitude: {longitude}")


    # url = f'https://gis.fema.gov/arcgis/rest/services/NSS/OpenShelters/MapServer/0/query?geometry={latitude},{longitude}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&distance=10&units=esriSRUnit_StatuteMile&outFields=*&f=json'
    


    return jsonify({"status": "success", "latitude": latitude, "longitude": longitude})






@app.route('/')
def home():
    return "HOMMEEE"


if __name__ == "__main__":
    app.run(debug=True)


