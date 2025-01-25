import React from "react"
import "./Navbar.css"
// import logo_light from "assets/logo-black.png" add the logo
import toogle_light from './assets/night.png'
import toogle_dark from './assets/day.png'

const Navbar = () => {
    return (
        <div className="navbar">
            <img src="" alt="" className="logo"/>
            
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Listing</li>
                <li>Contact</li>
            </ul>
            
            <img src={toogle_light} alt="" className="toggle-icon"/>
        </div>
    )
}

export default Navbar