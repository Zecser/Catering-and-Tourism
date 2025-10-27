import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import type { AppDispatch, RootState } from "../../../store";
import type { MenuCategory } from "../../../store/adminMenuSlice";
import api from "../../../lib/api";
import { extractErrorMessages } from "../../../utils/helpers/extractErrorMessages";

import {
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
} from "../../../store/adminMenuSlice";

export const useMenuManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { pathname } = useLocation();
    const isAdmin = pathname.includes("/admin");

    const { categories, activeCategory, isLoading, isSaving, isFetched, error } = useSelector(
        (state: RootState) => state.adminMenu
    );

    const fetchCategories = useCallback(async () => {
        try {
            dispatch(fetchCategoriesStart());
            const res = await api.get("/menu/");
            dispatch(fetchCategoriesSuccess(res.data || []));
        } catch (err) {
            dispatch(fetchCategoriesFailure(extractErrorMessages(err)));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isFetched) {
            fetchCategories();
        }
    }, [dispatch, isFetched, fetchCategories]);

    const createCategory = async (name: string) => {
        try {
            dispatch(createCategoryStart());
            const res = await api.post("/menu/category", { name: name.trim() });
            dispatch(createCategorySuccess(res.data));
            return true;
        } catch (err) {
            const msg = extractErrorMessages(err);
            toast.error(msg);
            dispatch(createCategoryFailure(msg));
            return false;
        }
    };

    const updateCategory = async (categoryId: string, name: string) => {
        try {
            dispatch(updateCategoryStart());
            const res = await api.put(`/menu/category/${categoryId}`, { name: name.trim() });
            dispatch(updateCategorySuccess(res.data));
            return true;
        } catch (err) {
            const msg = extractErrorMessages(err);
            toast.error(msg);
            dispatch(updateCategoryFailure(msg));
            return false;
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            dispatch(deleteCategoryStart());
            await api.delete(`/menu/category/${categoryId}`);
            dispatch(deleteCategorySuccess(categoryId));
            return true;
        } catch (err) {
            const msg = extractErrorMessages(err);
            toast.error(msg);
            dispatch(deleteCategoryFailure(msg));
            return false;
        }
    };

    const addItem = async (categoryId: string, item: string) => {
        try {
            dispatch(addItemStart());
            const res = await api.post(`/menu/item/${categoryId}`, { item: item.trim() });
            dispatch(addItemSuccess(res.data));
            return true;
        } catch (err) {
            const msg = extractErrorMessages(err);
            toast.error(msg);
            dispatch(addItemFailure(msg));
            return false;
        }
    };

    const updateItem = async (categoryId: string, index: number, value: string) => {
        try {
            dispatch(updateItemStart());
            const res = await api.put(`/menu/item/${categoryId}/${index}`, { value: value.trim() });
            dispatch(updateItemSuccess(res.data));
            return true;
        } catch (err) {
            const msg = extractErrorMessages(err);
            toast.error(msg);
            dispatch(updateItemFailure(msg));
            return false;
        }
    };

    const deleteItem = async (categoryId: string, index: number) => {
        try {
            dispatch(deleteItemStart());
            await api.delete(`/menu/item/${categoryId}/${index}`);
            // Fetch the updated category data to ensure UI is updated
            const updatedRes = await api.get(`/menu/category/${categoryId}`);
            dispatch(deleteItemSuccess(updatedRes.data));
            return true;
        } catch (err) {
            const msg = extractErrorMessages(err);
            toast.error(msg);
            dispatch(deleteItemFailure(msg));
            return false;
        }
    };

    const handleSetActiveCategory = (category: MenuCategory | null) => {
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
        isSaving,
        error,
        isAdmin,

        // Actions
        createCategory,
        updateCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
        setActiveCategory: handleSetActiveCategory,
        clearError: handleClearError,
        fetchCategories,
    };
};
