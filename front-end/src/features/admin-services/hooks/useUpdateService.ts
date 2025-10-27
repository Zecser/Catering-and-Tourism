import { useState } from "react";
import api from "../../../lib/api";
import type { ServiceSchema } from "../validations/serviceSchema";

export const useUpdateService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const updateService = async (id: string, formData: ServiceSchema) => {
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

      const response = await api.put(`/services/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(response.data);
      return response.data;
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update service");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateService, loading, error, data };
};
