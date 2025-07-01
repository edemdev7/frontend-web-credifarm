import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { FC } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/services/userService";
import Logo from "../components/Logo";
import useUserStore from "../store/userStore";
import { useState } from 'react';

export interface FormProps {
  username: string;
  password: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormProps>();
  const { setUser } = useUserStore();
  const [userType, setUserType] = useState<'cooperative' | 'admin'>('cooperative');

  // Soumission du formulaire
  const onSubmit = async (data: FormProps) => {
    setUser({
      username: 'admin',
      id: 0,
      role: 'admin',
    });
    const response = await loginUser(data);
    if (response) {
      localStorage.setItem("accessToken", response.accessToken);

      setUser({
        username: response.data.username,
        id: response.data.userId,
        role: response.data.roles[0].name,
      });

      toast.success("Connexion réussie!");
      navigate("/");
    } else {
      toast.error("Échec de la connexion. Vérifiez vos informations.");
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
            {/* Logo Soa */}
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="my-3"
            >
              <Logo isVertical />
            </motion.div>

            {/* username début */}
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="w-full"
            >
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setUserType('cooperative')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    userType === 'cooperative'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Coopérative
                </button>
                <button
                  onClick={() => setUserType('admin')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    userType === 'admin'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Administrateur
                </button>
              </div>

              <Input
                {...register("username", { required: "Renseignez un nom d'utilisateur valide.", minLength: 3 })}
                isInvalid={!!errors.username}
                errorMessage={errors.username?.message}
                name="username"
                type="text"
                radius="sm"
                startContent={
                  <i
                    className={`fa-light fa-user-tie text-xs ${errors.username && "text-red-600"}`}
                  ></i>
                }
                placeholder="Nom d'utilisateur..."
                classNames={{
                  base: "!bg-slate-100 w-full",
                  inputWrapper: "!bg-white",
                  input: "placeholder:!text-xs text-xs",
                }}
              />
            </motion.div>
            {/* username fin */}

            {/* password debut */}
            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="w-full"
            >
              <Input
                {...register("password", { required: "Remplissez correctement ce champ." })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                name="password"
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
            {/* password fin */}

            {/* envoyer debut */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="w-full"
            >
              <Button
                className="bg-green-500 w-full mt-2"
                color="danger"
                radius="sm"
                type="submit"
                isLoading={isSubmitting}
              >
                Se connecter
              </Button>
            </motion.div>
            {/* envoyer fin */}

            {/* Copyright Soa */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
              }}
              className="text-center text-xs text-gray-600"
            >
              © {new Date().getFullYear()} Soa - Tous droits réservés.
            </motion.p>
          </form>
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500"></div>
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-100"></div>
          <div className="rounded-full h-bubble-md w-bubble-md absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-200"></div>
          <div className="rounded-full h-bubble-sm w-bubble-sm absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-500"></div>
        </div>{" "}
      </main>
    </div>
  );
};

export default Login;