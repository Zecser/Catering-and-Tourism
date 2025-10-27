import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyFormValidation } from "../utils/validation";
import { useSendPlanApplication } from "../hooks/useSendPlanApplication";
import { useEffect } from "react";

type FormData = z.infer<typeof applyFormValidation>;

export interface PlanPricingType {
  _id: string;
  title: string;
  description: string;
  price: number | string;
  features: string[];
}

interface ApplyPlanDialogProps {
  plan: PlanPricingType | undefined;
  onClose: () => void;
}

export default function ApplyPlanDialog({
  plan,
  onClose,
}: ApplyPlanDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(applyFormValidation),
  });

  const { sendApplication, isSending } = useSendPlanApplication();

  const onSubmit = async (data: FormData) => {
    if (!plan) return;
    const success = await sendApplication(data, plan);
    if (success) {
      reset();
      onClose();
    }
  };

  useEffect(() => {
    reset();
  }, [plan]);
  return (
    <Dialog open={!!plan} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg overflow-y-scroll no-scrollbar max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Apply for {plan?.title}</DialogTitle>
        </DialogHeader>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{plan?.title}</CardTitle>
            <CardDescription>{plan?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">Price: ${plan?.price}</p>
            <ul className="list-disc pl-6 text-sm mt-2">
              {plan?.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input id="whatsapp" {...register("whatsapp")} />
            {errors.whatsapp && (
              <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isSending}
          >
            {isSubmitting || isSending ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
