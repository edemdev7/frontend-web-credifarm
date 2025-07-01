import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import { sendOTP, verifyOTP } from "../../api/services/cooperative/cooperativeService";
import { forgotPassword } from "../../api/services/cooperative/cooperativeService";

export interface ForgotPasswordFormProps {
  phone: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPassword: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormProps>();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Watch password for confirmation validation
  const password = watch("newPassword");

  // Timer for OTP verification
  const [timer, setTimer] = useState(610); // in seconds
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // For OTP verification
  const [isVerified, setIsVerified] = useState(false);

  // Animation variants for form steps
  const fadeInOut = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const onSubmit = async (data: ForgotPasswordFormProps) => {
    try {
      if (step === 1) {
        // Send OTP to phone number
        const response = await sendOTP(data.phone);
        if (response.status === 201) {
          setStep(2);
          toast.success("Code envoyé avec succès !");
        } else {
          toast.error("Une erreur s'est produite. Veuillez réessayer.");
        }
        return;
      }

      if (step === 2) {
        // Verify OTP
        const code = [
          data.otp1, data.otp2, data.otp3,
          data.otp4, data.otp5, data.otp6
        ].join("");
        
        const verifyResponse = await verifyOTP(data.phone, code);
        console.log(verifyResponse);
        if (verifyResponse.status === 201) {
          setIsVerified(true);
          setStep(3);
          toast.success("Code vérifié avec succès !");
        } else {
          toast.error("Code invalide. Veuillez réessayer.");
        }
        return;
      }

      // Final step: Reset password
      const resetResponse = await forgotPassword(data.phone, data.newPassword, data.confirmPassword);
      console.log(resetResponse);
      if (resetResponse.status === 201) {
        toast.success("Mot de passe réinitialisé avec succès !");
        navigate("/login");
      } else {
        toast.error("Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <Helmet>
        <title>Mot de passe oublié | Soa</title>
      </Helmet>
      <main>
        <div className="relative flex items-center justify-center min-h-screen py-12 overflow-hidden">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-col gap-3 w-full max-w-[400px] mx-4"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Logo isVertical />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-800 mb-4"
            >
              Mot de passe oublié
            </motion.h1>

            {/* Progress Steps */}
            <div className="w-full flex justify-between mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step >= stepNumber
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`w-24 h-1 ${
                        step > stepNumber ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Phone Number */}
            {step === 1 && (
              <motion.div
                className="w-full space-y-4"
                {...fadeInOut}
              >
                <p className="text-sm text-gray-600 mb-4">
                  Entrez votre numéro de téléphone pour recevoir un code de vérification.
                </p>
                <Input
                  {...register("phone", {
                    required: "Le numéro de téléphone est requis",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Le numéro doit contenir 10 chiffres",
                    },
                  })}
                  isInvalid={!!errors.phone}
                  errorMessage={errors.phone?.message}
                  type="tel"
                  label="Numéro de téléphone"
                  radius="sm"
                  placeholder="0X XX XX XX XX"
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm",
                  }}
                />
              </motion.div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <motion.div className="w-full space-y-6" {...fadeInOut}>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Vérification par SMS
                  </h2>
                  <p className="text-sm text-gray-600">
                    Nous avons envoyé un code à 6 chiffres au
                    <span className="font-medium text-gray-800"> {watch("phone")}</span>
                  </p>
                </div>

                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((digit) => (
                    <input
                      key={digit}
                      type="text"
                      maxLength={1}
                      {...register(`otp${digit}`, {
                        required: true,
                        pattern: /^[0-9]$/
                      })}
                      className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 
                          border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 
                          transition-all duration-200 outline-none"
                      onKeyUp={(e) => {
                        const target = e.target as HTMLInputElement;
                        if (target.value && digit < 6) {
                          const nextInput = target.nextElementSibling as HTMLInputElement;
                          if (nextInput) nextInput.focus();
                        }
                        if (e.key === 'Backspace' && !target.value && digit > 1) {
                          const prevInput = target.previousElementSibling as HTMLInputElement;
                          if (prevInput) prevInput.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Vous n'avez pas reçu le code ?
                  </p>
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                    onClick={async () => {
                      const response = await sendOTP(watch("phone"));
                      if (response.status === 201) {
                        setTimer(610);
                        toast.success("Un nouveau code a été envoyé !");
                      } else {
                        toast.error("Une erreur s'est produite. Veuillez réessayer.");
                      }
                    }}
                  >
                    Renvoyer le code
                  </button>
                </div>

                {/* Timer */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Expire dans: <span className="font-medium text-gray-800">{formatTime(timer)}</span>
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <motion.div
                className="w-full space-y-4"
                {...fadeInOut}
              >
                <p className="text-sm text-gray-600 mb-4">
                  Veuillez saisir votre nouveau mot de passe.
                </p>
                <Input
                  {...register("newPassword", {
                    required: "Le mot de passe est requis",
                    minLength: {
                      value: 8,
                      message: "Le mot de passe doit contenir au moins 8 caractères",
                    },
                  })}
                  isInvalid={!!errors.newPassword}
                  errorMessage={errors.newPassword?.message}
                  type="password"
                  label="Nouveau mot de passe"
                  radius="sm"
                  placeholder="Minimum 8 caractères..."
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm",
                  }}
                />

                <Input
                  {...register("confirmPassword", {
                    required: "Veuillez confirmer le mot de passe",
                    validate: value =>
                      value === password || "Les mots de passe ne correspondent pas",
                  })}
                  isInvalid={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword?.message}
                  type="password"
                  label="Confirmer le mot de passe"
                  radius="sm"
                  placeholder="Retapez votre mot de passe..."
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm",
                  }}
                />
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="w-full flex gap-3 mt-6">
              {step > 1 && (
                <Button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                  variant="bordered"
                  radius="sm"
                >
                  Précédent
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 bg-green-500"
                radius="sm"
                isLoading={isSubmitting}
              >
                {step === totalSteps ? "Réinitialiser" : "Suivant"}
              </Button>
            </div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center mt-4"
            >
              <Link
                to="/login"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Retour à la connexion
              </Link>
            </motion.div>

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-xs text-gray-600 mt-6"
            >
              © {new Date().getFullYear()} Soa - Tous droits réservés.
            </motion.p>
          </form>

          {/* Background Decorations */}
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500"></div>
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-100"></div>
          <div className="rounded-full h-bubble-md w-bubble-md absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-200"></div>
          <div className="rounded-full h-bubble-sm w-bubble-sm absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-500"></div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;