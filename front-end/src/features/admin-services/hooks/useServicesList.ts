import { useEffect, useState } from "react";
import type { Service } from "../types";
import api from "../../../lib/api";

interface UseServicesListProps {
  limit: number;
}

export const useServicesList = ({ limit }: UseServicesListProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async (currentPage = page) => {
    try {
      setLoading(true);
      const res = await api.get(`/services?page=${currentPage}&limit=${limit}`);
      setServices(res.data.services);
      setTotalPages(res.data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, limit]);

  return { services, page, totalPages, loading, error, goToPage: setPage, fetchServices };
};
