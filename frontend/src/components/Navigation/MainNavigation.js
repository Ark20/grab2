import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.css'
import AuthContext from '../../context/auth-context';

const mainNavigation = props => (
<AuthContext.Consumer>
    {(context)=> {
        return (
            <header className="navHeader"> 
            <div className="navLogo"> 
                <h1>The nav</h1>
            </div>
            <nav className="navItem">
                 <ul>
                    {!context.token && <li>
                        <NavLink to="/auth">Auth</NavLink>
                 </li>}
                 <li>
                    <NavLink to="/events">Events</NavLink>
                 </li>
                {context.token && <li>
                <NavLink to="/bookings">Bookings</NavLink>
                </li>}
            </ul>
            </nav>
            </header>
        )
    }}

   
</AuthContext.Consumer>


    )

export default mainNavigation