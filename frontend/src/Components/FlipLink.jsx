import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import right_arrow from "../assets/right-arrow.svg";

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipLink = ({ buttonText, className, href }) => {
  return (
    <Link to="/get-started">
      <motion.button
        className={className}
        initial="initial"
        whileHover="hovered"
        href={href}
        style={{
          position: "relative",
          textTransform: "uppercase",
        }}
      >
        <div
          style={{
            display: "block",
            overflow: "hidden",
            whiteSpace: "nowrap",
            lineHeight: 0.75,
            position: "relative",
            whiteSpace: "pre",
          }}
        >
          <div>
            {buttonText.split("").map((l, i) => (
              <motion.span
                variants={{
                  initial: {
                    y: 0,
                  },
                  hovered: {
                    y: "-100%",
                  },
                }}
                transition={{
                  duration: DURATION,
                  ease: "easeInOut",
                  delay: STAGGER * i,
                }}
                style={{
                  display: "inline-block",
                }}
                key={i}
              >
                {l}
              </motion.span>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            {buttonText.split("").map((l, i) => (
              <motion.span
                variants={{
                  initial: {
                    y: "100%",
                  },
                  hovered: {
                    y: 0,
                  },
                }}
                transition={{
                  duration: DURATION,
                  ease: "easeInOut",
                  delay: STAGGER * i,
                }}
                style={{
                  display: "inline-block",
                }}
                key={i}
              >
                {l}
              </motion.span>
            ))}
          </div>
        </div>
        {className === "m-get-started-btn m-with-icon-btn" && (
          <img src={right_arrow} style={{ marginBottom: "1px" }} alt="" />
        )}
      </motion.button>
    </Link>
  );
};

export default FlipLink;
