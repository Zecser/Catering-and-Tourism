import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Service {
  _id: string;
  title: string;
  heading?: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ServiceState {
  services: Service[];
  isLoading: boolean;
  isSaving: boolean;
  isFetched: boolean;
  error: string | null;
  totalPages: number;
}

const initialState: ServiceState = {
  services: [],
  isLoading: false,
  isSaving: false,
  isFetched: false,
  error: null,
  totalPages: 1,
};

const serviceSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    resetServices: () => initialState,

    // FETCH
    fetchServicesStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    fetchServicesSuccess(
      state,
      action: PayloadAction<{ services: Service[]; totalPages: number }>
    ) {
      state.services = action.payload.services;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
      state.isFetched = true;
    },
    fetchServicesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoading = false;
    },

    // CREATE
    createServiceStart(state) {
      state.isSaving = true;
      state.error = null;
    },
    createServiceSuccess(state, action: PayloadAction<Service>) {
      state.services.push(action.payload);
      state.isSaving = false;
    },
    createServiceFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isSaving = false;
    },

    // UPDATE
    updateServiceStart(state) {
      state.isSaving = true;
      state.error = null;
    },
    updateServiceSuccess(state, action: PayloadAction<Service>) {
      const index = state.services.findIndex(s => s._id === action.payload._id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
      state.isSaving = false;
    },
    updateServiceFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isSaving = false;
    },

    // DELETE
    deleteServiceSuccess(state, action: PayloadAction<string>) {
      state.services = state.services.filter(s => s._id !== action.payload);
    },
    deleteServiceFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
});

export const {
  resetServices,
  fetchServicesStart,
  fetchServicesSuccess,
  fetchServicesFailure,
  createServiceStart,
  createServiceSuccess,
  createServiceFailure,
  updateServiceStart,
  updateServiceSuccess,
  updateServiceFailure,
  deleteServiceSuccess,
  deleteServiceFailure,
} = serviceSlice.actions;

export default serviceSlice.reducer;
