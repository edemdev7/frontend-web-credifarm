import { FC } from "react";
import useTriggerStore from "../../store/triggerStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Shine from "./Shine";
import logo from "../../assets/logo-icon.png";

interface NavItemsProps {
  path: string;
  label: string;
}

interface SideBarProps {
  navItems: NavItemsProps[];
  active: string;
}

const Sidebar: FC<SideBarProps> = ({ navItems, active }) => {
  const { triggered } = useTriggerStore();
  const navigate = useNavigate();
  return (
    <aside className="relative">
      <div
        className={`${
          triggered ? "translate-x-0" : "-translate-x-full"
        } bg-white overflow-scroll h-screen w-[280px] fixed top-0 left-0 bottom-0 flex flex-col transition-transform duration-300`}
      >
        <div className="overflow-scroll h-full">
            <h1 className="text-sm flex flex-col my-5 gap-2 items-center justify-center important">
              <img src={logo} alt="logo" className="w-10" />
              <div>
                <span className="text-blue-500 font-bold">Soa</span>
                <span>PORTAL</span>
              </div>
            </h1>

          <ul className="md:hidden flex flex-col gap-2 pb-8">
            {navItems.map(({ path, label }, index) => {
              const baseDelay = 200 + index * 150;
              const animationDelay = 0.15 + index * 0.15;

              return (
                <li
                  key={index}
                  className={`h-12 p-3 pl-10 relative overflow-hidden ${
                    path === active ? "bg-blue-50 font-semibold" : ""
                  }`}
                  onClick={() => {
                    navigate(`${path}`);
                  }}
                >
                  <span
                    className={`cursor-pointer absolute transition-all duration-[150ms] ${
                      !triggered
                        ? "-translate-x-[300%]"
                        : `delay-[${baseDelay}ms] translate-x-0`
                    }`}
                  >
                    {label}
                  </span>
                  {triggered && path === active && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        duration: 0.1,
                        delay: 0.3,
                        ease: "easeInOut",
                      }}
                      className="absolute top-0 right-0 h-full w-1 bg-blue-500"
                    ></motion.div>
                  )}
                  {triggered && (
                    <>
                      <Shine
                        delay={animationDelay}
                        width="w-1/5"
                        opacity={0.6}
                      />
                      <Shine
                        delay={animationDelay + 0.05}
                        width="w-2/5"
                        opacity={0.5}
                      />
                      <Shine
                        delay={animationDelay + 0.1}
                        width="w-3/5"
                        opacity={0.4}
                      />
                      <Shine
                        delay={animationDelay + 0.15}
                        width="w-4/5"
                        opacity={0.3}
                      />
                      <Shine
                        delay={animationDelay + 0.2}
                        width="w-full"
                        opacity={0.2}
                      />
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          {/* Copyright Soa */}
          <p className="p-5 text-center text-nowrap font-normal text-xs text-gray-600 absolute bottom-0 left-1/2 -translate-x-1/2">
            © {new Date().getFullYear()} Soa - Tous droits réservés.
          </p>
        </div>
      </div>

      {/* end side footer  */}
    </aside>
  );
};

export default Sidebar;
