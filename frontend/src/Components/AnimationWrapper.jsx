import React from "react";
import { motion } from "framer-motion";

const AnimationWrapper = ({ children, className, style, viewport_amount }) => {
  const ref = React.useRef(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: viewport_amount || 0.5 }}
      transition={{ duration: 0.5, ease: "easeIn" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimationWrapper;
