import React from "react";
import { motion } from "framer-motion";

const AnimationWrapper = ({ children, className, style }) => {
  const ref = React.useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.5 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
