import { FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { buildUrl } from "../utils/formatters";
import { useNavigate } from "react-router-dom";
// import { Spinner } from "../components/ui/spinner"; // Assuming you have a spinner component

const IndexPage: FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Move the redirection logic inside useEffect to avoid rendering issues
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      // Handle case when user is not authenticated
      navigate('/login');
      return;
    }
    
    // Redirect to admin dashboard
    navigate('/admin/dashboard');
  }, [navigate]);

  // Get destination for the manual link
  const getDestination = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return buildUrl('/login');
    
    return buildUrl('/admin/dashboard');
  };

  return (
    <div>
      <Helmet>
        <title>Bienvenue | Soa</title>
        <meta name="description" content="Plateforme de gestion Soa" />
      </Helmet>
      <main className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <img 
          src="/logo.png" 
          alt="Soa Logo" 
          className="w-32 mb-6"
        />
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Bienvenue sur Soa
          </h1>
          {/* <div className="flex justify-center my-4">
            <Spinner className="h-8 w-8 text-green-600" />
          </div> */}
          <p className="mb-4 text-gray-700">
            Redirection en cours...
          </p>
          <p className="text-sm text-gray-600">
            Si la redirection ne fonctionne pas, veuillez cliquer sur le lien suivant:
          </p>
          <a 
            href={getDestination()} 
            className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Accéder à votre tableau de bord
          </a>
        </div>
      </main>
    </div>
  );
};

export default IndexPage;