import { Link, Outlet, useLocation } from "react-router";
import { useAdminContext } from "../../context/AdminContext";
import { GridLoader } from "react-spinners";

const ROUTES_CONFIG = [
    {
        title: "Dashboard",
        route: "/admin/dashboard"
    },
    {
        title: "Orders",
        route: "/admin/orders"
    },
    {
        title: "Products",
        route: "/admin/products"
    },
    {
        title: "Feedbacks",
        route: "/admin/feedbacks"
    }
]

const AdminLayout = () => {

    const location = useLocation();
    const {adminInfoLoading, adminUser} = useAdminContext();

    if(adminInfoLoading){
        return(
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <GridLoader color="#3b82f6" size={15} />
            </div>
        )
    }

    if(adminUser?.isLoggedIn){
        return(
        <div className="min-h-screen bg-gray-50"> 
            <div className="grid grid-cols-[280px_1fr] h-full">
                {/* Sidebar */}
                <div className="bg-white shadow-sm border-r border-gray-200">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>
                        <nav className="flex flex-col gap-3">
                            {
                                ROUTES_CONFIG.map((elem, index) => {
                                    const isCurrentRoute = location.pathname === elem.route;
                                    return (
                                    <Link 
                                        key={index} 
                                        to={elem.route} 
                                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                            isCurrentRoute 
                                                ? 'bg-blue-600 text-white shadow-md' 
                                                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                    >
                                        {elem.title}
                                    </Link>
                                    )
                                })
                            }
                        </nav>
                    </div>
                </div>
                {/* Main Content */}
                <div className="overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
        )
    } else{
        return(
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-lg font-semibold">Not Allowed</p>
                <p className="text-gray-600">You don't have the necessary permissions to access this page.</p>
            </div>
        )
    }
}

export { AdminLayout };