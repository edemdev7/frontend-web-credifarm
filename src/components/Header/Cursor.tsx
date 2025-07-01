import { FC } from "react";
import { motion } from "framer-motion";
const Cursor: FC = () => {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
        transformOrigin: "center",
      }}
      className="absolute left-0 bottom-0 w-full h-1 rounded-full bg-blue-500"
    ></motion.div>
  );
};

export default Cursor;
