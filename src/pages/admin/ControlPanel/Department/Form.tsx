import React from 'react';
import { INewDepartment } from "../../../../components/types/department";
import { useForm } from "react-hook-form";
import { Button, Input } from "@heroui/react";

export interface DepartmentFormProps {
    initialData?: INewDepartment;
    onSubmit: (department: INewDepartment) => void;
    submitText: string;
}

export const DepartmentForm: React.FC<DepartmentFormProps> = ({ initialData, onSubmit, submitText }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<INewDepartment>({
        defaultValues: initialData ? { name: initialData.name } : undefined,
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex items-center flex-col gap-4 w-full max-w-[400px]"
        >
            <Input
                {...register("name", {
                    required: "Le nom du département est requis",
                    minLength: {
                        value: 3,
                        message: "Le nom du département doit contenir au moins 3 caractères",
                    },
                })}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                type="text"
                label="Nom du département"
                radius="sm"
                placeholder="Entrez le nom du département..."
                classNames={{
                    base: "w-full",
                    input: "text-sm",
                    label: "text-sm font-medium text-gray-700",
                }}
            />
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