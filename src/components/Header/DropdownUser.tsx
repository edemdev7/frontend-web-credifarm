import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import useAdminStore from "../../store/Admin/adminStore";
import useCooperativeStore from "../../store/cooperativeStore";
import toast from "react-hot-toast";
import { capitalize } from "../../utils/formatters";

const DropdownUser: FC = () => {
  const adminStore = useAdminStore();
  const cooperativeStore = useCooperativeStore();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const role = accessToken ? accessToken.substring(0, 3) : "";
  let user = null;
  if (role === "ADM") {
    user = adminStore.user;
  }
  if (!user) {
    // Si le store est vide (après refresh), on lit le localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      user = JSON.parse(userStr);
    }
  }
  // Affichage du nom complet et du rôle
  const userName = user ? (user.nom && user.prenom ? `${user.prenom} ${user.nom}` : user.name || user.username || "") : "";
  const userRole = user && user.role ? user.role.nom || user.role.code : (role === "ADM" ? "Admin" : "Coopérative");
  return (
    <Dropdown
      className="!font-[Montserrat] rounded-md"
      backdrop="blur"
      classNames={{
        base: "!text-[10px]",
      }}
    >
      <DropdownTrigger>
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="min-h-8 min-w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-black">
            {userName ? userName[0].toUpperCase() : "?"}
          </div>
          <div className="hidden min-w-6 md:flex flex-col justify-center">
            <span className="~text-xs/sm font-semibold min-w-6 line-clamp-1">
              {userName}
            </span>
            <div className="flex items-center gap-1">
                <span className="text-[10px] leading-none">{userRole}</span>
              <i className="text-[8px] text-gray-600 fa-solid fa-caret-down"></i>
            </div>
          </div>
        </div>
      </DropdownTrigger>
      <DropdownMenu variant="faded" aria-label="Menu utilisateur">
      <DropdownSection
          title={`Que voulez-vous faire ${user?.prenom || user?.name || 'Utilisateur'} ?`}
          showDivider
        >
            <DropdownItem
            key="profile"
            description="Gérer mon profil"
            className=""
            startContent={<i className="fa-duotone fa-user"></i>}
            classNames={{
              base: "!text-xs",
              title: "!text-xs",
              description: "!text-xs",
            }}
            onPress={() => {
              if (role === "ADM") {
              navigate("/admin/profile");
              } else if (role === "COO") {
              navigate("/cooperative/profile");
              }
            }}
            >
            <span className="!text-xs font-semibold">Profil</span>
            </DropdownItem>
        </DropdownSection>
        {/* <DropdownSection
          title={`Que voulez-vous faire ${user?.name.split("_")[0]} ?`}
          showDivider
        >
          <DropdownItem
            key="settings"
            description="Gérer mes paramètres"
            className=""
            startContent={<i className="fa-duotone fa-cog"></i>}
            classNames={{
              base: "!text-xs",
              title: "!text-xs",
              description: "!text-xs",
            }}
            onClick={() => {
              if (role === "ADM") {
              navigate("/admin/settings");
              } else if (role === "COO") {
              navigate("/cooperative/settings");
              }
            }}
          >
            <span className="!text-xs font-semibold">Paramètres</span>
          </DropdownItem>
        </DropdownSection> */}
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          description="Me déconnecter de mon compte"
          startContent={<i className="fa-duotone fa-sign-out-alt"></i>}
          classNames={{
            base: "!text-xs",
            title: "!text-xs",
            description: "!text-xs",
          }}
          onClick={() => {
            localStorage.removeItem("accessToken");
            toast.success("Déconnecté avec succès !");
            navigate("/login");
          }}
        >
          <span className="!text-xs font-semibold">Déconnexion</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropdownUser;
