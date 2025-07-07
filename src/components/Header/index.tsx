import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import useTriggerStore from "../../store/triggerStore";
import Logo from "../Logo";
import Cursor from "./Cursor";
import Dropdown from "./DropdownUser";
import Sidebar from "./Sidebar";
import Trigger from "./Trigger";

interface NavItem {
  path: string;
  label: string;
}

const Header: FC = () => {
  const { pathname } = useLocation();
  const [active, setActive] = useState<string>("");
  const { setTriggered } = useTriggerStore();
  const _header = useRef<HTMLElement>(null);
  const accessToken = localStorage.getItem("accessToken");
  const role = accessToken ? accessToken.substring(0, 3) : "";

  useEffect(() => {
    setActive(pathname);
    setTriggered(false);
  }, [pathname, setTriggered]);

  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const fetchNavItems = async () => {
      const items: NavItem[] = role === "COO" ? [
        { path: "/cooperative/dashboard", label: "TABLEAU DE BORD" },
        { path: "/cooperative/membership-request", label: "DEMANDES D'ADHESION" },
        { path: "/cooperative/members", label: "MEMBRES" },
      ] : [
        { path: "/admin/dashboard", label: "TABLEAU DE BORD" },
        { path: "/admin/repository", label: "REFERENTIEL" },
        { path: "/admin/pisciculteurs", label: "PISCICULTEURS" },
        { path: "/admin/bassins", label: "BASSINS D'EAU" },
        { path: "/admin/calendrier-recoltes", label: "CALENDRIER DE RÉCOLTES" },
        { path: "/admin/calendrier-intrants", label: "CALENDRIER D'AVANCES SUR INTRANTS" },
      ];
      setNavItems(items);
    };

    fetchNavItems();
  }, [role]);
  

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | Event) => {
      // Vérifie si le clic est en dehors de l'élément référencé
      if (_header.current && !_header.current.contains(event.target as Node)) {
        setTriggered(false);
      }
    };
    // Ajouter un écouteur global pour capturer les clics
    document.addEventListener("click", handleOutsideClick);

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [setTriggered]);

  return (
    <header
      ref={_header}
      className="z-50 fixed w-full bg-white shadow-md flex justify-between gap-3 items-center ~px-3/10 h-12"
    >
      {/* Logo */}
      <Logo size="max-w-8" />

      {/* Navigation */}
      <div className="hidden md:block h-full flex-1 min-w-[500px] relative">
        <nav className="text-xs no-scrollbar overflow-x-auto h-full">
          <ul className="flex items-center justify-start lg:justify-center gap-2 font-semibold w-fit lg:w-full h-full">
            {navItems.map(({ path, label }, index) => (
              <li
                key={path}
                className={`relative h-full flex-shrink-0 ${
                  index === navItems.length - 1 && "mr-8"
                } ${index === 0 && "ml-8"}`}
              >
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `px-3 flex items-center relative h-full ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "hover:bg-slate-100 transition-all duration-300"
                    }`
                  }
                >
                  <span>{label}</span>
                  {active === path && <Cursor />}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="lg:hidden bg-gradient-to-r from-white to-transparent absolute left-0 top-0 h-full w-12"></div>
          <div className="lg:hidden bg-gradient-to-l from-white to-transparent absolute right-0 top-0 h-full w-12"></div>
        </nav>
      </div>

      <div className="flex gap-2 items-center">
        {/* User Info */}
        <Dropdown />

        {/* Trigger */}
        <div className="md:hidden">
          <Trigger />
          <Sidebar navItems={navItems} active={active} />
        </div>
      </div>
    </header>
  );
};

export default Header;
