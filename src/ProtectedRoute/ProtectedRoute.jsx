/* eslint-disable react/prop-types */
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated }) => {
	if (!isAuthenticated) {
		return <Navigate to="/" />;
	}
	return <Outlet />;
};

export default ProtectedRoute;
