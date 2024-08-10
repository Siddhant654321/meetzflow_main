import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import TestimonialsTab from "./TestimonialsTab";
import AnimationWrapper from "./AnimationWrapper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/testimonialCarousel.css";

import aditya_singh from "../assets/aditya_singh.jpg";
import alina_reed from "../assets/alina_reed.jpg";
import andrew_williams from "../assets/andrew_williams.jpg";
import lily_hendricks from "../assets/lily_hendricks.jpg";
import james_petrov from "../assets/james_petrov.jpg";
import hiroshi_yamamoto from "../assets/hiroshi_yamamoto.jpg";

const TestimonialCarousel = ({ activeTestimonial, setActiveTestimonial }) => {
  const testimonials = [
    {
      name: "Aditya Singh",
      designation: "WEB DEVELOPER",
      img: aditya_singh,
      order: 0,
      testimonial_details: {
        favorite_feature: "User Interface",
        onboarded_since: "3rd Jan, 2024",
        testimonial: [
          "MeetzFlow offers a very",
          "easy-to-use interface",
          "and has some of the most",
          "impressive features",
          "available",
        ],
      },
    },
    {
      name: "Alina Reed",
      designation: "SALES EXECUTIVE",
      img: alina_reed,
      order: 1,
      testimonial_details: {
        favorite_feature: "Multiple Teams",
        onboarded_since: "21st Aug, 2023",
        testimonial: [
          "Having",
          "multiple teams",
          "for different departments and projects made things",
          "incredibly easy",
        ],
      },
    },
    {
      name: "Andrew Williams",
      designation: "MANAGER",
      img: andrew_williams,
      order: 2,
      testimonial_details: {
        favorite_feature: "Absolutely Free",
        onboarded_since: "13th Nov, 2023",
        testimonial: [
          "MeetzFlow is the",
          "only software",
          "offering so many features at absolutely",
          "no cost.",
          "It's definitely a",
          "no-brainer",
        ],
      },
    },
    {
      name: "Lily Hendricks",
      designation: "CONSULTANT",
      img: lily_hendricks,
      order: 3,
      testimonial_details: {
        favorite_feature: "Schedulers",
        onboarded_since: "27th Feb, 2024",
        testimonial: [
          "MeetzFlow helped me",
          "schedule meetings",
          "with clients from all over the world",
          "without any issues",
        ],
      },
    },
    {
      name: "James Petrov",
      designation: "DESIGNER",
      img: james_petrov,
      order: 4,
      testimonial_details: {
        favorite_feature: "Collaboration",
        onboarded_since: "17th Aug, 2023",
        testimonial: [
          "MeetzFlow helped my",
          "entire department,",
          "which operates remotely,",
          "communicate design ideas",
          "effectively",
        ],
      },
    },
    {
      name: "Hiroshi Yamamoto",
      designation: "PROFESSOR",
      img: hiroshi_yamamoto,
      order: 5,
      testimonial_details: {
        favorite_feature: "Multiple Teams",
        onboarded_since: "8th June, 2024",
        testimonial: [
          "MeetzFlow made",
          "communication",
          "with my students from different batches much",
          "easier and more seamless",
        ],
      },
    },
  ];

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    className: "m-testimonials-container",
    infinite: true,
    centerPadding: "60px",
    draggable: true,
    slidesToScroll: 1,
    slidesToShow: 3,
    swipeToSlide: true,
    arrows: false,
    afterChange: function (index) {
      setActiveIndex(index);
    },
  };

  const goToSlide = (index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  useEffect(() => {
    if (activeIndex === 5) {
      setActiveTestimonial(testimonials[0].testimonial_details);
    } else {
      setActiveTestimonial(testimonials[activeIndex + 1].testimonial_details);
    }
  }, [activeIndex]);

  return (
    <AnimationWrapper className="m-testimonial-div-1">
      <div className="m-testimonials-overlay" />
      <Slider ref={sliderRef} {...settings}>
        {testimonials.map((testimonial, index) => (
          <TestimonialsTab
            key={`${testimonial.name}-${index}`}
            {...testimonial}
            active={
              testimonial.order - 1 === activeIndex
                ? "active"
                : testimonial.order === 0 && activeIndex === 5
                ? "active"
                : "inactive"
            }
            activeIndex={activeIndex}
            order={testimonial.order - 1}
            goToSlide={goToSlide}
          />
        ))}
      </Slider>
    </AnimationWrapper>
  );
};

export default TestimonialCarousel;
