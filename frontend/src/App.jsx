import { BrowserRouter, Routes, Route } from "react-router";
import { HomePage } from "./pages/HomePage";
import { SearchPage } from "./pages/SearchPage";
import { ViewPage } from "./pages/ViewPage";
import { PageNotFound } from "./pages/PageNotFound";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { GridLoader } from "react-spinners";
import { useAuthContext } from "./context/AppContext";
import { BasicLayout } from "./pages/BasicLayout";
import { AdminLayout } from "./pages/Admin/AdminLayout";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { AdminOrdersPage } from "./pages/Admin/AdminOrdersPage";
import { AdminFeedbacksPage } from "./pages/Admin/AdminFeedbacksPage";
import { AdminProductsPage } from "./pages/Admin/AdminProductsPage";
import { AdminContextProvider } from "./context/AdminContext";
import { PaymentPage } from "./pages/PaymentPage";
import { OrdersPage } from "./pages/OrdersPage";

const App = () => {
  const { appLoading, isLoggedIn } = useAuthContext(); 

  if (appLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <GridLoader color="#3b82f6" size={15} />
      </div>
    );
  }

  if(!isLoggedIn){
     return(
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      );
  }
  
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<BasicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/view/:productId" element={<ViewPage />} />
            <Route path="/orders" element={<OrdersPage />} />

          </Route>
            <Route path="admin" element={
              <AdminContextProvider>
                <AdminLayout />
              </AdminContextProvider>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="feedbacks" element={<AdminFeedbacksPage />} />
            </Route>
            <Route path="/payment" element={<PaymentPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;