import { FC } from "react";
import { motion } from "framer-motion";
import { Spinner } from "@heroui/react";
import logo from "../assets/logo-icon.png";

const PageTransition: FC = () => (
  <motion.div
    className="z-[100] fixed h-screen w-full backdrop-blur-md flex flex-col gap-3 items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <img src={logo} alt="logo" className="w-12" />
    <Spinner color="default" />
  </motion.div>
);

export default PageTransition;
