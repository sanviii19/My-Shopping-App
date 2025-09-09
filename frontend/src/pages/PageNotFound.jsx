import { Link } from "react-router";
import { Navbar } from "../components/Navbar";

const PageNotFound = () => {
    return (
        <div>
            <Navbar />
            <div className="pt-24 flex items-center justify-center flex-col">
                <p className="text-center p-4 text-2xl">Oops... Page Not Found</p>
                <Link to="/" className="text-blue-600 text-sm">Go Back to Home</Link>
            </div>
        </div>
    )
};

export { PageNotFound };