import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  source?: string;
};

interface ReviewState {
  items: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  items: [],
  isLoading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.items = action.payload;
    },
    addReview: (state, action: PayloadAction<Review>) => {
      state.items.push(action.payload);
    },
    removeReview: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((r) => r._id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearReviews: (state) => {
      state.items = [];
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setReviews,
  addReview,
  removeReview,
  setLoading,
  setError,
  clearReviews,
} = reviewSlice.actions;

export const selectReviews = (state: RootState) => state.reviews.items;
export const selectReviewLoading = (state: RootState) => state.reviews.isLoading;
export const selectReviewError = (state: RootState) => state.reviews.error;

export default reviewSlice.reducer;
