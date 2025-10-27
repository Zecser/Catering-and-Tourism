import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Image } from "../features/admin-gallery/type";

interface GalleryState {
  images: Image[];
  isLoading: boolean;
  isSaving: boolean;
  isFetched: boolean;
  error: string | null;
  currentPage: number;
  imagesPerPage: number;
  totalPages: number;
}

const initialState: GalleryState = {
  images: [],
  isLoading: false,
  isSaving: false,
  isFetched: false,
  error: null,
  currentPage: 1,
  imagesPerPage: 5,
  totalPages: 1,
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    fetchGalleryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGallerySuccess: (
      state,
      action: PayloadAction<{ images: Image[]; totalPages: number }>
    ) => {
      state.images = action.payload.images;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
      state.isFetched = true;
    },
    fetchGalleryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    createImageStart: (state) => {
      state.isSaving = true;
    },
    createImageSuccess: (state, action: PayloadAction<Image>) => {
      state.images.unshift(action.payload);
      state.isSaving = false;
    },
    createImageFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },

    updateImageStart: (state) => {
      state.isSaving = true;
    },
    updateImageSuccess: (state, action: PayloadAction<Image>) => {
      const idx = state.images.findIndex((img) => img._id === action.payload._id);
      if (idx !== -1) state.images[idx] = action.payload;
      state.isSaving = false;
    },
    updateImageFailure: (state, action: PayloadAction<string>) => {
      state.isSaving = false;
      state.error = action.payload;
    },

    deleteImageSuccess: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img._id !== action.payload);
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
      state.isFetched = false; // force refetch
    },
    setImagesPerPage: (state, action: PayloadAction<number>) => {
      state.imagesPerPage = action.payload;
      state.isFetched = false; // force refetch
    },
  },
});

export const {
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
} = gallerySlice.actions;

export default gallerySlice.reducer;
