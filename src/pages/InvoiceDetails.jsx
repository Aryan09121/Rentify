/* eslint-disable react/prop-types */
import { Bar, TxtLoader, AdminSidebar } from "../components";
import Select, { components } from "react-select";
import { FaFilter, FaIndianRupeeSign } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { CUSTOME_STYLES } from "../assets/data/constants";
import { useEffect, useState } from "react";
// import { car } from "../assets/data/car";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
// import { Loader } from "../components";
import { getSingleInvoice, payInvoice } from "../redux/actions/invoice.action";
import { toast } from "react-toastify";

const options = [
	{ value: "", label: "Filter" },
	{ value: "price", label: "Price" },
	{ value: "condition", label: "Condition" },
	{ value: "distance", label: "Distance Travelled" },
];

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaFilter />
		</components.DropdownIndicator>
	);
};

function formatDate(date, d = false) {
	// Ensure date is in the correct format
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	// Array of month names
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// Get components of the date
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	let formattedDate;
	// Format the date
	if (d === false) {
		formattedDate = `${day}, ${months[month]}, ${year}`;
	} else {
		formattedDate = day;
	}

	return formattedDate;
}

function getDatePart(date, part) {
	const d = new Date(date);
	switch (part) {
		case "day":
			return d.getDate();
		case "month":
			return d.getMonth() + 1; // Month is zero-based, so add 1
		case "year":
			return d.getFullYear();
		default:
			throw new Error('Invalid part provided. Must be "day", "month", or "year".');
	}
}

function CarDetails() {
	const { invoice, loading, message, error } = useSelector((state) => state.invoice);
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();
	// const params = useParams();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const id = searchParams.get("id");

	const onConfirm = () => {
		setIsOpen(true);
	};

	const payBill = (invoice) => {
		dispatch(payInvoice(invoice._id));
	};

	useEffect(() => {
		dispatch(getSingleInvoice(id));
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
		<div className="admin-container">
			<AdminSidebar />
			<main className="carDetails">
				<Bar />
				<h2>Invoice Details</h2>
				{/* <Filter /> */}
				{!invoice ? (
					<h5 style={{ textAlign: "center", color: "red", marginTop: "3rem", fontSize: "1.5rem" }}>
						OOPS!! What Happened ⚠️ <br />
						Invoice Details Not Found !! 😨 ‼️
					</h5>
				) : (
					<>
						<div className="invoiceHeader">
							<div>
								<h3>Invoice No: {invoice?.invoiceId}</h3>
								<h3>Pan Card No: {invoice?.owner?.pan}</h3>
							</div>
							<h3>Rent from: {formatDate(invoice?.from)}</h3>
						</div>
						<CarDetailCard invoice={invoice} />
						<button onClick={() => onConfirm(invoice)} style={{ padding: "1rem 2.2rem", marginTop: "-1.2rem" }}>
							{loading ? `Loading... ${(<TxtLoader />)}` : "Pay Bill"}
						</button>
						<Confirm open={isOpen} setIsOpen={setIsOpen} onPayBill={payBill} invoice={invoice} />
					</>
				)}
			</main>
		</div>
	);
}

const Confirm = ({ open, setIsOpen, onPayBill, invoice }) => {
	return (
		<dialog className="confirmBox" open={open}>
			<div>
				<h5>Approve the Payment?? ‼️‼️</h5>
				<div>
					<button
						onClick={() => {
							onPayBill(invoice);
							setIsOpen(false);
						}}
					>
						Yes
					</button>
					<button onClick={() => setIsOpen(false)}>No, Cancel</button>
				</div>
			</div>
		</dialog>
	);
};

export const Filter = ({ isOwnerProfile = false, onClickSearchHandler }) => {
	const [query, setQuery] = useState("");
	return (
		<form className="filter" onSubmit={(e) => onClickSearchHandler(e, query)}>
			{!isOwnerProfile && <Select defaultValue={options[0]} options={options} components={{ DropdownIndicator }} styles={CUSTOME_STYLES} />}
			<div className="filterInp" style={isOwnerProfile ? { width: "100%" } : {}}>
				<FaSearch />
				<input
					type="text"
					placeholder={isOwnerProfile ? "Search By Owner Name or Email Id " : "Search by car number..."}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>
			<button type="submit">Search</button>
		</form>
	);
};

export const CarDetailCard = ({ invoice }) => {
	return (
		<div className="carDetailCard">
			<header>
				<div>
					<h3>
						Owner Name: <span>{invoice?.owner?.name}</span>
					</h3>
					<h3 className="address">
						Address:
						<span>
							{invoice?.owner?.address?.street +
								", " +
								invoice?.owner?.address?.city +
								", " +
								invoice?.owner?.address?.state +
								", " +
								invoice?.owner?.address?.pincode +
								", India"}
						</span>
					</h3>
				</div>
				<div>
					<h3>
						Mobile Number: <span>{invoice?.owner?.contact}</span>
					</h3>
					<h3>
						Car Number: <span>{invoice?.car?.registrationNo}</span>
					</h3>
				</div>
			</header>
			<main>
				<section className="basicDetails">
					<div>
						<h3>
							Brand Name: <span>{invoice?.car?.brand}</span>
						</h3>
						<h3>
							Year: <span>{getDatePart(invoice?.invoiceDate, "year")}</span>
						</h3>
					</div>
					<div>
						<h3>
							Model: <span>{invoice?.car?.model}</span>
						</h3>
						<h3>
							Rent From: <span>{formatDate(invoice?.from)}</span>
						</h3>
					</div>
				</section>
				<section className="advDetails">
					<h4>Invoice Description</h4>
					<article>
						<div>
							<h3>
								Total Days: <span>{invoice?.dayQty} days</span>
							</h3>
							<h3>
								Total Kilometer: <span>{invoice?.kmQty} km</span>
							</h3>
							<h3>
								Period:
								<span>
									{formatDate(invoice?.from)} - {formatDate(invoice?.to)}
								</span>
							</h3>
						</div>
						<div>
							<h3>
								Rent Cost: <span>₹ {invoice?.dayRate}/day</span>
							</h3>
							<h3>
								Sub Total: <span>{invoice?.totalAmount}</span>
							</h3>
						</div>
					</article>
				</section>
				<section className="carBill">
					<h2>Total Cost:</h2>
					<h3>
						<span>with @GST</span>
						<FaIndianRupeeSign />
						{(invoice?.totalAmount * (105 / 100)).toFixed(2)}
					</h3>
				</section>
				<section className="carBill">
					<h4 style={{ fontSize: "1.2rem" }}>Status:</h4>
					<h4 style={invoice?.status === "paid" ? { fontSize: "1.2rem", color: "green" } : { fontSize: "1.2rem", color: "red" }}>
						{invoice?.status}
					</h4>
				</section>
			</main>
		</div>
	);
};

export default CarDetails;
