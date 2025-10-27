import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { RootState } from "../../../store";
import api from "../../../lib/api";
import { useCallback, useEffect } from "react";
import type { HeroBanner, HomeBanner } from "../../../store/adminHomeSlice";

import {
  setHeroBanners,
  setHomeBanners,
  setHeroLoading,
  setHomeLoading,
  setError,
  addHeroBanner,
  addHomeBanner,
  updateHeroBanner,
  updateHomeBanner,
  deleteHeroBanner,
  deleteHomeBanner,
} from "../../../store/adminHomeSlice";

export const useAdminHome = () => {
  const dispatch = useDispatch();

  // ✅ Select the entire slice at once (shallowEqual prevents re-renders if objects didn’t change)
  const {
    heroBanners,
    homeBanners,
    heroLoading,
    homeLoading,
    error,
    isFetched
  } = useSelector(
    (state: RootState) => state.adminHome,
    shallowEqual
  );

  // ------------------- FETCH -------------------
  const fetchHeroBanners = useCallback(async () => {
    dispatch(setHeroLoading(true));
    try {
      const res = await api.get<{ success: boolean; banners: HeroBanner[] }>(
        "/home?type=hero"
      );
      if (res.data.success) {
        dispatch(setHeroBanners(res.data.banners));
      } else {
        dispatch(setError("Failed to fetch hero banners"));
      }
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || err.message));
    } finally {
      dispatch(setHeroLoading(false));
    }
  }, [dispatch]);

  const fetchHomeBanners = useCallback(async () => {
    dispatch(setHomeLoading(true));
    try {
      const res = await api.get<{ success: boolean; banners: HomeBanner[] }>(
        "/home"
      );
      if (res.data.success) {
        const filtered = res.data.banners.filter(
          (b) => b.type === "catering" || b.type === "tourism"
        );
        dispatch(setHomeBanners(filtered));
      } else {
        dispatch(setError("Failed to fetch home banners"));
      }
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || err.message));
    } finally {
      dispatch(setHomeLoading(false));
    }
  }, [dispatch]);

    useEffect(() => {
    if (!isFetched) {
      fetchHeroBanners();
      fetchHomeBanners();
    }
  }, [isFetched]);


  // ------------------- UPLOAD -------------------
  const uploadHeroBanner = useCallback(
    async (file: File) => {
      dispatch(setHeroLoading(true));
      try {
        const formData = new FormData();
        formData.append("image", file);
        const res = await api.post<{ message: string; banner: HeroBanner }>(
          "/home/hero",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.data.banner) {
          dispatch(addHeroBanner(res.data.banner));
        } else {
          await fetchHeroBanners();
        }
        return res.data;
      } catch (err: any) {
        dispatch(setError(err.response?.data?.error || "Upload failed"));
        throw err;
      } finally {
        dispatch(setHeroLoading(false));
      }
    },
    [dispatch, fetchHeroBanners]
  );

  const uploadHomeBanner = useCallback(
    async (file: File, type: "catering" | "tourism") => {
      dispatch(setHomeLoading(true));
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type);
        const res = await api.post<{ message: string; banner: HomeBanner }>(
          "/home/banner",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.data.banner) {
          dispatch(addHomeBanner(res.data.banner));
        } else {
          await fetchHomeBanners();
        }
        return res.data;
      } catch (err: any) {
        dispatch(setError(err.response?.data?.error || "Upload failed"));
        throw err;
      } finally {
        dispatch(setHomeLoading(false));
      }
    },
    [dispatch, fetchHomeBanners]
  );

  // ------------------- EDIT -------------------
  const editHeroBanner = useCallback(
    async (id: string, file: File | null) => {
      dispatch(setHeroLoading(true));
      try {
        const formData = new FormData();
        if (file) formData.append("image", file);
        const res = await api.put<{ message: string; banner: HeroBanner }>(
          `/home/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.data.banner) {
          dispatch(updateHeroBanner(res.data.banner));
        } else {
          await fetchHeroBanners();
        }
        return res.data;
      } catch (err: any) {
        dispatch(setError(err.response?.data?.error || "Update failed"));
        throw err;
      } finally {
        dispatch(setHeroLoading(false));
      }
    },
    [dispatch, fetchHeroBanners]
  );

  const editHomeBanner = useCallback(
    async (id: string, file: File, type: "catering" | "tourism") => {
      dispatch(setHomeLoading(true));
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", type);
        const res = await api.put<{ message: string; banner: HomeBanner }>(
          `/home/${id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (res.data.banner) {
          dispatch(updateHomeBanner(res.data.banner));
        } else {
          await fetchHomeBanners();
        }
        return res.data;
      } catch (err: any) {
        dispatch(setError(err.response?.data?.error || "Update failed"));
        throw err;
      } finally {
        dispatch(setHomeLoading(false));
      }
    },
    [dispatch, fetchHomeBanners]
  );

  // ------------------- DELETE -------------------
  const deleteHeroBannerById = useCallback(
    async (id: string) => {
      dispatch(setHeroLoading(true));
      try {
        await api.delete(`/home/${id}`);
        dispatch(deleteHeroBanner(id));
      } catch (err: any) {
        dispatch(setError(err.response?.data?.error || "Delete failed"));
      } finally {
        dispatch(setHeroLoading(false));
      }
    },
    [dispatch]
  );

  const deleteHomeBannerById = useCallback(
    async (id: string) => {
      dispatch(setHomeLoading(true));
      try {
        await api.delete(`/home/${id}`);
        dispatch(deleteHomeBanner(id));
      } catch (err: any) {
        dispatch(setError(err.response?.data?.error || "Delete failed"));
      } finally {
        dispatch(setHomeLoading(false));
      }
    },
    [dispatch]
  );

  return {
    heroBanners,
    homeBanners,
    heroLoading,
    homeLoading,
    error,
    isFetched,
    fetchHeroBanners,
    fetchHomeBanners,
    uploadHeroBanner,
    uploadHomeBanner,
    editHeroBanner,
    editHomeBanner,
    deleteHeroBannerById,
    deleteHomeBannerById,
  };
};
