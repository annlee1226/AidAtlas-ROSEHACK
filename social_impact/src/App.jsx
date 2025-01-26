import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState, useRef } from 'react'
import Navbar from './Navbar.jsx';
import aidatlasImage from './assets/aidatlas.png';
import About from './About.jsx'
import Contact from './Contact.jsx';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import markericon from './assets/markericon.png';
import { Icon, divIcon, point } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { setLocation, getShelters, getJobs } from './location.jsx';



function App() {
  const current_theme = localStorage.getItem('current_theme');
  const[theme, setTheme] = useState(current_theme? current_theme : 'light');
  const [activePage, setActivePage] = useState('home');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [shelters, setShelters] = useState([]);

  const homeRef = useRef(null);
  const listingRef = useRef(null);
  const shelterRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(()=>{
    localStorage.setItem('current_theme', theme);
  },[theme])

  const customIcon = new Icon({
    iconUrl: markericon,
    iconSize: [38, 38],
  })


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


            const joblisting = await getJobs(latitude, longitude);
            console.log("Job data:", joblisting);
            setJobs(joblisting)

            
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
    <>
    <div className={`container ${theme}`}>
      <Navbar sections={{homeRef, listingRef, shelterRef, contactRef }} theme={theme} setTheme={setTheme}/>
      {activePage === 'home' && (
        <div ref={homeRef} style={{ height: "100vh",textAlign: 'right', marginTop: '78px', marginRight: '50px'}}>
          <div className="about-us">
            <div className="card-container">
              <About />
            </div>
            <div>
              <img
                src={aidatlasImage}
                alt="AidAtlas"
                style={{ maxWidth: '100%', height: 'auto' }}
                className="picture"
              />
            </div>
          </div>
        </div>
      )}

            <div className={`container ${theme}`}ref={listingRef} style={{ height: "100vh" }}>
              <h1>THIS IS WHERE THE LISTING GOES</h1>
            </div>

            <div ref={shelterRef}
              style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "78px",
                marginRight: "50px",
              }}
            >
              <div style={{ height: "70%", width: "90%", marginLeft: "45px" }}>
                {currentLocation ? (
                  <MapContainer
                    center={[currentLocation.lat, currentLocation.lng]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
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
                            <p>Name: {shelter.attributes.shelter_name ||  "Unknown"}</p>
                            <p>Address: {shelter.attributes.address ||  "Unknown"}</p>
                          </Popup>
                        </Marker>
                      ))}
                    </MarkerClusterGroup>
                  </MapContainer>
                ) : (
                  <p>Loading map...</p>
                )}
              </div>
            </div>

            <div className={`container ${theme}`}ref={contactRef}style={{ height: "10vh" }}>
              <Contact />
            </div>
    </div>

    </>
  );
}

export default App