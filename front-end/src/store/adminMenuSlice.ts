import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface MenuCategory {
    _id: string;
    name: string;
    items: string[];
}

interface MenuState {
    categories: MenuCategory[];
    activeCategory: MenuCategory | null;
    isLoading: boolean;
    isSaving: boolean;
    isFetched: boolean;
    error: string | null;
}

const initialState: MenuState = {
    categories: [],
    activeCategory: null,
    isLoading: false,
    isSaving: false,
    isFetched: false,
    error: null,
};

const adminMenuSlice = createSlice({
    name: "adminMenu",
    initialState,
    reducers: {
        resetMenu: () => initialState,

        fetchCategoriesStart(state) {
            state.isLoading = true;
            state.error = null;
        },
        fetchCategoriesSuccess(state, action: PayloadAction<MenuCategory[]>) {
            state.categories = action.payload;
            state.isLoading = false;
            state.isFetched = true;
            // Set first category as active if none is selected
            if (action.payload.length > 0 && !state.activeCategory) {
                state.activeCategory = action.payload[0];
            }
        },
        fetchCategoriesFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isLoading = false;
        },

        setActiveCategory(state, action: PayloadAction<MenuCategory | null>) {
            state.activeCategory = action.payload;
        },

        createCategoryStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        createCategorySuccess(state, action: PayloadAction<MenuCategory>) {
            state.categories.push(action.payload);
            state.activeCategory = action.payload;
            state.isSaving = false;
        },
        createCategoryFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        updateCategoryStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        updateCategorySuccess(state, action: PayloadAction<MenuCategory>) {
            const index = state.categories.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
            // Update active category if it's the one being updated
            if (state.activeCategory?._id === action.payload._id) {
                state.activeCategory = action.payload;
            }
            state.isSaving = false;
        },
        updateCategoryFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        deleteCategoryStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        deleteCategorySuccess(state, action: PayloadAction<string>) {
            state.categories = state.categories.filter(c => c._id !== action.payload);
            // If deleted category was active, set first available as active
            if (state.activeCategory?._id === action.payload) {
                state.activeCategory = state.categories.length > 0 ? state.categories[0] : null;
            }
            state.isSaving = false;
        },
        deleteCategoryFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        addItemStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        addItemSuccess(state, action: PayloadAction<MenuCategory>) {
            const index = state.categories.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
            if (state.activeCategory?._id === action.payload._id) {
                state.activeCategory = action.payload;
            }
            state.isSaving = false;
        },
        addItemFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        updateItemStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        updateItemSuccess(state, action: PayloadAction<MenuCategory>) {
            const index = state.categories.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
            if (state.activeCategory?._id === action.payload._id) {
                state.activeCategory = action.payload;
            }
            state.isSaving = false;
        },
        updateItemFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        deleteItemStart(state) {
            state.isSaving = true;
            state.error = null;
        },
        deleteItemSuccess(state, action: PayloadAction<MenuCategory>) {
            const index = state.categories.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
            if (state.activeCategory?._id === action.payload._id) {
                state.activeCategory = action.payload;
            }
            state.isSaving = false;
        },
        deleteItemFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isSaving = false;
        },

        clearError(state) {
            state.error = null;
        },
    },
});

export const {
    resetMenu,
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    setActiveCategory,
    createCategoryStart,
    createCategorySuccess,
    createCategoryFailure,
    updateCategoryStart,
    updateCategorySuccess,
    updateCategoryFailure,
    deleteCategoryStart,
    deleteCategorySuccess,
    deleteCategoryFailure,
    addItemStart,
    addItemSuccess,
    addItemFailure,
    updateItemStart,
    updateItemSuccess,
    updateItemFailure,
    deleteItemStart,
    deleteItemSuccess,
    deleteItemFailure,
    clearError,
} = adminMenuSlice.actions;

export default adminMenuSlice.reducer;