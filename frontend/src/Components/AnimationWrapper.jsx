import React from "react";
import { motion } from "framer-motion";

const AnimationWrapper = ({
  children,
  delay = 0,
  initial_animation = { y: 10 },
  whileInView_animation = { y: 0 },
  extra_transition = { ease: "easeIn" },
}) => {
  const ref = React.useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initial_animation }}
      whileInView={{ opacity: 1, ...whileInView_animation }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ...extra_transition }}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
