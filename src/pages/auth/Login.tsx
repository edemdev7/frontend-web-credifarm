import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { FC, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import useAdminStore from "../../store/Admin/adminStore";
import useCooperativeStore from "../../store/cooperativeStore";
import { sharedLogin } from '../../api/services/sharedLoginService';

export interface FormProps {
  email?: string;
  password: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormProps>();
  const { setAdmin } = useAdminStore();
  const { setCooperative } = useCooperativeStore();

  // Redirect to dashboard page if connected
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Handle form submission
  const onSubmit = async (data: FormProps) => {
    try {
      const response = await sharedLogin({ email: data.email!, password: data.password });
      const { access_token, user } = response.data;
      if (access_token && user && user.role && user.role.code) {
        toast.success("Connexion réussie !");
        navigate("/admin/dashboard");
      } else {
        toast.error("Échec de la connexion. Vérifiez vos informations.");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <Helmet>
        <title>Connexion | Soa</title>
      </Helmet>
      <main>
        <div className="relative flex items-center justify-center h-screen overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-col gap-3 w-full max-w-[300px]"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="my-3"
            >
              <Logo isVertical />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-800 mb-4"
            >
              Connexion
            </motion.h1>

            {/* Username or Phone Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <Input
                {...register("email", {
                  required: "Renseignez un numéro de téléphone valide.",
                })}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                type="text"
                radius="sm"
                placeholder="Numéro de téléphone..."
                startContent={
                  <i
                    className={`fa-light fa-phone text-xs ${
                      errors.email && "text-red-600"
                    }`}
                  ></i>
                }
                classNames={{
                  base: "!bg-slate-100 w-full",
                  inputWrapper: "!bg-white",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <Input
                {...register("password", { required: "Remplissez correctement ce champ." })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                type="password"
                radius="sm"
                placeholder="Mot de passe..."
                startContent={
                  <i
                    className={`fa-light fa-lock text-xs ${errors.password && "text-red-600"}`}
                  ></i>
                }
                classNames={{
                  base: "!bg-slate-100 w-full",
                  inputWrapper: "!bg-white",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
            </motion.div>

            {/* Forgot Password Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full text-right"
            >
              <Link
                to="/forgot-password"
                className="text-xs text-gray-600 hover:text-primary transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <Button
                className="bg-blue-500 w-full mt-2"
                color="danger"
                radius="sm"
                type="submit"
                isLoading={isSubmitting}
              >
                Se connecter
              </Button>
            </motion.div>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full text-center"
            >
              <span className="text-xs text-black-600">Pas de compte ? </span>
              <Link
                to="/register"
                className="text-xs text-primary hover:underline transition-colors"
              >
                S'inscrire
              </Link>
            </motion.div>

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center text-xs text-gray-600"
            >
              © {new Date().getFullYear()} Soa - Tous droits réservés.
            </motion.p>
          </form>
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-blue-500"></div>
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-blue-100"></div>
          <div className="rounded-full h-bubble-md w-bubble-md absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-blue-200"></div>
          <div className="rounded-full h-bubble-sm w-bubble-sm absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-blue-500"></div>
        </div>{" "}
      </main>
    </div>
  );
};

export default Login;

