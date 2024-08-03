import React, { useEffect, useRef } from "react";
import "../styles/featuresTab.css";

const FeaturesTab = ({ icon, title, description, style }) => {
  const cardRef = useRef(null);
  const blobRef = useRef(null);
  const fakeBlobRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (ev) => {
      if (cardRef.current && blobRef.current && fakeBlobRef.current) {
        const blob = blobRef.current;
        const fakeBlob = fakeBlobRef.current;
        const rec = fakeBlob.getBoundingClientRect();

        blob.animate(
          [
            {
              transform: `translate(${
                ev.clientX - rec.left - rec.width / 2
              }px,${ev.clientY - rec.top - rec.height / 2}px)`,
            },
          ],
          {
            duration: 300,
            fill: "forwards",
          }
        );

        blob.style.opacity = "1";
      }
    };

    window.addEventListener("mouseover", handleMouseMove);

    return () => {
      window.removeEventListener("mouseover", handleMouseMove);
    };
  }, []);

  return (
    <div className="m-features-main-div" style={style}>
      <div className="m-features-card" ref={cardRef}>
        <div className="m-features-first-div">
          <img src={icon} alt={title} width={86} height={86} />
          <h3 className="m-feature-heading">{title}</h3>
          <p className="m-feature-description">{description}</p>
        </div>
        <div className="blob" ref={blobRef}></div>
        <div className="fakeblob" ref={fakeBlobRef}></div>
      </div>
    </div>
  );
};

export default FeaturesTab;
