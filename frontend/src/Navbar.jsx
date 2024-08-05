import { Link, Outlet } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./styles/navbar.css";
import nav_logo from "./assets/nav_logo.svg";
import Footer from "./Footer";

const Navbar = () => {
  return (
    <main className="m-container">
      <nav className="m-nav">
        <Link to="/">
          <img src={nav_logo} alt="MeetzFlow" />
        </Link>
        <ul className="m-nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <HashLink smooth to="/#features">
              Features
            </HashLink>
          </li>
          <li>
            <HashLink smooth to="/#testimonials">
              Testimonials
            </HashLink>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <Link to="/get-started">
          <button className="m-get-started-btn">GET STARTED</button>
        </Link>
      </nav>
      <Outlet />
      <Footer />
    </main>
  );
};
export default Navbar;
