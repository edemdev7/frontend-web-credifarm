import React, { useState, useEffect } from 'react';
import { ICrop, INewCrop } from "../../../../components/types/crop";
import { useForm } from "react-hook-form";
import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";

export interface CropFormProps {
  initialData?: ICrop;
  onSubmit: (crop: INewCrop) => void;
  submitText: string;
}

export const CropForm: React.FC<CropFormProps> = ({ initialData, onSubmit, submitText }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<INewCrop>({
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      category: initialData.category,
      // File can't be pre-filled, but we'll show the image preview
    } : undefined
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData?.image || null
  );
  const [isDragging, setIsDragging] = useState(false);

  // Watch the image field to update preview
  const imageField = watch("image");

  // Update preview when file is selected
  useEffect(() => {
    if (imageField && imageField[0]) {
      const file = imageField[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  }, [imageField]);

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      if (["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        // Create a FileList-like object
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        const fileList = dataTransfer.files;
        
        setValue("image", fileList);
        
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setValue("image", undefined);
    setPreviewImage(null);
  };

  // Modified submit handler that creates FormData
  const submitFormWithData = async (data: INewCrop) => {
    // Convert image to base64 if it exists
    console.log("Image data ---------------: ", data.image);
    let base64Image = null;
    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    }

    // Create the crop object with base64 image
    const crop: INewCrop = {
      name: data.name,
      description: data.description,
      category: data.category,
      image: base64Image, // This will be the base64 string
    };

    console.log("Entry data: ", crop);

    // Call the parent component's onSubmit with the crop object
    onSubmit(crop);
  };

  return (
    <form
      onSubmit={handleSubmit(submitFormWithData)}
      className="flex items-center flex-col gap-4 w-full max-w-[400px]"
    >
      {/* Name Input */}
      <Input
        {...register("name", {
          required: "Le nom de la culture est requis",
          minLength: {
            value: 2,
            message: "Le nom de la culture doit contenir au moins 2 caractères",
          },
        })}
        isInvalid={!!errors.name}
        errorMessage={errors.name?.message}
        type="text"
        label="Nom de la culture"
        radius="sm"
        placeholder="Entrez le nom de la culture..."
        classNames={{
          base: "w-full",
          input: "text-sm",
          label: "text-sm font-medium text-gray-700",
        }}
      />

      {/* Description Input */}
      <Input
        {...register("description", {
          required: "La description est requise",
          minLength: {
            value: 3,
            message: "La description doit contenir au moins 3 caractères",
          },
        })}
        isInvalid={!!errors.description}
        errorMessage={errors.description?.message}
        type="text"
        label="Description"
        radius="sm"
        placeholder="Entrez la description..."
        classNames={{
          base: "w-full",
          input: "text-sm",
          label: "text-sm font-medium text-gray-700",
        }}
      />

      {/* Category Input */}
      <Input
        {...register("category", {
          required: "La catégorie est requise",
        })}
        isInvalid={!!errors.category}
        errorMessage={errors.category?.message}
        type="text"
        label="Catégorie"
        radius="sm"
        placeholder="Entrez la catégorie..."
        classNames={{
          base: "w-full",
          input: "text-sm",
          label: "text-sm font-medium text-gray-700",
        }}
      />

      {/* Improved Image Upload */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        
        <div 
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
            isDragging 
              ? "border-green-400 bg-green-50" 
              : errors.image 
                ? "border-red-300 bg-red-50" 
                : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            {...register("image", {
              required: !initialData?.image && "L'image est requise",
              validate: {
                acceptedFormats: (files) =>
                  !files || !files[0] || 
                  ["image/jpeg", "image/png", "image/gif"].includes(files[0].type) || 
                  "Seuls les fichiers JPEG, PNG et GIF sont acceptés",
                fileSize: (files) =>
                  !files || !files[0] ||
                  files[0].size <= 5 * 1024 * 1024 ||
                  "La taille du fichier ne doit pas dépasser 5 Mo",
              },
            })}
            id="image-upload"
            type="file"
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
          />
          
          {previewImage ? (
            <div className="relative">
              <img 
                src={previewImage} 
                alt="Aperçu de l'image" 
                className="mx-auto h-40 object-contain mb-2" 
              />
              <Button
                type="button"
                size="sm"
                color="danger"
                className="absolute top-0 right-0 m-1"
                onClick={handleRemoveImage}
              >
                ✕
              </Button>
              <p className="text-sm text-gray-600">
                Cliquez ou glissez-déposez pour changer l'image
              </p>
            </div>
          ) : (
            <div onClick={() => document.getElementById('image-upload')?.click()}>
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Cliquez pour sélectionner ou glissez-déposez une image ici
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF jusqu'à 5 MB
              </p>
            </div>
          )}
        </div>
        
        {errors.image && (
          <p className="mt-1 text-xs text-red-500">
            {errors.image.message}
          </p>
        )}
      </div>

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