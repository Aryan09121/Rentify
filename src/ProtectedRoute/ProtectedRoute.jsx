/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { loadUser } from "../redux/actions";
import Cookies from "js-cookie";
// import { toast } from "react-toastify";

const ProtectedRoute = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuthenticated } = useSelector((state) => state.user);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			dispatch(loadUser());
		}
	}, []);

	useEffect(() => {
		if (!isAuthenticated) {
			// toast.error("You are not Authenticated to visit this Page");
			navigate("/");
		}
	}, [isAuthenticated]);

	return <Outlet />;
};

export default ProtectedRoute;
