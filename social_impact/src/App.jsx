import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markericon from './assets/markericon.png';
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { getLocation } from './location.jsx';

function App() {
  const current_theme = localStorage.getItem('current_theme');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
          console.log({latitude, longitude});
          setCurrentLocation({ lat: latitude, lng: longitude });

          try {
            const loc = await getLocation(latitude, longitude);
            setCurrentLocation(loc);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
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
      <MapContainer
        center={[48.8566, 2.3522]} // Coordinates for Paris
        zoom={13}
        style={{ height: "100%", width: "100%"}} // Ensure the map is fully visible
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      <MarkerClusterGroup>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.geocode} icon={customIcon}>
            <Popup>
              <h2>
                {marker.popUp}
              </h2>
            </Popup>
          </Marker>
        ))}

      </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default App;
