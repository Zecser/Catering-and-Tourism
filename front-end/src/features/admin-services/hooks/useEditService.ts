import { useState, useEffect } from "react";
import api from "../../../lib/api";
import type { Service } from "../types";

export interface ServiceDetail extends Service {
  image?: { url: string; public_id: string }; 
}

export const useEditService = (id: string | null) => {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/services/${id}`);
        const data = res.data.data;

        setService({
          ...data,
          image: data.image ? { url: data.image.url, public_id: data.image.public_id } : undefined,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch service");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return { service, loading, error };
};
