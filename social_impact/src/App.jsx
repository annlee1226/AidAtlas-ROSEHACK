import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markericon from './assets/markericon.png';
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { setLocation, getShelters } from './location.jsx';


function App() {
  const current_theme = localStorage.getItem('current_theme');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shelters, setShelters] = useState([]);
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  const customIcon = new Icon({
    iconUrl: markericon,
    iconSize: [38, 38],
  })

  const markers = [
    {
      geocode: [48.86, 2.3522],
      popUp: "Hello, I am pop up 1"
    },
    {
      geocode: [48.85, 2.3522],
      popUp: "Hello, I am pop up 2"
    },
    {
      geocode: [48.855, 2.34],
      popUp: "Hello, I am pop up 3"
    }
  ];


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Geolocation coordinates:", { latitude, longitude });
  
          // Directly set the currentLocation
          setCurrentLocation({ lat: latitude, lng: longitude });
  
          try {
            // Send the location to the backend
            const backendResponse = await setLocation(latitude, longitude);
            console.log("Backend response:", backendResponse);
  
            // Fetch shelter data based on user's location
            const sheltersData = await getShelters(latitude, longitude);
            console.log("Shelters data:", sheltersData);
  
            // Assuming the shelter data has a `features` array with coordinates
            setShelters(sheltersData.features || []);
          } catch (error) {
            console.error("Error in location or shelters fetch:", error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching location:", error.message);
          setIsLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  }, []);
  
  


  return (
    <div className={`container ${theme}`} style={{ height: "100vh", width: "100%" }}>
  <Navbar theme={theme} setTheme={setTheme} />
  {currentLocation ? ( // Render MapContainer only when currentLocation is available
    <MapContainer
      center={[currentLocation.lat, currentLocation.lng]} // Use user's location
      zoom={13}
      style={{ height: "100%", width: "100%" }} // Ensure the map is fully visible
    >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      <MarkerClusterGroup>

      {currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>
              <p>Your Current Location</p>
            </Popup>
          </Marker>
        )}
        {shelters.map((shelter, index) => (
          <Marker
            key={index}
            position={[
              shelter.geometry.y,
              shelter.geometry.x, 
            ]}
          >
            <Popup>
              <p>Name: {shelter.attributes.SHELTER_NAME || "Unknown"}</p>
              <p>Address: {shelter.attributes.ADDRESS || "Unknown"}</p>
            </Popup>
          </Marker>
        ))}

      </MarkerClusterGroup>
      </MapContainer>)
      : (
        <p>Loading map...</p> 
      )}
    </div>
  );
}

export default App;
