import { Outlet } from "react-router-dom";
import "./styles/navbar.css";
import nav_logo from "./assets/nav_logo.svg";
import Footer from "./Footer";

const Navbar = () => {
  return (
    <main className="m-container">
      <nav className="m-nav">
        <img src={nav_logo} alt="MeetzFlow" />
        <ul className="m-nav-links">
          <li>HOME</li>
          <li>FEATURES</li>
          <li>TESTIMONIALS</li>
          <li>CONTACT</li>
        </ul>
        <button className="m-get-started-btn">GET STARTED </button>
      </nav>
      <Outlet />
      <Footer />
    </main>
  );
};
export default Navbar;
