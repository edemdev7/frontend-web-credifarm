interface RadioInputProps {
  name: string;
  value: string;
  reactForm: object;
}

const RadioInput = ({ name, value, reactForm }: RadioInputProps) => {
  return (
    <div className="flex items-center mb-4">
      <input {...reactForm} id={value} type="radio" name={name} />
      <label
        htmlFor={value}
        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        {value}
      </label>
    </div>
  );
};

export default RadioInput;
