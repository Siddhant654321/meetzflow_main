import "./styles/footer.css";
import footer_logo from "./assets/footer_logo.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="m-footer-section">
      <Link to="/">
        <img src={footer_logo} alt="MeetzFlow" />
      </Link>
      <div className="m-footer-right-div">
        <Link to="/privacy-policy">Privacy Policy</Link>
        <Link to="/terms-and-conditions">Terms And Conditions</Link>
      </div>
    </div>
  );
};
export default Footer;
