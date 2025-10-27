import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAdmin, setAccessToken, setError, setLoading, type AdminType } from "../store/adminAuthSlice";
import { useLocation } from "react-router-dom";
import type { RootState } from "../store";
import api from "../lib/api";
import { getLocalStorage } from "../utils/helpers/localStorage";

export const baseURL = import.meta.env.VITE_API_URL || "";

export const useAdmin = () => {
    const dispatch = useDispatch();
    const { admin, loading, checked } = useSelector((state: RootState) => state.admin);
    const { pathname } = useLocation()

    useEffect(() => {
        const checkAuth = async () => {
            dispatch(setLoading(true));
            try {
                const accessToken = getLocalStorage("accessToken");
                if (accessToken) {
                    dispatch(setAccessToken(accessToken));
                }

                const res = await api.get("/auth/me");

                const data: AdminType = res.data;

                if (data) {
                    dispatch(setAdmin(data));
                }
                else {
                    throw Error("Unauthorised")
                }

            } catch (err: any) {
                dispatch(setAdmin(null));
                dispatch(setError(err.response?.data?.message || "Not authenticated"));
            } finally {
                dispatch(setLoading(false));
            }
        };

        if (!checked && pathname.includes("admin")) {
            checkAuth()
        }
    }, []);

    return { admin, loading, checked };
};