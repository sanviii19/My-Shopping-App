import React, { createContext, useContext, useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastifyHelper";

const AdminContext = createContext();

const AdminContextProvider = ({children}) => {
    const [adminInfoLoading, setAdminInfoLoading] = useState(true);
    const [adminUser, setAdminUser] = useState({isLoggedIn: false});
    const sharedState = {
        adminUser,
        adminInfoLoading,
    };

    const authenticateAdmin = async() => {
            try{
              setAdminInfoLoading(true);
              const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admins/me`, {
                method: "GET",
                credentials: "include"
              })
          
              if(response.status === 200){
                setAdminUser({
                  isLoggedIn: true,
                })
              }else{
                // Ensure user is set to logged out state
                setAdminUser({isLoggedIn: false});
                showErrorToast("Permission Denied");
              }
            }catch(err){
              // Ensure user is set to logged out state on error
              setAdminUser({isLoggedIn: false});
              showErrorToast("Error authenticating user. Please login again.");
            }finally{
              setAdminInfoLoading(false);
            }
          }

        useEffect(() => {
          authenticateAdmin();
        }, []);

    return (
        <AdminContext value={sharedState}>{children}</AdminContext>
    )
}

const useAdminContext = () => {
    return useContext(AdminContext);
}

export { useAdminContext, AdminContextProvider };