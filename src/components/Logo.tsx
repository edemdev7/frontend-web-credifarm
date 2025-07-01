import { FC } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/logo-icon.png";

interface LogoProps {
  isVertical?: boolean;
  size?: string;
}

const Logo: FC<LogoProps> = ({ isVertical, size }) => {
  const navigate = useNavigate();
  return (
    <h1
      className={`select-none cursor-pointer flex items-center justify-center gap-x-2 ${
        isVertical && "flex-col"
      }`}
      onClick={() => navigate(0)}
    >
      <img src={icon} alt="logo" className={`${size ? size : "max-w-12"}`} />
      <div className="">
        <span className="text-blue-500 font-black">Soa</span>
        <span className="font-semibold">PORTAL</span>
      </div>
    </h1>
  );
};

export default Logo;
