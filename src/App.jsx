/* eslint-disable react-hooks/exhaustive-deps */
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy } from "react";
import Loader from "./components/Loader";
import { Bounce, ToastContainer, toast } from "react-toastify";
import BillPdf from "./components/BillPdf";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { loadUser } from "./actions/user.action";
import { getOwners } from "./actions/owner.action";
import { getAllCars } from "./actions/car.action";

// ** pages lazy import()
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CarDetails = lazy(() => import("./pages/CarDetails"));
const SearchCars = lazy(() => import("./pages/SearchCars"));
const OwnerProfile = lazy(() => import("./pages/OwnerProfile"));
const OwnerDetails = lazy(() => import("./components/OwnerDetails"));
const UpdateOwner = lazy(() => import("./components/UpdateOwner"));
const Billings = lazy(() => import("./components/Billings"));
const Invoice = lazy(() => import("./pages/Invoice"));
const Settings = lazy(() => import("./pages/Settings"));
const BillDetails = lazy(() => import("./components/BillDetails"));
const AddNew = lazy(() => import("./pages/AddNew"));
const AddNewOwner = lazy(() => import("./pages/AddNewOwner"));
const Search = lazy(() => import("./pages/Search"));
const AssignTrip = lazy(() => import("./components/AssignTrip"));

const App = () => {
	const dispatch = useDispatch();
	const { message, error } = useSelector((state) => state.car);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			dispatch(loadUser());
			dispatch(getOwners());
			dispatch(getAllCars());
		}
	}, []);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
	}, [message, error]);

	return (
		<Suspense fallback={<Loader />}>
			<Routes>
				<Route path="/" element={<Signup />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/invoice" element={<Invoice />} />
					<Route path="/cars/:id" element={<CarDetails />} />
					<Route path="/bill/:id" element={<BillPdf />} />
					<Route path="/cars" element={<SearchCars />} />
					<Route path="/profile/owner" element={<OwnerProfile />} />
					<Route path="/profile/owner/edit/:id" element={<UpdateOwner />} />
					<Route path="/profile/owner/:id" element={<OwnerDetails />} />
					<Route path="/billings" element={<Billings />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/search" element={<Search />} />
					<Route path="/billings/:id" element={<BillDetails />} />
					<Route path="/add/new" element={<AddNew />} />
					<Route path="/add/new/owner" element={<AddNewOwner />} />
					<Route path="/add/new/driver" element={<h1>Add New Driver</h1>} />
					<Route path="/add/new/staff" element={<h1>Add new Staff</h1>} />
					<Route path="/add/trip" element={<AssignTrip />} />
				</Route>
				<Route path="*" element={<h2>Page Not Found</h2>} />
			</Routes>
			<ToastContainer
				position="bottom-center"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				transition={Bounce}
			/>
		</Suspense>
	);
};

export default App;
