import "./styles/homepage.css";
import right_arrow from "./assets/right-arrow.svg";
import hero_section_img from "./assets/hero_section_img.png";
import FeaturesTab from "./Components/FeaturesTab";
import TestimonialsTab from "./Components/TestimonialsTab";

import handshake_icon from "./assets/handshake_icon.svg";
import team_icon_1 from "./assets/team_icon_1.svg";
import team_icon_2 from "./assets/team_icon_2.svg";
import dashboard_icon from "./assets/dashboard_icon.svg";
import coin_icon from "./assets/coin_icon.svg";
import aditya_singh from "./assets/aditya_singh.jpg";
import alina_reed from "./assets/alina_reed.jpg";
import andrew_williams from "./assets/andrew_williams.jpg";
import quotes_icon from "./assets/quotes_icon.svg";
import { Link } from "react-router-dom";
import AnimationWrapper from "./Components/AnimationWrapper";

const Homepage = () => {
  const features = [
    {
      icon: handshake_icon,
      title: "Connect with clients",
      description:
        "Our tool lets you create a new scheduler that you can share with your prospects and schedule meetings with them only on days and times when you are available.",
      style: { width: "33%" },
    },
    {
      icon: team_icon_1,
      title: "Team Collaboration",
      description:
        "Create a team where you can discuss your next project. Add and remove admins and members, and schedule meetings with all your colleagues in just one place.",
      style: { width: "33%" },
    },
    {
      icon: team_icon_2,
      title: "Multiple teams",
      description:
        "Need different teams for each department or unique spaces to relax with colleagues? We've got you covered. Create as many teams as you need.",
      style: { width: "33%" },
    },
    {
      icon: dashboard_icon,
      title: "All-In-One Dashboard",
      description:
        "You will find your upcoming and past meetings, your teams, your notifications and your schedulers all in one place, totally organized for you to give you a boost of productivity.",
      style: { width: "50%" },
    },
    {
      icon: coin_icon,
      title: "Absolutely free",
      description: `Unlike other collaboration and client management tools, we will never charge you for using our services. We are committed to our ideal of 'No Limits, No Pricing.'`,
      style: { width: "50%" },
    },
  ];

  const testimonials = [
    {
      name: "Aditya Singh",
      designation: "WEB DEVELOPER",
      img: aditya_singh,
      order: 1,
    },
    {
      name: "Alina Reed",
      designation: "SALES EXECUTIVE",
      img: alina_reed,
      order: 2,
    },
    {
      name: "Andrew Williams",
      designation: "MANAGER",
      img: andrew_williams,
      order: 3,
    },
  ];
  return (
    <div>
      <div className="m-hero-section">
        <AnimationWrapper>
          <h1>Connect Seamlessly</h1>
        </AnimationWrapper>
        <AnimationWrapper delay={0.4}>
          <h3 className="m-subheading">
            With your Clients and Team members in a single dashboard
          </h3>
        </AnimationWrapper>
        <AnimationWrapper delay={0.4}>
          <Link to="/get-started">
            <button className="m-get-started-btn m-with-icon-btn">
              START FOR FREE
              <img src={right_arrow} alt="" />
            </button>
          </Link>
        </AnimationWrapper>
        <AnimationWrapper delay={0.8}>
          <img src={hero_section_img} alt="" className="m-hero-section-img" />
        </AnimationWrapper>
      </div>
      <div className="m-features-section" id="features">
        <h2 className="m-secondary-heading">NEEDS MEET REALITY</h2>
        <h3 className="m-subheading">
          We bring you the features no one else provides
        </h3>
        <div className="m-features-container">
          {features.map((feature_data) => (
            <FeaturesTab {...feature_data} />
          ))}
        </div>
      </div>
      <div className="m-testimonials-section" id="testimonials">
        <h2 className="m-secondary-heading">WHAT OUR USERS SAY</h2>
        <h3 className="m-subheading">
          HEAR ABOUT US FROM OUR AWESOME CUSTOMERS
        </h3>
        <div className="m-testimonials-container">
          {testimonials.map((testimonial) => (
            <TestimonialsTab {...testimonial} />
          ))}
        </div>
        <div className="m-testimonials-upper-divider"></div>
        <div className="m-testimonials-bottom-card">
          <div>
            <div className="m-testimonials-extra-details">
              <h4>ONBOARDED SINCE:</h4>
              <h5>21st Aug, 2023</h5>
            </div>
            <div className="m-testimonials-extra-details" style={{ margin: 0 }}>
              <h4>FAVORITE FEATURE:</h4>
              <h5>Multiple Teams</h5>
            </div>
          </div>
          <div className="m-testimonials-middle-divider"></div>
          <div className="m-testimonials-right-section">
            <img src={quotes_icon} alt='"' />
            <p>
              Having <span className="m-white-text">multiple teams</span> for
              different departments and projects made things{" "}
              <span className="m-white-text">incredibly easy</span>
            </p>
          </div>
        </div>
      </div>
      <div className="m-final-cta-section">
        <h2 className="m-secondary-heading">
          COLLABORATE<span className="m-bigger-font">.</span> TOGETHER
          <span className="m-bigger-font">.</span>
        </h2>
        <h3 className="m-subheading">
          Create a forever free account today and meet with your clients and
          colleagues endlessly
        </h3>
        <Link to="/get-started">
          <button className="m-get-started-btn m-with-icon-btn">
            START FOR FREE
            <img src={right_arrow} alt="" />
          </button>
        </Link>
      </div>
    </div>
  );
};
export default Homepage;
