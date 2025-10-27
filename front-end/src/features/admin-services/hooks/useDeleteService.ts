
import { useState } from "react";
import api from "../../../lib/api";

export const useDeleteService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteService = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/services/${id}`);
      setLoading(false);
      return response.data; 
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
      throw err;
    }
  };

  return { deleteService, loading, error };
};
