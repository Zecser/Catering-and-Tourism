import { useState, useEffect } from "react";
import api from "../../../lib/api"; 

export interface ServiceDetail {
  _id: string;
  title: string;
  heading: string;
  description: string;
  image?: {
    url: string;
    public_id: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const useServiceDetail = (id: string) => {
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const { data } = await api.get<ServiceDetail>(`/services/${id}`);
        console.log("detailed:",data);
        
        setService(data);
      } catch (err: any) {
        console.error("Error fetching service detail:", err);
        setError(err?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  return { service, loading, error };
};
