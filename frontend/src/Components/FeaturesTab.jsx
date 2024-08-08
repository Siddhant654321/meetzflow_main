import React, { useEffect, useRef, useCallback } from "react";
import "../styles/featuresTab.css";

// Throttle function
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const FeaturesTab = ({ icon, title, description, style }) => {
  const cardRef = useRef(null);
  const blobRef = useRef(null);
  const fakeBlobRef = useRef(null);
  const lastMousePositionRef = useRef({ clientX: 0, clientY: 0 });

  const handleMouseMove = useCallback((ev) => {
    lastMousePositionRef.current = { clientX: ev.clientX, clientY: ev.clientY };
    if (cardRef.current && blobRef.current && fakeBlobRef.current) {
      const blob = blobRef.current;
      const fakeBlob = fakeBlobRef.current;
      const rec = fakeBlob.getBoundingClientRect();

      blob.animate(
        [
          {
            transform: `translate(${ev.clientX - rec.left - rec.width / 2}px,${
              ev.clientY - rec.top - rec.height / 2
            }px)`,
          },
        ],
        {
          duration: 300,
          fill: "forwards",
        }
      );

      blob.style.opacity = "1";
    }
  }, []);

  const handleScroll = useCallback(() => {
    const ev = lastMousePositionRef.current;
    handleMouseMove(ev);
  }, [handleMouseMove]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100); // Adjust the 100ms as needed

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <div className="m-features-card" ref={cardRef}>
      <div className="m-features-first-div">
        <img src={icon} alt={title} width={86} height={86} />
        <h3 className="m-feature-heading">{title}</h3>
        <p className="m-feature-description">{description}</p>
      </div>
      <div className="blob" ref={blobRef}></div>
      <div className="fakeblob" ref={fakeBlobRef}></div>
    </div>
  );
};

export default FeaturesTab;
