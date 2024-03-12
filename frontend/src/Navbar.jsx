import {Link, NavLink, Outlet} from 'react-router-dom';
import { NavHashLink } from "react-router-hash-link";
import './styles/navbar.css';

const Navbar = () => {
    
    return (
        <div>
            <nav className="navbar navbar-expand-md">
                <div className="container">
                    <Link to="/">MeetzFlow</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className={(navData) => navData.isActive ? "active-nav nav-link" : "text-dark nav-link"} to="/">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavHashLink smooth className="nav-link text-dark" activeClassName="active-nav" to="/#features">Features</NavHashLink>
                            </li>
                            <li className="nav-item">
                                <NavHashLink smooth className="nav-link text-dark" activeClassName="active-nav" to="/#testimonials">Testimonials</NavHashLink>
                            </li>
                            <li className="nav-item">
                                <NavHashLink smooth className="nav-link text-dark" activeClassName="active-nav" to="/#faq">FAQ</NavHashLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className={(navData) => navData.isActive ? "active-nav nav-link" : "text-dark nav-link"} to="/contact">Contact</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    )
}

export default Navbar