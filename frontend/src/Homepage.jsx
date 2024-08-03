import "./styles/homepage.css";
import right_arrow from "./assets/right-arrow.svg";
import hero_section_img from "./assets/hero_section_img.png";

import handshake_icon from "./assets/handshake_icon.svg";
import team_icon_1 from "./assets/team_icon_1.svg";
import team_icon_2 from "./assets/team_icon_2.svg";
import dashboard_icon from "./assets/dashboard_icon.svg";
import coin_icon from "./assets/coin_icon.svg";
import FeaturesTab from "./Components/FeaturesTab";

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
      <div className="m-features-section">
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
    </div>
  );
};
export default Homepage;
