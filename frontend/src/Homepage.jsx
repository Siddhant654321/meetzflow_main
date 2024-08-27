import "./styles/homepage.css";
import hero_section_img from "./assets/hero_section_img.png";
import FeaturesTab from "./Components/FeaturesTab";

import handshake_icon from "./assets/handshake_icon.svg";
import team_icon_1 from "./assets/team_icon_1.svg";
import team_icon_2 from "./assets/team_icon_2.svg";
import dashboard_icon from "./assets/dashboard_icon.svg";
import coin_icon from "./assets/coin_icon.svg";
import quotes_icon from "./assets/quotes_icon.svg";
import AnimationWrapper from "./Components/AnimationWrapper";
import FlipLink from "./Components/FlipLink";
import TestimonialCarousel from "./Components/TestimonialCarousel";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Homepage = () => {
  const features = [
    {
      icon: handshake_icon,
      title: "Connect with clients",
      description:
        "Our tool lets you create a new scheduler that you can share with your prospects and schedule meetings with them only on days and times when you are available.",
      style: { width: "33%" },
      delay: 0,
    },
    {
      icon: team_icon_1,
      title: "Team Collaboration",
      description:
        "Create a team where you can discuss your next project. Add and remove admins and members, and schedule meetings with all your colleagues in just one place.",
      style: { width: "33%" },
      delay: 0.2,
    },
    {
      icon: team_icon_2,
      title: "Multiple teams",
      description:
        "Need different teams for each department or unique spaces to relax with colleagues? We've got you covered. Create as many teams as you need.",
      style: { width: "33%" },
      delay: 0.4,
    },
    {
      icon: dashboard_icon,
      title: "All-In-One Dashboard",
      description:
        "You will find your upcoming and past meetings, your teams, your notifications and your schedulers all in one place, totally organized for you to give you a boost of productivity.",
      style: { width: "50%" },
      delay: 0,
    },
    {
      icon: coin_icon,
      title: "Absolutely free",
      description: `Unlike other collaboration and client management tools, we will never charge you for using our services. We are committed to our ideal of 'No Limits, No Pricing.'`,
      style: { width: "50%" },
      delay: 0.2,
    },
  ];

  const [viewport_amount, set_viewport_amount] = useState(0.5);

  const [activeTestimonial, setActiveTestimonial] = useState({
    favorite_feature: "",
    onboarded_since: "",
    testimonial: [""],
  });

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 980) {
        set_viewport_amount(0.1);
      } else {
        set_viewport_amount(0.5);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          <FlipLink
            className="m-get-started-btn m-with-icon-btn"
            buttonText="START FOR FREE"
          />
        </AnimationWrapper>
        <AnimationWrapper delay={0.8} className="d-flex">
          <img src={hero_section_img} alt="" className="m-hero-section-img" />
        </AnimationWrapper>
      </div>
      <div className="m-features-section" id="features">
        <AnimationWrapper>
          <h2 className="m-secondary-heading">NEEDS MEET REALITY</h2>
        </AnimationWrapper>
        <AnimationWrapper delay={0.4}>
          <h3 className="m-subheading">
            We bring you the features no one else provides
          </h3>
        </AnimationWrapper>
        <div className="m-features-container">
          {features.map((feature_data, index) => (
            <AnimationWrapper
              className="m-features-main-div"
              style={feature_data.style}
              key={feature_data.title + index}
              delay={0.4 + feature_data.delay}
            >
              <FeaturesTab {...feature_data} />
            </AnimationWrapper>
          ))}
        </div>
      </div>
      <div className="m-testimonials-section" id="testimonials">
        <AnimationWrapper>
          <h2 className="m-secondary-heading">WHAT OUR USERS SAY</h2>
        </AnimationWrapper>
        <AnimationWrapper>
          <h3 className="m-subheading">
            HEAR ABOUT US FROM OUR AWESOME CUSTOMERS
          </h3>
        </AnimationWrapper>
        <TestimonialCarousel
          activeTestimonial={activeTestimonial}
          setActiveTestimonial={setActiveTestimonial}
        />
        <AnimationWrapper viewport_amount={viewport_amount}>
          <div className="m-testimonials-upper-divider"></div>
          <div className="m-testimonials-bottom-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.onboarded_since}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
                className="m-left-testimonial-container"
              >
                <div>
                  <div className="m-testimonials-extra-details">
                    <h4>ONBOARDED SINCE:</h4>
                    <h5>{activeTestimonial.onboarded_since}</h5>
                  </div>
                  <div
                    className="m-testimonials-extra-details"
                    style={{ margin: 0 }}
                  >
                    <h4>FAVORITE FEATURE:</h4>
                    <h5>{activeTestimonial.favorite_feature}</h5>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <AnimationWrapper className="m-testimonials-middle-divider"></AnimationWrapper>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial.testimonial.join("")}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={fadeVariants}
                transition={{ duration: 0.3 }}
                className="m-testimonials-right-section"
              >
                <img src={quotes_icon} alt='"' />
                <p style={{ lineHeight: "165%" }}>
                  {activeTestimonial.testimonial.map((text, index) => (
                    <span
                      key={index}
                      className={index % 2 !== 0 ? "m-white-text" : ""}
                    >
                      {text}{" "}
                    </span>
                  ))}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </AnimationWrapper>
      </div>
      <AnimationWrapper className="m-final-cta-section">
        <h2 className="m-secondary-heading">
          COLLABORATE<span className="m-bigger-font">.</span> TOGETHER
          <span className="m-bigger-font">.</span>
        </h2>
        <h3 className="m-subheading">
          Create a forever free account today and meet with your clients and
          colleagues endlessly
        </h3>
        <FlipLink
          className="m-get-started-btn m-with-icon-btn"
          buttonText="START FOR FREE"
        />
      </AnimationWrapper>
    </div>
  );
};
export default Homepage;
