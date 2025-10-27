import { useState } from "react";
import api from "../../../lib/api";
import toast from "react-hot-toast";
import { extractErrorMessages } from "../../../utils/helpers/extractErrorMessages";
import { type PlanPricingType } from "../type";
import { type z } from "zod";
import { applyFormValidation } from "../utils/validation";

type FormData = z.infer<typeof applyFormValidation>;

export const useSendPlanApplication = () => {
  const [isSending, setIsSending] = useState(false);

  const sendApplication = async (data: FormData, plan: PlanPricingType) => {
    try {
      setIsSending(true);

      const payload = {
        ...data,
        planId: plan._id,
        planTitle: plan.title,
        planPrice: plan.price,
      };

      await api.post("/package/send-plan-application", payload);

      toast.success("Application sent successfully!");
      return true;
    } catch (err) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendApplication,
    isSending,
  };
};
