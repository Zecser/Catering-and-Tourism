import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useForgotPassword } from "../hooks/useForgotPassword";

const AdminForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { forgotPassword, verifyOTP } = useForgotPassword();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError("");
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setError("");
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await forgotPassword(email);
            setStep('otp');
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await verifyOTP(email, otp);
            setSuccess(true);
            // Navigate to reset password with email and OTP
            navigate(`/admin/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate("/admin/login");
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-soft-pink via-white to-soft-pink flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-dark-magenta mb-2">OTP Verified</h1>
                        <p className="text-gray-600">Redirecting to password reset...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-soft-pink via-white to-soft-pink flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-vivid-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        {step === 'email' ? (
                            <Mail className="w-8 h-8 text-vivid-pink" />
                        ) : (
                            <Lock className="w-8 h-8 text-vivid-pink" />
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-dark-magenta mb-2">
                        {step === 'email' ? 'Forgot Password' : 'Verify OTP'}
                    </h1>
                    <p className="text-gray-600">
                        {step === 'email'
                            ? 'Enter your email to receive an OTP'
                            : 'Enter the 6-digit OTP sent to your email'
                        }
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {step === 'email' ? (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email address"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-vivid-pink focus:border-transparent transition-all duration-200"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-vivid-pink hover:bg-dark-magenta text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sending OTP...
                                    </div>
                                ) : (
                                    "Send OTP"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                                    OTP Code
                                </Label>
                                <Input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-vivid-pink focus:border-transparent transition-all duration-200 text-center text-lg tracking-widest"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-vivid-pink hover:bg-dark-magenta text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Verifying OTP...
                                    </div>
                                ) : (
                                    "Verify OTP"
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="text-sm text-gray-500 hover:text-vivid-pink transition-colors duration-200"
                                >
                                    Back to Email
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleBackToLogin}
                            className="flex items-center justify-center text-sm text-gray-500 hover:text-vivid-pink transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminForgotPassword;
