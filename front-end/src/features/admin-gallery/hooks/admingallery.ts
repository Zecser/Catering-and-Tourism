import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "../../../store";
import api from "../../../lib/api"; 
import { extractErrorMessages } from "../../../utils/helpers/extractErrorMessages";

import {
  fetchGalleryStart,
  fetchGallerySuccess,
  fetchGalleryFailure,
  createImageStart,
  createImageSuccess,
  createImageFailure,
  updateImageStart,
  updateImageSuccess,
  updateImageFailure,
  deleteImageSuccess,
  setPage,
  setImagesPerPage,
} from "../../../store/gallerySlice";

export const useGallery = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    images,
    isLoading,
    isSaving,
    isFetched,
    error,
    currentPage,
    imagesPerPage,
    totalPages,
  } = useSelector((state: RootState) => state.gallery);

  const fetchImages = async () => {
    try {
      dispatch(fetchGalleryStart());
      const res = await api.get("/gallery", {
        params: { page: currentPage, limit: imagesPerPage },
      });

      if (res.data && Array.isArray(res.data.images)) {
        dispatch(
          fetchGallerySuccess({
            images: res.data.images,
            totalPages: res.data.totalPages || 1,
          })
        );
      } else {
        dispatch(fetchGalleryFailure("Unexpected API response"));
      }
    } catch (err) {
      dispatch(fetchGalleryFailure(extractErrorMessages(err)));
    }
  };

  useEffect(() => {
    if (!isFetched) {
      fetchImages();
    }
  }, [isFetched, currentPage, imagesPerPage]);

  const createImage = async (formData: FormData) => {
    try {
      dispatch(createImageStart());
      const res = await api.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(createImageSuccess(res.data));
      toast.success("Image uploaded successfully");
      return true;
    } catch (err) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      dispatch(createImageFailure(msg));
      return false;
    }
  };

  const updateImage = async (id: string, formData: FormData) => {
    try {
      dispatch(updateImageStart());
      const res = await api.put(`/gallery/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(updateImageSuccess(res.data));
      toast.success("Image updated successfully");
      return true;
    } catch (err) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
      dispatch(updateImageFailure(msg));
      return false;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await api.delete(`/gallery/${id}`);
      dispatch(deleteImageSuccess(id));
      toast.success("Image deleted");
    } catch (err) {
      const msg = extractErrorMessages(err);
      toast.error(msg);
    }
  };

  return {
    images,
    isLoading,
    isSaving,
    error,
    totalPages,
    currentPage,
    imagesPerPage,
    fetchImages,
    createImage,
    updateImage,
    deleteImage,
    setPage: (page: number) => dispatch(setPage(page)),
    setImagesPerPage: (limit: number) => dispatch(setImagesPerPage(limit)),
  };
};
