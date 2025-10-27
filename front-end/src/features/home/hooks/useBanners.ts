
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store";
import api from "../../../lib/api";
import {
  fetchBannersStart,
  fetchBannersSuccess,
  fetchBannersFailure,
} from "../../../store/homeSlice";
import { useCallback, useEffect } from "react";

export function useBanners() {
  const dispatch = useDispatch<AppDispatch>();
  const { banners, isLoading, error, isFetched } = useSelector(
    (state: RootState) => state.home
  );

  const fetchBanners = useCallback(async () => {
    try {
      dispatch(fetchBannersStart());
      const res = await api.get("/home");
      if (res.data.success) {
        dispatch(fetchBannersSuccess(res.data.banners));
      } else {
        dispatch(fetchBannersFailure("Failed to fetch banners"));
      }
    } catch (err: any) {
      dispatch(
        fetchBannersFailure(
          err.response?.data?.error || err.message || "Something went wrong"
        )
      );
    }
  }, [dispatch]);

  //  Fetch once when Home mounts (only if not already fetched)
  useEffect(() => {
    if (!isFetched) {
      fetchBanners();
    }
  }, [isFetched, fetchBanners]);

  const heroBanner = banners.find((b) => b.type === "hero");
  const cateringBanner = banners.find((b) => b.type === "catering");
  const tourismBanner = banners.find((b) => b.type === "tourism");

  return {
    banners,
    heroBanner,
    cateringBanner,
    tourismBanner,
    loading: isLoading,
    error,
    refetch: fetchBanners,
  };
}
