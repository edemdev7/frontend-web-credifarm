import React, { useState } from 'react';
import { IAdmin, INewAdmin } from "../../../../components/types/admin";
import { useForm } from "react-hook-form";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { motion } from "framer-motion";

export interface AdminFormProps {
    initialData?: IAdmin;
    onSubmit: (admin: INewAdmin) => void;
    submitText: string;
  }

export const AdminForm: React.FC<AdminFormProps> = ({ initialData, onSubmit, submitText }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm<INewAdmin>({
        defaultValues: initialData
      });


    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center flex-col gap-4 w-full max-w-[400px]"
        >

        {/* Username Input */}
        <Input
            {...register("username", {
            required: "Le nom d'utilisateur est requis",
            minLength: {
                value: 3,
                message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
            },
            })}
            isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
            type="text"
            label="Nom d'utilisateur"
            radius="sm"
            placeholder="Entrez le nom d'utilisateur..."
            classNames={{
            base: "w-full",
            input: "text-sm",
            label: "text-sm font-medium text-gray-700",
            }}
        />

        {/* Name Input */}
        <Input
            {...register("name", {
            required: "Le nom est requis",
            minLength: {
                value: 3,
                message: "Le nom doit contenir au moins 3 caractères",
            },
            })}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            type="text"
            label="Nom complet"
            radius="sm"
            placeholder="Entrez le nom complet..."
            classNames={{
            base: "w-full",
            input: "text-sm",
            label: "text-sm font-medium text-gray-700",
            }}
        />

        {/* Password Input */}
        <Input
            {...register("password", {
            required: "Le mot de passe est requis",
            minLength: {
                value: 3,
                message: "Le mot de passe doit contenir au moins 3 caractères",
            },
            })}
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            type="password"
            label="Mot de passe"
            radius="sm"
            placeholder="Entrez le mot de passe..."
            classNames={{
            base: "w-full",
            input: "text-sm",
            label: "text-sm font-medium text-gray-700",
            }}
        />

        {/* Super Admin Checkbox */}
        <div className="w-full flex items-center justify-between mt-2">
            <label className="text-sm font-medium text-gray-700">
            Super Administrateur ?
            </label>
            <Checkbox
            {...register("isSuperAdmin")}
            classNames={{
                // base: "w-5 h-5",
                icon: "text-white", // Customize the checkbox icon color
            }}
            color="primary" // Use a primary color for the checkbox
            />
        </div>

        {/* Submit Button */}
        <Button
            type="submit"
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium"
            radius="sm"
            isLoading={isSubmitting}
            disabled={isSubmitting} // Disable button while submitting
        >
            {isSubmitting ? "En cours..." : submitText}
        </Button>
        </form>
        
    );
};