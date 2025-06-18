import type { JSX } from "react";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
        toast.dismiss();
        toast.error("Session expired. Please login again.");
        return <Navigate to="/login" />;
    }
    return children;
}

export default PrivateRoute;