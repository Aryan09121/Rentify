/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";
import { AiFillFileText, AiTwotoneCar } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";
import { RiDashboardFill } from "react-icons/ri";
import { IoPersonAdd } from "react-icons/io5";
import { BsFileText } from "react-icons/bs";
import { AiTwotoneShop } from "react-icons/ai";
// eslint-disable-next-line no-unused-vars
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions";
import { toast } from "react-toastify";

const AdminSidebar = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const [showModal, setShowModal] = useState(false);
	const [phoneActive, setPhoneActive] = useState(window.innerWidth < 1000);
	const { message, error } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const { user } = useSelector((state) => state.user);

	const resizeHandler = () => {
		setPhoneActive(window.innerWidth < 1000);
	};

	const logoutHandler = () => {
		dispatch(logoutUser());
		navigate("/");
	};

	useEffect(() => {
		window.addEventListener("resize", resizeHandler);

		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	useEffect(() => {
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
	}, [message, error, dispatch]);

	return (
		<>
			{phoneActive && (
				<button id="hamburger" onClick={() => setShowModal(true)}>
					<HiMenuAlt4 />
				</button>
			)}

			<aside
				style={
					phoneActive
						? {
								width: "20rem",
								height: "100vh",
								position: "fixed",
								top: 0,
								left: showModal ? "0" : "-20rem",
								transition: "all 0.5s",
						  }
						: {}
				}
			>
				{/* <h2>Logo.</h2> */}
				<img src={logo} alt="user image" />
				<h5>Admin</h5>
				<DivOne location={location} />

				<button id="logout-sidebar" onClick={logoutHandler}>
					Logout
				</button>

				{phoneActive && (
					<button id="close-sidebar" onClick={() => setShowModal(false)}>
						Close
					</button>
				)}
			</aside>
		</>
	);
};

const DivOne = ({ location }) => (
	<div>
		<ul>
			<Li url="/dashboard" text="Dashboard" Icon={RiDashboardFill} location={location} />
			<Li url="/invoices" text="Invoices" Icon={BsFileText} location={location} />
			{/* <Li url="/charges" text="Charges" Icon={AiTwotoneCar} location={location} /> */}
			<Li url="/vendors" text="Vendors" Icon={AiTwotoneShop} location={location} />
			<Li url="/profile/owner" text="Profile" Icon={AiFillFileText} location={location} />
			<Li url="/billings" text="Billings" Icon={AiFillFileText} location={location} />
			<Li url="/add/new" text="Add New" Icon={IoPersonAdd} location={location} />
			{/* <Li url="/settings" text="Settings" Icon={AiFillFileText} location={location} /> */}
		</ul>
	</div>
);
const Li = ({ url, location, text, Icon }) => (
	<li
		style={{
			backgroundColor: location.pathname.includes(url) ? "white" : "transparent",
		}}
	>
		<Link
			to={url}
			style={{
				fontWeight: location.pathname.includes(url) ? "bold" : "400",
			}}
		>
			<Icon
				style={{
					color: location.pathname.includes(url) ? "black" : "white",
				}}
			/>
			{text}
		</Link>
	</li>
);

export default AdminSidebar;
