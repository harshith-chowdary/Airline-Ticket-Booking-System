
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/store";

export const AuthorizeUser = ({ children }) => {
    const token = localStorage.getItem('token');

    if(!token){
        return <Navigate to={'/login'} replace={true}></Navigate>
    }

    return children;
}

export const ProtectBooking = ({ children }) => {
    const token = localStorage.getItem('booking');

    if(!token){
        return <Navigate to={'/tokenexpired'} replace={true}></Navigate>
    }

    return children;
}

export const ProtectRoute = ({ children }) => {
    const username = useAuthStore.getState().auth.username;
    if(!username){
        return <Navigate to={'/login'} replace={true}></Navigate>
    }
    return children;
}