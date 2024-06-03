/* eslint-disable no-undef */
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
import { loadUser } from "./redux/actions";

// ** pages lazy import()
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const InvoiceDetails = lazy(() => import("./pages/InvoiceDetails"));
const Charges = lazy(() => import("./pages/Charges"));
const OwnerProfile = lazy(() => import("./pages/OwnerProfile"));
const OwnerDetails = lazy(() => import("./components/OwnerDetails"));
const UpdateOwner = lazy(() => import("./components/UpdateOwner"));
const Billings = lazy(() => import("./components/Billings"));
const Invoice = lazy(() => import("./pages/Invoice"));
const Settings = lazy(() => import("./pages/Settings"));
const BillDetails = lazy(() => import("./components/BillDetails"));
const AddNew = lazy(() => import("./pages/AddNew"));
const AddNewOwner = lazy(() => import("./pages/AddNewOwner"));
const AddNewComapny = lazy(() => import("./pages/AddNewCompany"));
const Search = lazy(() => import("./pages/Search"));
const AssignTrip = lazy(() => import("./components/AssignTrip"));
const Vendors = lazy(() => import("./pages/Vendors"));
const OwnerPdf = lazy(() => import("./components/OwnerPdf"));
const DataUpload = lazy(() => import("./pages/DataUpload"));
const InvoicesUploads = lazy(() => import("./pages/InvoicesUploads"));
const AddCars = lazy(() => import("./components/AddCars"));
const Error = lazy(() => import("./pages/Error"));

const App = () => {
	const dispatch = useDispatch();
	const { message, error } = useSelector((state) => state.car);
	const { message: tripMessage, error: tripError } = useSelector((state) => state.trip);

	useEffect(() => {
		const token = Cookies.get("token");
		if (token) {
			dispatch(loadUser());
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

	useEffect(() => {
		if (tripMessage) {
			toast.success(tripMessage);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
		if (tripError) {
			toast.error(tripError);
			dispatch({ type: "CLEAR_ERRORS" });
		}
	}, [tripMessage, tripError]);

	return (
		<Suspense fallback={<Loader />}>
			<Routes>
				<Route path="/" element={<Signup />} />
				<Route path="/ownerbill" element={<OwnerPdf />} />
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/invoices" element={<Invoice />} />
					<Route path="/charges/details" element={<InvoiceDetails />} />
					<Route path="/bill" element={<BillPdf />} />
					<Route path="/charges" element={<Charges />} />
					<Route path="/vendors" element={<Vendors />} />
					<Route path="/profile/owner" element={<OwnerProfile />} />
					<Route path="/profile/owner/edit/:id" element={<UpdateOwner />} />
					<Route path="/profile/owner/add/car/:id" element={<AddCars />} />
					<Route path="/profile/owner/:id" element={<OwnerDetails />} />
					<Route path="/settings" element={<Settings />} />
					<Route path="/search" element={<Search />} />
					<Route path="/billings" element={<Billings />} />
					<Route path="/billings/data" element={<BillDetails />} />
					<Route path="/add/new" element={<AddNew />} />
					<Route path="/add/new/owner" element={<AddNewOwner />} />
					<Route path="/add/new/company" element={<AddNewComapny />} />
					<Route path="/add/trip" element={<AssignTrip />} />
					<Route path="/data/upload" element={<DataUpload />} />
					<Route path="/hiring/uploads" element={<InvoicesUploads />} />
				</Route>
				<Route path="*" element={<Error />} />
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
