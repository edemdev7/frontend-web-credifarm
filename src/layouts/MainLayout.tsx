import { FC, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import useAdminStore from "../store/Admin/adminStore";
import useCooperativeStore from "../store/cooperativeStore";
import { IAdmin } from "../components/types/admin";
import { ICooperative } from "../components/types/cooperative";
import { mockData } from "../api/mockData";

// Simuler les réponses API avec les données mockées
export const getAdminProfile = async (): Promise<IAdmin> => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  // Adapter les données mockées à l'interface IAdmin
  return {
    id: mockData.admin.profile.id,
    name: `${mockData.admin.profile.firstName} ${mockData.admin.profile.lastName}`,
    username: mockData.admin.profile.email,
    isSuperAdmin: true,
    authKey: "mock-auth-key"
  };
};

export const getCooperativeProfile = async (): Promise<ICooperative> => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  // Adapter les données mockées à l'interface ICooperative
  return {
    id: mockData.cooperatives[0].id,
    name: mockData.cooperatives[0].name,
    acronym: "COOP1",
    phone: mockData.cooperatives[0].phone,
    password: "mock-password",
    confirmPassword: "mock-password",
    form: "mock-form",
    registrationNumber: "REG123",
    headquarters: "Mock Headquarters",
    memberCount: 100,
    mainCrop: 1,
    creationDate: new Date(),
    secondaryCrops: [1],
    assets: [1],
    otp1: "123456",
    otp2: "123456",
    otp3: "123456",
    otp4: "123456",
    otp5: "123456",
    otp6: "123456",
    RCCMDocumentUrl: "mock-url",
    DFEDocumentUrl: "mock-url",
    MembershipRegisterDocumentUrl: "mock-url",
    threeYearBalanceSheetDocumentUrl: "mock-url"
  };
};

const MainLayout: FC = () => {
  const token = localStorage.getItem("accessToken");
  const { setAdmin: setAdminUser } = useAdminStore();
  const { setCooperative: setCooperativeUser } = useCooperativeStore();

  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          const role = token.substring(0, 3);
          
          if (role === 'ADM') {
            const adminData = await getAdminProfile();
            setAdminUser({
              id: adminData.id,
              name: adminData.name,
              username: adminData.username,
              isSuperAdmin: adminData.isSuperAdmin,
              authKey: adminData.authKey
            });
          } else if (role === 'COO') {
            const cooperativeData = await getCooperativeProfile();
            setCooperativeUser(cooperativeData);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          localStorage.removeItem("accessToken");
        }
      }
    };

    fetchData();
  }, [token, setAdminUser, setCooperativeUser]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col justify-between">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;