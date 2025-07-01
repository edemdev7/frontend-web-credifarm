import React, { useState, useEffect } from 'react';
import { IRegion, INewRegion } from "../../../../components/types/region";
import { useForm } from "react-hook-form";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { motion } from "framer-motion";
import { IDepartment } from "../../../../components/types/department";
import { fetchDepartments } from "../../../../api/department";

export interface RegionFormProps {
    initialData?: IRegion;
    onSubmit: (region: INewRegion) => void;
    submitText: string;
}

export const RegionForm: React.FC<RegionFormProps> = ({ initialData, onSubmit, submitText }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<INewRegion>({
        defaultValues: initialData
            ? { nom: initialData.nom, departementId: initialData.departement?.id }
            : undefined,
    });
    const [departments, setDepartments] = useState<IDepartment[]>([]);

    useEffect(() => {
        const fetchDeps = async () => {
            const deps = await fetchDepartments();
            setDepartments(deps);
        };
        fetchDeps();
    }, []);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-col gap-4 w-full max-w-[400px]"
        >
            {/* Nom de la région */}
            <Input
                {...register("nom", {
                    required: "Le nom de la région est requis",
                    minLength: {
                        value: 3,
                        message: "Le nom de la région doit contenir au moins 3 caractères",
                    },
                })}
                isInvalid={!!errors.nom}
                errorMessage={errors.nom?.message}
                type="text"
                label="Nom de la région"
                radius="sm"
                placeholder="Entrez le nom de la région..."
                classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm font-medium text-gray-700",
                }}
            />
            {/* Département */}
            <Select
                {...register("departementId", { required: "Le département est requis" })}
                isInvalid={!!errors.departementId}
                errorMessage={errors.departementId?.message}
                label="Département"
                radius="sm"
                placeholder="Sélectionnez le département..."
                classNames={{
                    base: "w-full bg-slate-100",
                    label: "text-sm font-medium text-gray-700",
                    trigger: "bg-white text-gray-900",
                    listbox: "bg-white text-gray-900",
                    popoverContent: "bg-white",
                    item: "hover:bg-blue-100 text-gray-900",
                }}
                defaultSelectedKeys={initialData?.departement ? [initialData.departement.id] : []}
            >
                {departments.map((dep) => (
                    <SelectItem key={dep.id} value={dep.id} className="text-gray-900">
                        {dep.name}
                    </SelectItem>
                ))}
            </Select>
            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium"
                radius="sm"
                isLoading={isSubmitting}
                disabled={isSubmitting}
            >
                {isSubmitting ? "En cours..." : submitText}
            </Button>
        </form>
    );
};