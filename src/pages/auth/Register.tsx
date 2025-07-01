import { Button, Input, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { registerCooperative, sendOTP, verifyOTP } from "../../api/services/cooperative/cooperativeService";
import Logo from "../../components/Logo";
import { FileUpload } from '../../components/Inputs/FileUpload';
import * as Enums from '../../utils/enums'

export interface RegisterFormProps {
    name: string;
    acronym: string;
    phone: string;
    password: string;
    confirmPassword: string;
    form: string;
    registrationNumber: string;
    headquarters: string;
    memberCount: number;
    mainCrop: number;
    secondaryCrops: number[];
    assets: number[];
    otp1: string;
    otp2: string;
    otp3: string;
    otp4: string;
    otp5: string;
    otp6: string;
}

const Register: FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormProps>();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  

  // Watch password for confirmation validation
  const password = watch("password");

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
  // for OTP validation
  const [isVerified, setIsVerified] = useState(false);
  useEffect(() => {
    if (isVerified) {
      setIsVerified(true);
    }else{
      setIsVerified(false);
    }
  }
  , [isVerified]);


  // Animation variants for form steps
  const fadeInOut = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const onSubmit = async (data: RegisterFormProps) => {
    try {
      if (step < totalSteps) {
        setStep(step + 1);
        return;
      }
      // data.secondaryCrops = data.secondaryCrops.split(',').map(Number);
      // data.assets = data.assets.split(',').map(Number);
      data.mainCrop = Number(data.mainCrop);
      const response = await registerCooperative(data);
      console.log('Response',response);
      if (response.status === 201) {
        toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        navigate("/login");
      }else if (response.status === 409){
        toast.error("Un compte avec ce numéro de téléphone existe déjà.");
      }else{
        toast.error("Une erreur s'est produite. Veuillez réessayer.".concat(response.status.toString()));
      }
    } catch (error) {
      toast.error(`Une erreur s'est produite. Veuillez réessayer. ${error}`);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  return (
    <div>
      <Helmet>
        <title>Inscription | Soa</title>
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
              Inscription
            </motion.h1>

            {/* Progress Steps */}
            <div className="w-full flex justify-between mb-8">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
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
                  {stepNumber < 5 && (
                    <div
                      className={`w-16 h-1 ${
                        step > stepNumber ? "bg-green-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                className="w-full space-y-4"
                {...fadeInOut}
              >
                <Input
                  {...register("name", {
                    required: "La dénomination de la coopérative est requise",
                    minLength: {
                      value: 3,
                      message: "Le nom doit contenir au moins 3 caractères",
                    },
                  })}
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  type="text"
                  label="Dénomination de la coopérative"
                  radius="sm"
                  placeholder="Entrez le nom complet..."
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm",
                  }}
                />

                <Input
                  {...register("acronym", {
                    required: "L'acronyme est requis",
                    pattern: {
                      value: /^[A-Z0-9-]{2,10}$/,
                      message: "L'acronyme doit être en majuscules (2-10 caractères)",
                    },
                  })}
                  isInvalid={!!errors.acronym}
                  errorMessage={errors.acronym?.message}
                  type="text"
                  label="Acronyme"
                  radius="sm"
                  placeholder="Ex: COOP-ABC"
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm",
                  }}
                />,

                <Select
                  {...register("form", {
                    required: "La forme juridique est requise",
                  })}
                  label="Forme juridique"
                  placeholder="Sélectionnez la forme juridique"
                  className="w-full"
                >
                  {Enums.cooperativeFormEnum.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </Select>,

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


            {/* Step 2: Cooperative Details */}
            {step === 2 && (
              <motion.div
                className="w-full space-y-4"
                {...fadeInOut}
              >
                <Select
                  {...register("assets")}
                  label="Actifs"
                  selectionMode="multiple"
                  placeholder="Sélectionnez les actifs"
                >
                  {Enums.assetsEnum.map((crop) => (
                    <SelectItem key={crop.value} value={crop.value}>
                      {crop.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  {...register("registrationNumber", {
                    required: "Le numéro d'enregistrement est requis",
                  })}
                  isInvalid={!!errors.registrationNumber}
                  errorMessage={errors.registrationNumber?.message}
                  type="text"
                  label="Numéro d'enregistrement"
                  radius="sm"
                  placeholder="Ex: CI-ABJ-2024-..."
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm",
                  }}
                />

                <Input
                  {...register("headquarters", {
                    required: "Le siège social est requis",
                  })}
                  isInvalid={!!errors.headquarters}
                  errorMessage={errors.headquarters?.message}
                  type="text"
                  label="Siège social"
                  radius="sm"
                  placeholder="Ville, Région..."
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm",
                  }}
                />

                <Select
                  {...register("mainCrop", {
                    required: "La culture principale est requise",
                  })}
                  label="Culture principale"
                  placeholder="Sélectionnez la culture principale"
                  className="w-full"
                >
                  {Enums.cooperativeMainCropEnum.map((crop) => (
                    <SelectItem key={crop.value} value={crop.value}>
                      {crop.label}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  {...register("secondaryCrops", {
                    required: "Les cultures sécondaires des membres est requise",
                  })}
                  label="Cultures sécondaires des membres"
                  placeholder="Sélectionnez Les cultures sécondaires des membres"
                  selectionMode="multiple"
                  className="w-full"
                >
                  {Enums.cooperativeSecondaryCropsEnum.map((crop) => (
                    <SelectItem key={crop.value} value={crop.value}>
                      {crop.label}
                    </SelectItem>
                  ))}
                </Select>
                
              </motion.div>
            )}

            {/* Step 3: OTP verification */}
            
            {step === 3 && (
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
                    {...register(`otp${digit}` as keyof RegisterFormProps, {
                    required: true,
                    pattern: /^[0-9]$/
                    })}
                    className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 
                        border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 
                        transition-all duration-200 outline-none"
                    onKeyUp={async (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value && digit < 6) {
                      const nextInput = target.nextElementSibling as HTMLInputElement;
                      if (nextInput) nextInput.focus();
                    }
                    if (e.key === 'Backspace' && !target.value && digit > 1) {
                      const prevInput = target.previousElementSibling as HTMLInputElement;
                      if (prevInput) prevInput.focus();
                    }
                    if (digit === 6 && target.value) {
                      const code = [
                      watch("otp1"),
                      watch("otp2"),
                      watch("otp3"),
                      watch("otp4"),
                      watch("otp5"),
                      watch("otp6")
                      ].join("");
                        setIsLoading(true);
                        const response = await verifyOTP(watch("phone"), code);
                        console.log(response);
                        setIsLoading(false);
                      // alert(response.statusCode);
                      if (response && response.data.status === 202) {
                        setIsVerified(true);
                        toast.success("Code vérifié avec succès !");
                      } else {
                        setIsVerified(false);
                        toast.error("Code invalide. Veuillez réessayer".concat(response.statusCode));
                      }
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
                      if (response && response.status == 200) {
                        setTimer(610);
                        toast.success("Un nouveau code a été envoyé !");
                      } else {
                        toast.error("Une erreur s'est produite. Veuillez réessayer.".concat(response.status));
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

                {/* Error message */}
                {(errors.otp1 || errors.otp2 || errors.otp3 || errors.otp4 || errors.otp5 || errors.otp6) && (
                  <p className="text-sm text-red-500 text-center">
                    Veuillez entrer un code valide à 6 chiffres
                  </p>
                )}

                {/* Loading spinner */}
                {isLoading && (
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-2 border-t-2 border-green-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Security */}
            {step === 4 && (
              <motion.div
                className="w-full space-y-4"
                {...fadeInOut}
              >
                <Input
                  {...register("password", {
                    required: "Le mot de passe est requis",
                    minLength: {
                      value: 8,
                      message: "Le mot de passe doit contenir au moins 8 caractères",
                    },
                  })}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                  type="password"
                  label="Mot de passe"
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


            {/* Step 5: DOcuments uploading */}
            {step === 5 && (
              <motion.div
                className="w-full space-y-4"
                {...fadeInOut}
              >
                <FileUpload
                  label="RCCM"
                  name="RCCMDocument"
                />

                <FileUpload
                  label="DFE"
                  name="DFEDocument"
                />

                <FileUpload
                  label="Régistre de membres"
                  name="MembershipRegisterDocument"
                />

                <FileUpload
                  label="Bilans des 3 dernières années"
                  name="threeYearBalanceSheetDocument"
                />
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="w-full flex gap-3 mt-6">
              {step > 1 && (
              <Button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  if (step === 3) {
                    sendOTP(watch("phone"));
                    setIsVerified(false);
                    setTimer(610);
                  }
                }}
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
              disabled={step === 3 && !isVerified}
              >
              {step === totalSteps ? "S'inscrire" : "Suivant"}
              </Button>
            </div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full text-center mt-4"
            >
              <span className="text-sm text-gray-600">Déjà inscrit ? </span>
              <Link
                to="/login"
                className="text-sm text-primary hover:underline transition-colors"
              >
                Se connecter
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
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500"></div>
          <div className="rounded-full h-bubble-lg w-bubble-lg absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-100"></div>
          <div className="rounded-full h-bubble-md w-bubble-md absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-200"></div>
          <div className="rounded-full h-bubble-sm w-bubble-sm absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 bg-green-500"></div>
        </div>{" "}
      </main>
    </div>
  );
};

export default Register;