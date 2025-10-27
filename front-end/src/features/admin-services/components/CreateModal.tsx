import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema } from "../validations/serviceSchema";
import type { ServiceSchema } from "../validations/serviceSchema";
import Banner from "./Banner";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  createService: (formData: ServiceSchema) => Promise<any>;
}

const CreateModal: React.FC<Props> = ({ isOpen, onClose, createService }) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
  });

  useEffect(() => {
    if (isOpen) {
      reset({ title: "", heading: "", description: "", image: null });
    }
  }, [isOpen, reset]);

  const onSubmit = async (formData: ServiceSchema) => {
    setLoading(true);
    try {
      await createService(formData);
      reset();
      onClose();
    } catch (err: any) {
      console.error("Create failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Create Service</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Title</label>
            <select {...register("title")} className="w-full border px-3 py-2 rounded-lg">
              <option value="">Select Service</option>
              <option value="Catering">Catering</option>
              <option value="Tourism">Tourism</option>
            </select>
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              {...register("heading")}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter heading"
            />
            {errors.heading && <p className="text-red-500 text-sm">{errors.heading.message}</p>}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Service Banner</label>
            <Banner onFileSelect={(file) => setValue("image", file)} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Service"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModal;
