import { forwardRef, useState } from "react";

interface InputFileProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ label, onChange, name, ...props }, ref) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        setFileName(event.target.files[0].name);
        if (onChange) {
          onChange(event);
        }
      }
    };

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragOver(true);
    };
    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setDragOver(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        setFileName(event.dataTransfer.files[0].name);
      }
    };

    return (
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor={name || label}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${
            dragOver === true || fileName
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300 bg-gray-50"
          } transition duration-300 flex flex-col items-center justify-center w-full border-2  border-dashed rounded-lg cursor-pointer `}
        >
          <div className="text-xs flex flex-col items-center justify-center pt-5 pb-6">
            <i className="fa-cloud-arrow-up fa-solid text-lg"></i>
            <p className="text-gray-500 font-semibold">{label}</p>
            <div className="text-gray-500 ${filename ? text-blue-50} ">
              {fileName ? (
                fileName
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <span>Cliquez ou glissez déposer.</span>
                  <span className="text-xs text-center text-gray-400">
                    (JPG, JPEG, ou PNG)
                  </span>
                </div>
              )}
            </div>
          </div>
          <input
            ref={ref}
            id={name || label}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            name={name}
            {...props}
          />
        </label>
      </div>
    );
  }
);

InputFile.displayName = "InputFile";

export default InputFile;
