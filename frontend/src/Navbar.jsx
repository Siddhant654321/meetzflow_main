import { Link, Outlet } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import "./styles/navbar.css";
import nav_logo from "./assets/nav_logo.svg";
import Footer from "./Footer";
import FlipLink from "./Components/FlipLink";

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
        <FlipLink className="m-get-started-btn" buttonText="START FOR FREE" />
      </nav>
      <Outlet />
      <Footer />
    </main>
  );
};
export default Navbar;
