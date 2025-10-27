import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import type { AppDispatch, RootState } from "../../../store";
import { extractErrorMessages } from "../../../utils/helpers/extractErrorMessages";

import {
    fetchCategoriesStart,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    setActiveCategory,
    clearError,
} from "../../../store/menuSlice";

export const baseURL = import.meta.env.VITE_API_URL;

export const useMenuData = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { categories, activeCategory, isLoading, isFetched, error } = useSelector(
        (state: RootState) => state.menu
    );

    const fetchCategories = async () => {
        try {
            dispatch(fetchCategoriesStart());
            const response = await axios.get(`${baseURL}/menu/`);
            dispatch(fetchCategoriesSuccess(response.data || []));
        } catch (err) {
            dispatch(fetchCategoriesFailure(extractErrorMessages(err)));
        }
    };

    useEffect(() => {
        if (!isFetched) {
            fetchCategories();
        }
    }, [dispatch, isFetched]);

    const handleSetActiveCategory = (category: any) => {
        dispatch(setActiveCategory(category));
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    return {
        // State
        categories,
        activeCategory,
        isLoading,
        isFetched,
        error,

        // Setters
        setActiveCategory: handleSetActiveCategory,

        // Handlers
        clearError: handleClearError,
    };
};
