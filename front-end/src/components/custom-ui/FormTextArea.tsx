import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { type FieldError } from "react-hook-form";

interface FormTextareaProps {
  label: string;
  id: string;
  register: ReturnType<any>;
  error?: FieldError;
  placeholder?: string;
}

export const FormTextarea = ({
  label,
  id,
  register,
  error,
  placeholder,
}: FormTextareaProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        {...register}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
