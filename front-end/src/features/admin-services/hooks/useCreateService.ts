import { useState } from "react";
import type { ServiceSchema } from "../validations/serviceSchema";
import api from "../../../lib/api";

export const useCreateService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const createService = async (formData: ServiceSchema) => {
    setLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      if (formData.heading) payload.append("heading", formData.heading);
      if (formData.description) payload.append("description", formData.description);

      if (formData.image instanceof File) {
        payload.append("image", formData.image);
      }

      const response = await api.post("/services", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createService, loading, error, data };
};
