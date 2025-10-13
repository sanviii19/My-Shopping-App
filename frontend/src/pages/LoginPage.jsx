import { useState, useContext } from "react";
import { Navbar } from "../components/Navbar";
import { PropagateLoader } from "react-spinners";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";
import { Link, useNavigate } from "react-router";
import { useAuthContext } from "../context/AppContext";


const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { handleSetUser } = useAuthContext();

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
                handleSetUser({
                    isLoggedIn: true,
                });
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
        <div>
            <Navbar searchBar={false} />
            <div className="pt-24">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 border border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Log In</h2>
                    {/* Email Section */}
                    <div>
                        <label>Email</label>
                        <input type="email" name="email" required className="w-full border border-gray-300 p-2 mt-1 mb-4 rounded" /> 
                    </div>
                    {/* Password Section */}
                    <div>
                        <label>Password</label>
                        <input type="password" name="password" required className="w-full border border-gray-300 p-2 mt-1 mb-4 rounded" /> 
                    </div>
                    {
                        loading ? (
                            <div className="flex flex-col items-center justify-center py-5">
                                <PropagateLoader color="#3b82f6" size={12} />
                                <p className="text-gray-600 text-sm mt-4 font-medium">
                                    Logging in...
                                </p>
                            </div>
                        ) : (
                            <>
                                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md font-medium transition-colors duration-200">
                                    Login
                                </button>
                            </>
                        )
                    }
                    <div>
                        <Link to="/signup" className="text-blue-500 hover:underline flex justify-center mt-4">Don't have an account? Sign up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
};

export { LoginPage };