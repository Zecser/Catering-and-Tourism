import { useState } from "react";
import api from "../../../lib/api";

export const useForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const forgotPassword = async (email: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/forgot-password", { email });
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to send OTP. Please try again.";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (email: string, otp: string) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/verify-otp", { email, otp });
            return response.data;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Invalid or expired OTP. Please try again.";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        forgotPassword,
        verifyOTP,
        loading,
        error
    };
};
