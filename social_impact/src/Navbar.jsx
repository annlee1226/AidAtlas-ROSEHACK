import React from "react"
import "./Navbar.css"
import logo_light from "./assets/logo1.png" //add the logo_light
import logo_dark from "./assets/logo2.png"
import toggle_light from './assets/night.png'
import toggle_dark from './assets/day.png'

const Navbar = ({theme, setTheme}) => {

    const toggle_mode = ()=> {
        theme == 'light' ? setTheme('dark') : setTheme('light')
    }

    return (
        <div className="navbar">
            <img src={theme == 'light' ? logo_light : logo_dark} alt="" className="logo"/>
            
            <ul>
                <li>Home</li>
                <li>About us</li>
                <li>Listing</li>
                <li>Contact</li>
            </ul>
            
            <img onClick={() => {toggle_mode()}} src={theme == 'light' ? toggle_light : toggle_dark} alt="" className="toggle-icon"/>
        </div>
    )
}

export default Navbar