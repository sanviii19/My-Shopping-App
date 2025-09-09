import { Navbar } from "../components/Navbar";

const LoginPage = () => {
    return (
        <div>
            <Navbar searchBar={false} />
            <div className="pt-24 flex flex-col items-center justify-center">
                <p className="text-center p-4 text-2xl">Login Page</p>
                <a className="text-blue-500 hover:underline" href="/signup">Don't have an account? Sign up</a>
            </div>
        </div>
    )
};

export { LoginPage };