import {
  Dialog,
  DialogContent,
  DialogClose,
} from "../../../components/ui/dialog";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useEffect, useState } from "react";
import type {
  FormValues,
  PlanPricingType,
  PricingPlanDialogProps,
} from "../type";
import { PackageZodSchema } from "../utils/validation";
import { FormInput } from "../../../components/custom-ui/FormInputs";
import { FormTextarea } from "../../../components/custom-ui/FormTextArea";
import { Button } from "../../../components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

const defaultValues = {
  description: "",
  features: [],
  price: 0,
  title: "",
};

const PricingPlanDialog: FC<PricingPlanDialogProps> = ({
  isOpen,
  onClose,
  initialPlanData,
  onSave,
  isSaving,
}) => {
  initialPlanData = (
    typeof initialPlanData === "boolean" ? defaultValues : initialPlanData
  ) as PlanPricingType;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(PackageZodSchema),
    defaultValues: initialPlanData,
  });

  const { append, remove } = useFieldArray({
    control,
    name: "features" as never,
  });

  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    if (isOpen) {
      reset(initialPlanData);
    }
  }, [isOpen, initialPlanData, reset]);

  const handleAddFeature = () => {
    const trimmed = newFeature.trim();
    if (trimmed) {
      append(trimmed);
      setNewFeature("");
    }
  };

  const onSubmit = async (data: FormValues) => {
    const res = await onSave({
      title: data.title,
      price: Number(data.price),
      description: data.description,
      features: data.features,
    });

    if (res) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-scroll no-scrollbar">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Plan Name"
            id="title"
            register={register("title")}
            error={errors.title}
            placeholder="e.g. Premium Plan"
          />

          <FormInput
            label="Plan Price"
            id="price"
            type="text"
            register={register("price")}
            error={errors.price}
            placeholder="e.g. 99"
          />

          <FormTextarea
            label="Description"
            id="description"
            register={register("description")}
            error={errors.description}
            placeholder="Describe the features..."
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Features
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 border border-gray-300 px-3 py-2 rounded"
                placeholder="Add a new feature"
              />
              <Button type="button" onClick={handleAddFeature}>
                +
              </Button>
            </div>

            <ul className="space-y-2 mt-2">
              {getValues("features").map((field, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border p-2 rounded"
                >
                  <span>{field}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewFeature(field);
                        remove(index);
                      }}
                      className="text-blue-600 text-sm"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 text-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {errors.features && (
              <p className="text-sm text-red-500">
                {errors.features.message as string}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="px-4 py-2 rounded bg-gray-200 text-gray-800"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isSaving}
              type="submit"
              className="px-4 py-2 rounded text-white"
            >
              {isSaving ? "Saving" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PricingPlanDialog;
