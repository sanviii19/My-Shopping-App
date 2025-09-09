import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { PropagateLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";

const SignupPage = () => {
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignUp = async(e) => {
        try {
            setLoading(true);
            const email = e.target.email.value;
            const otp = e.target.otp.value;
            const password = e.target[1].value;
            console.log(email, password);

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
                method: "POST",
                body: JSON.stringify({ email, otp, password }),
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if(response.status == 201){
                showSuccessToast("Signup successful!");
            }else{
                const data = await response.json();
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
        <div>
            <Navbar searchBar={false} />
            <div className="pt-24">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 border border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
                    {/* Email Section */}
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" required className="w-full border border-gray-300 p-2 mt-1 mb-4 rounded" readOnly={isOtpSent}/> 
                    </div>
                    {
                        isOtpSent && (
                            <>
                                {/* OTP Section */}
                                <div>
                                    <label>OTP</label>
                                    <input type="string"
                                        name="otp"
                                        required
                                        className="w-full border border-gray-300 p-2 mt-1 mb-4 rounded"
                                    />
                                </div>
                                {/* Password Section */}
                                <div>
                                    <label>Password</label>
                                    <input type="password" name="password" required className="w-full border border-gray-300 p-2 mt-1 mb-4 rounded" /> 
                                </div>
                            </>
                        )
                    }
                    {
                        loading ? (
                            <div className="flex flex-col items-center justify-center py-5">
                                <PropagateLoader color="#3b82f6" size={12} />
                                <p className="text-gray-600 text-sm mt-4 font-medium">
                                    {isOtpSent ? "Creating your account..." : "Sending OTP..."}
                                </p>
                            </div>
                        ) : (
                            <>
                                {
                                    isOtpSent ? (
                                        <>
                                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md font-medium transition-colors duration-200">
                                                Sign Up
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md font-medium transition-colors duration-200">
                                                Send OTP
                                            </button>
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                </form>
            </div>
        </div>
    )
};

export { SignupPage };