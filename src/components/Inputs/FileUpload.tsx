import React from 'react';

interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  onChange?: (files: FileList | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  required = false,
  onChange
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.files);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        type="file"
        name={name}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100"
        required={required}
      />
    </div>
  );
};