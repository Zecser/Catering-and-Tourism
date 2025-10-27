import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Banner {
  _id: string;
  type: "hero" | "catering" | "tourism";
  imageUrl: string;
  createdAt: string;
}

interface HomeState {
  banners: Banner[];
  isLoading: boolean;
  isSaving: boolean;
  isFetched: boolean;
  error: string | null;
}

const initialState: HomeState = {
  banners: [],
  isLoading: false,
  isSaving: false,
  isFetched: false,
  error: null,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    resetHome: () => initialState,

    // --- Fetch ---
    fetchBannersStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchBannersSuccess(state, action: PayloadAction<Banner[]>) {
      state.banners = action.payload;
      state.isLoading = false;
      state.isFetched = true;
    },
    fetchBannersFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    // --- Create ---
    createBannerStart(state) {
      state.isSaving = true;
      state.error = null;
    },
    createBannerSuccess(state, action: PayloadAction<Banner>) {
      state.banners.push(action.payload);
      state.isSaving = false;
    },
    createBannerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isSaving = false;
    },

    // --- Update ---
    updateBannerStart(state) {
      state.isSaving = true;
      state.error = null;
    },
    updateBannerSuccess(state, action: PayloadAction<Banner>) {
      const index = state.banners.findIndex((b) => b._id === action.payload._id);
      if (index !== -1) {
        state.banners[index] = action.payload;
      }
      state.isSaving = false;
    },
    updateBannerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isSaving = false;
    },

    // --- Delete ---
    deleteBannerSuccess(state, action: PayloadAction<string>) {
      state.banners = state.banners.filter((b) => b._id !== action.payload);
    },
    deleteBannerFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  resetHome,
  fetchBannersStart,
  fetchBannersSuccess,
  fetchBannersFailure,
  createBannerStart,
  createBannerSuccess,
  createBannerFailure,
  updateBannerStart,
  updateBannerSuccess,
  updateBannerFailure,
  deleteBannerSuccess,
  deleteBannerFailure,
} = homeSlice.actions;

export default homeSlice.reducer;
