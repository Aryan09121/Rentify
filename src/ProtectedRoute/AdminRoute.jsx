/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
	const { user } = useSelector((state) => state.user);
	if (user?.role !== "admin") {
		// toast.error("You are not allowed to visit this page");
		return <Navigate to="/" />;
	}
	return <Outlet />;
};

export default AdminRoute;
