import React from "react"
import "./Navbar.css"
import logo_light from "./assets/logo1.png" 
import logo_dark from "./assets/logo2.png"
import toggle_light from './assets/night.png'
import toggle_dark from './assets/day.png'

const Navbar = ({sections, theme, setTheme }) => {

    const toggle_mode = ()=> {
        theme == 'light' ? setTheme('dark') : setTheme('light');
    };

    const handleScroll = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="navbar">
            <img src={theme == 'light' ? logo_light : logo_dark} alt="" className="logo"/>
            <div className="title">AidAtlas</div>
            <ul>
                <li onClick={() => handleScroll(sections.homeRef)} style={{ cursor: "pointer" }}>Home</li>
                <li onClick={() => handleScroll(sections.listingRef)} style={{ cursor: 'pointer' }}>Listing</li>
                <li onClick={() => handleScroll(sections.shelterRef)} style={{ cursor: 'pointer' }}>Shelter</li>
                <li onClick={() => handleScroll(sections.contactRef)} style={{ cursor: 'pointer' }}>Contact</li>
            </ul>
            
            <img onClick={() => {toggle_mode()}} src={theme == 'light' ? toggle_light : toggle_dark} alt="" className="toggle-icon"/>
        </div>
    )
}

export default Navbar