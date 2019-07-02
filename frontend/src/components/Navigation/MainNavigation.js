import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.css'

const mainNavigation = props => (
<header className="navHeader"> 
    <div className="navLogo"> 
         <h1>The nav</h1>
    </div>
    <nav className="navItem">
        <ul>
            <li>
                <NavLink to="/auth">Auth</NavLink>
            </li>
            <li>
                <NavLink to="/events">Events</NavLink>
            </li>
            <li>
                <NavLink to="/bookings">Bookings</NavLink>
            </li>
        </ul>
    </nav>
</header>
   



    )

export default mainNavigation