import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import api from "../../../lib/api";
import {
  fetchServicesStart,
  fetchServicesSuccess,
  fetchServicesFailure,
} from "../../../store/servicesSlice";

interface UseServicesProps {
  page?: number;
  limit?: number;
}

export const useServices = ({ page = 1, limit = 10 }: UseServicesProps = {}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { services, isLoading, error, totalPages,isFetched } = useSelector(
    (state: RootState) => state.services
  );

  const fetchServices = async (currentPage = page) => {
    try {
      dispatch(fetchServicesStart());
      const res = await api.get(`/services?page=${currentPage}&limit=${limit}`);
      const data = res.data;
      dispatch(
        fetchServicesSuccess({
          services: data.services || [],
          totalPages: data.totalPages || 1,
        })
      );
    } catch (err: any) {
      dispatch(
        fetchServicesFailure(
          err.response?.data?.message || err.message || "Something went wrong"
        )
      );
    }
  };

    useEffect(() => {
        if (!isFetched) {
            fetchServices();
        }
    }, [page,limit, isFetched]);

  // Derived helper
  const servicesByTitle = services.reduce<Record<string, typeof services>>(
    (acc, service) => {
      if (!acc[service.title]) acc[service.title] = [];
      acc[service.title].push(service);
      return acc;
    },
    {}
  );

  return { services, servicesByTitle, fetchServices, isLoading, error, totalPages };
};
