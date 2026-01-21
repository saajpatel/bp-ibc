import { Link, NavLink } from "react-router-dom"
import './Navbar.css'
import ibc_logo from '../../assets/logo.svg'

function Navbar() {
    return (
        <nav>
            <div className="logo" style={{display: 'flex', fontFamily: 'DM Sans, sans-serif'}}>
                <img src={ibc_logo} alt="ibc logo"/>
                <div>
                    <h1>Itty Bitty</h1>
                    <h1>Critters</h1>
                </div>
            </div>
            <div className="navlinks" style={{fontFamily: 'DM Sans, sans-serif'}}>
                <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About</NavLink>
                <NavLink to="/education" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Education</NavLink>
                <NavLink to="/volunteer" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Volunteer</NavLink>
                <Link className="nav-link">Contact</Link>
                <Link className="log-in nav-link">Log in</Link>
            </div>
        </nav>
    );
}

export default Navbar;