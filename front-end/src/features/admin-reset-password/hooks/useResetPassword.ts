import { useState } from "react";
import api from "../../../lib/api";

export const useResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetPassword = async (email: string, otp: string, newPassword: string, confirmPassword: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/reset-password", {
                email,
                otp,
                newPassword,
                confirmPassword
            });
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again.";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        resetPassword,
        loading,
        error
    };
};