import type z from "zod";
import type { PackageZodSchema } from "./utils/validation";

export interface PlanPricingType {
    _id: string;
    title: string;
    description: string;
    price: number | string;
    features: string[];
}

export type ErrorResponse = {
    message: string;
    errors: {
        [field: string]: {
            _errors: string[];
        };
    };
};

export type PricingPlanDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    initialPlanData: PlanPricingType | boolean;
    onSave: (data: Omit<PlanPricingType, "_id">) => Promise<boolean>;
    isSaving: boolean;
};

export type FormValues = z.infer<typeof PackageZodSchema>;
