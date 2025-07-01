import React, { useState } from 'react';
import { ICooperative, INewCooperative } from "../../../../components/types/cooperative";
import { useForm } from "react-hook-form";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { Checkbox } from "@heroui/react";
import { motion } from "framer-motion";

export interface CooperativeFormProps {
    initialData?: ICooperative;
    onSubmit: (cooperative: INewCooperative) => void;
    submitText: string;
  }

export const CooperativeForm: React.FC<CooperativeFormProps> = ({ initialData, onSubmit, submitText }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
      } = useForm<INewCooperative>({
        defaultValues: initialData
      });


    return (
        <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center flex-col gap-4 w-full max-w-[400px]"
        >

        {/* Username Input */}
        <Input
            {...register("name", {
            required: "Le nom de la cooperative est requis",
            minLength: {
                value: 3,
                message: "Le nom de la cooperative doit contenir au moins 3 caractères",
            },
            })}
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            type="text"
            label="Nom de la cooperative"
            radius="sm"
            placeholder="Entrez le nom de la cooperative..."
            classNames={{
            base: "w-full",
            input: "text-sm",
            label: "text-sm font-medium text-gray-700",
            }}
        />

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