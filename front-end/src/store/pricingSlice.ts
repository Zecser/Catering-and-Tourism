import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PlanPricingType } from "../features/plan-and-pricing/type";

interface PlanPackageState {
  pricing: PlanPricingType[];
  isLoading: boolean;
  isSaving: boolean;
  isFetched: boolean;
  error: string | null;
}

const initialState: PlanPackageState = {
  pricing: [],
  isLoading: false,
  isSaving: false,
  isFetched: false,
  error: null,
};

const planPackageSlice = createSlice({
  name: "planPackage",
  initialState,
  reducers: {
    resetPlanPackage: () => initialState,

    fetchPlansStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchPlansSuccess(state, action: PayloadAction<PlanPricingType[]>) {
      state.pricing = action.payload;
      state.isLoading = false;
      state.isFetched = true;
    },
    fetchPlansFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    createPlanStart(state) {
      state.isSaving = true;
      state.error = null;
    },
    createPlanSuccess(state, action: PayloadAction<PlanPricingType>) {
      state.pricing.push(action.payload);
      state.isSaving = false;
    },
    createPlanFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isSaving = false;
    },

    updatePlanStart(state) {
      state.isSaving = true;
      state.error = null;
    },
    updatePlanSuccess(state, action: PayloadAction<PlanPricingType>) {
      const index = state.pricing.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.pricing[index] = action.payload;
      }
      state.isSaving = false;
    },
    updatePlanFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isSaving = false;
    },

    deletePlanSuccess(state, action: PayloadAction<string>) {
      state.pricing = state.pricing.filter(plan => plan._id !== action.payload);
    },
    deletePlanFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  resetPlanPackage,
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFailure,
  createPlanStart,
  createPlanSuccess,
  createPlanFailure,
  updatePlanStart,
  updatePlanSuccess,
  updatePlanFailure,
  deletePlanSuccess,
  deletePlanFailure,
} = planPackageSlice.actions;

export default planPackageSlice.reducer;
