import "./styles/footer.css";
import footer_logo from "./assets/footer_logo.svg";

const Footer = () => {
  return (
    <div className="m-footer-section">
      <img src={footer_logo} alt="MeetzFlow" />
      <div className="m-footer-right-div">
        <p>Privacy Policy</p>
        <p>Terms And Conditions</p>
      </div>
    </div>
  );
};
export default Footer;
