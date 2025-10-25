import { useState, useContext } from "react";
import { Navbar } from "../components/Navbar";
import { PropagateLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/AppContext";


const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { authenticateUser } = useAuthContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const email = e.target.email.value;
            const password = e.target.password.value;
            console.log(email, password);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"  // Include cookies in the request
            });

            const data = await response.json();

            if(response.status == 200){
                showSuccessToast("Login Successful!");
                // Fetch complete user data including role after successful login
                await authenticateUser(true);
                navigate("/");
            }
            else{
                console.log(response.status);
                showErrorToast(data.message);
            }
        } catch(err) {
            console.log("----- Error in handleLogin ----->", err.message);
            showErrorToast("Error during login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Product Animation */}
            <div className="flex-1 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700 flex items-center justify-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-24 h-24 bg-white/10 rounded-full"></div>
                    <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full"></div>
                </div>

                {/* Main Animation Container */}
                <div className="relative z-10 text-center text-white px-6">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold mb-3">Discover Amazing Products</h2>
                        <p className="text-lg text-blue-100">Shop the latest trends with confidence</p>
                    </div>

                    {/* Shopping Image */}
                    <div className="relative">
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                            <img 
                                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&auto=format" 
                                alt="Shopping" 
                                className="w-full h-64 object-cover rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 bg-white flex items-center justify-center px-6 py-8">
                <div className="w-full max-w-md">
                    {/* Header Section */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-base text-gray-600">Sign in to your account to continue shopping</p>
                    </div>

                    {/* Login Form */}
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
                                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                                placeholder="Enter your email"
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
                                    className="w-full px-3 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                                    placeholder="Enter your password"
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

                        {/* Submit Button */}
                        <div className="pt-2">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-4">
                                    <PropagateLoader color="#3b82f6" size={12} />
                                    <p className="text-gray-600 text-sm mt-3 font-medium">
                                        Signing you in...
                                    </p>
                                </div>
                            ) : (
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 mb-3">Don't have an account?</p>
                        <Link 
                            to="/signup" 
                            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors duration-200"
                        >
                            Create your account
                        </Link>
                    </div>

                    {/* Features */}
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                            <div className="w-6 h-6 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Secure</p>
                        </div>
                        <div className="space-y-1">
                            <div className="w-6 h-6 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Fast</p>
                        </div>
                        <div className="space-y-1">
                            <div className="w-6 h-6 bg-purple-100 rounded-full mx-auto flex items-center justify-center">
                                <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                            </div>
                            <p className="text-xs text-gray-600 font-medium">Reliable</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export { LoginPage };