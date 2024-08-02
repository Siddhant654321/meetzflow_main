import "./styles/homepage.css";
import right_arrow from "./assets/right-arrow.svg";
import hero_section_img from "./assets/hero_section_img.png";

const Homepage = () => {
  return (
    <div>
      <div className="m-hero-section">
        <h1>Connect Seamlessly</h1>
        <h3 className="m-subheading">
          With your Clients and Team members in a single dashboard
        </h3>
        <button className="m-get-started-btn m-with-icon-btn">
          START FOR FREE
          <img src={right_arrow} alt="" />
        </button>
        <img src={hero_section_img} alt="" className="m-hero-section-img" />
      </div>
    </div>
  );
};
export default Homepage;
