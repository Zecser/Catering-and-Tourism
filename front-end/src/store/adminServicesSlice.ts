import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Service {
    _id: string;
    title: string;
    heading?: string;
    description?: string;
    image?: { url: string; public_id: string };
}

interface AdminServicesState {
    services: Service[];
    activeService: Service | null;
    isLoading: boolean;
    isSaving: boolean;
    isFetched: boolean;
    error: string | null;
}

const initialState: AdminServicesState = {
    services: [],
    activeService: null,
    isLoading: false,
    isSaving: false,
    isFetched: false,
    error: null,
};

const adminServicesSlice = createSlice({
    name: "adminServices",
    initialState,
    reducers: {
        resetServices: () => initialState,

        fetchServicesStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchServicesSuccess(state, action: PayloadAction<Service[]>) {
            state.services = action.payload;
            state.isLoading = false;
            state.isFetched = true;
            if (action.payload.length > 0 && !state.activeService) {
                state.activeService = action.payload[0];
            }
        },
        fetchServicesFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },

        setActiveService(state, action: PayloadAction<Service | null>) {
            state.activeService = action.payload;
        },

        createServiceStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        createServiceSuccess(state, action: PayloadAction<Service>) {
            // Add the new service to the existing array immutably
            state.services = [action.payload, ...state.services];
            state.activeService = action.payload;
            state.isSaving = false;
        },
        createServiceFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        updateServiceStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        updateServiceSuccess(state, action: PayloadAction<Service>) {
            const index = state.services.findIndex(s => s._id === action.payload._id);
            if (index !== -1) {
                // Replace the service at the found index immutably
                state.services = [
                    ...state.services.slice(0, index),
                    action.payload,
                    ...state.services.slice(index + 1),
                ];
            } else {
                // If not found, add it to the start
                state.services = [action.payload, ...state.services];
            }
            if (state.activeService?._id === action.payload._id) {
                state.activeService = action.payload;
            }
            state.isSaving = false;
        },
        updateServiceFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        deleteServiceStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        deleteServiceSuccess(state, action: PayloadAction<string>) {
            state.services = state.services.filter(s => s._id !== action.payload);
            if (state.activeService?._id === action.payload) {
                state.activeService = state.services.length > 0 ? state.services[0] : null;
            }
            state.isSaving = false;
        },
        deleteServiceFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        clearError(state) {
            state.error = null;
        },
    },
});

export const {
    resetServices,
    fetchServicesStart,
    fetchServicesSuccess,
    fetchServicesFailure,
    setActiveService,
    createServiceStart,
    createServiceSuccess,
    createServiceFailure,
    updateServiceStart,
    updateServiceSuccess,
    updateServiceFailure,
    deleteServiceStart,
    deleteServiceSuccess,
    deleteServiceFailure,
    clearError,
} = adminServicesSlice.actions;

export default adminServicesSlice.reducer;
