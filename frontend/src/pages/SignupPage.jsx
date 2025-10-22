import { useState } from "react";
import { PropagateLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";
import { Link, useNavigate } from "react-router";

const SignupPage = () => {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleSignUp = async(e) => {
        try {
            setLoading(true);
            const email = e.target.email.value;
            const otp = e.target.otp.value;
            const password = e.target.password.value;
            console.log(email, password);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
                method: "POST",
                body: JSON.stringify({ email, otp, password }),
                headers: {
                    "Content-Type": "application/json"
                },
            });

            const data = await response.json();

            if(response.status == 201){
                showSuccessToast("Signup successful!");
                navigate("/login");
            }
            else if(response.status === 409){
                showErrorToast(data.message);
                navigate("/login");
            }
            else{
                showErrorToast(data.message);
            }
        } catch(err) {
            console.log("----- Error in handleSignUp ----->", err.message);
            showErrorToast("Error during signup");
        } finally {
            setLoading(false);
        }
    }

    const handleSendOtp = async (e) => {
        try{
            setLoading(true);
            const email = e.target.email.value;
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/otp`, {
            method: "POST",
            body: JSON.stringify({ email }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        if(response.status == 201){
            setIsOtpSent(true);
            showSuccessToast("OTP sent successfully!");
        }else{
            const data = await response.json();
            showErrorToast(data.message);
        }
        
        } catch(err){
            console.log("----- Error in handleSendOtp ----->", err.message);
            showErrorToast("Error sending OTP");
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(isOtpSent){
            // Handle final signup
            handleSignUp(e);
        }else{
            // Handle sending OTP
            handleSendOtp(e);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Product Animation */}
            <div className="flex-1 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 flex items-center justify-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/10 rounded-full"></div>
                </div>

                {/* Main Animation Container */}
                <div className="relative z-10 text-center text-white px-6">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-3">Join Our Community</h2>
                        <p className="text-lg text-green-100">Start your shopping journey today</p>
                    </div>

                    {/* Join Community Image */}
                    <div className="relative">
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop&auto=format" 
                                alt="Join Community" 
                                className="w-full h-64 object-cover rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex-1 bg-white flex items-center justify-center px-6 py-6">
                <div className="w-full max-w-md">
                    {/* Header Section */}
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-base text-gray-600">
                            {isOtpSent ? "Enter the OTP and set your password" : "Join thousands of happy shoppers"}
                        </p>
                    </div>

                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Section */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                required 
                                readOnly={isOtpSent}
                                className={`w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${isOtpSent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                placeholder="Enter your email"
                            /> 
                        </div>

                        {isOtpSent && (
                            <>
                                {/* OTP Section */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Verification Code
                                    </label>
                                    <input 
                                        type="text"
                                        name="otp"
                                        required
                                        className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                                        placeholder="Enter 6-digit OTP"
                                    />
                                </div>

                                {/* Password Section */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password" 
                                            required 
                                            className="w-full px-3 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200" 
                                            placeholder="Create a strong password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <PropagateLoader color="#059669" size={12} />
                                    <p className="text-gray-600 text-sm mt-3 font-medium">
                                        {isOtpSent ? "Creating your account..." : "Sending OTP..."}
                                    </p>
                                </div>
                            ) : (
                                <button 
                                    type="submit" 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                                >
                                    {isOtpSent ? "Create Account" : "Send Verification Code"}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Login Link */}
                    <div className="mt-4 text-center">
                        <p className="text-gray-600 mb-3">Already have an account?</p>
                        <Link 
                            to="/login" 
                            className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-200"
                        >
                            Sign in to your account
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                            <div className="w-6 h-6 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Secure</p>
                        </div>
                        <div className="space-y-1">
                            <div className="w-6 h-6 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Quick</p>
                        </div>
                        <div className="space-y-1">
                            <div className="w-6 h-6 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Easy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export { SignupPage };