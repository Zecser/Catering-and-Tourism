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
    isFetched: boolean;
    error: string | null;
}

const initialState: MenuState = {
    categories: [],
    activeCategory: null,
    isLoading: false,
    isFetched: false,
    error: null,
};

const menuSlice = createSlice({
    name: "menu",
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
    clearError,
} = menuSlice.actions;

export default menuSlice.reducer;
