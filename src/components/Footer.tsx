import React from "react";
import logo from "../assets/logo-icon.png";
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full pt-2 pb-5 px-4 shadow-sm">
      <div className="flex flex-col justify-center items-center gap-2 text-xs text-gray-500">
        <img src={logo} className="max-w-10" />
        <p>
          &copy; {currentYear} <b>Soa</b>. Tous droits réservés
        </p>
      </div>
    </footer>
  );
};

export default Footer;
