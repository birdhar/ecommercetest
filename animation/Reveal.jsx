import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import PropTypes from "prop-types";
import style from "../styles/Categories.module.css";

function Reveal({ children, width, className, childClass }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const mainControls = useAnimation();

  useEffect(() => {
    if (inView) {
      mainControls.start("visible");
    }
  }, [inView]);
  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", width, overflow: "hidden" }}
    >
      <motion.div
        className={childClass}
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

Reveal.propTypes = {
  children: PropTypes.element,
  width: PropTypes.string,
};

export default Reveal;
