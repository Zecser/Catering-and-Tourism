import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { type FieldError } from "react-hook-form";
import { cn } from "../../lib/utils";

interface FormInputProps {
  label: string;
  error?: FieldError;
  id: string;
  type?: string;
  placeholder?: string;
  register: ReturnType<any>;
}

export const FormInput = ({
  label,
  id,
  register,
  error,
  type = "text",
  placeholder,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
        className={cn(error && "border-red-500")}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
