/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import Select, { components } from "react-select";
import { FaFilter, FaIndianRupeeSign } from "react-icons/fa6";
import { FaCar, FaSearch } from "react-icons/fa";
import { CUSTOME_STYLES } from "../assets/data/constants";
import { useEffect, useState } from "react";
import { IoIosSnow } from "react-icons/io";
import { BsSpeedometer } from "react-icons/bs";
import { car } from "../assets/data/car";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleCar } from "../redux/actions";
import TxtLoader from "../components/TxtLoader";

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

function findTotalDays(date) {
	const givenDate = new Date(date);
	const today = new Date();
	const differenceMs = today - givenDate;
	const differenceDays = differenceMs / (1000 * 60 * 60 * 24);
	return Math.abs(Math.round(differenceDays));
}

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
	const { car, loading } = useSelector((state) => state.car);
	const dispatch = useDispatch();
	const params = useParams();

	useEffect(() => {
		if (car) {
			console.log(car);
		}
	}, [car]);

	useEffect(() => {
		dispatch(getSingleCar(params?.id));
	}, []);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="carDetails">
				<Bar />
				<h2>Car Details</h2>
				<Filter />
				<div className="invoiceHeader">
					<div>
						<h3>Invoice No: 051</h3>
						<h3>Pan Card No: {car?.owner?.pan}</h3>
					</div>
					<h3>Rent from: {formatDate(car?.trip[0]?.createdAt ? car?.trip[0]?.createdAt : car?.createdAt)}</h3>
				</div>
				{loading ? <TxtLoader /> : <CarDetailCard />}
			</main>
		</div>
	);
}

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

export const CarDetailCard = () => {
	const { car } = useSelector((state) => state.car);
	return (
		<div className="carDetailCard">
			<header>
				<div>
					<h3>
						Owner Name: <span>{car?.owner?.name}</span>
					</h3>
					<h3 className="address">
						Address:{" "}
						<span>
							{car?.owner?.address?.street +
								", " +
								car?.owner?.address?.city +
								", " +
								car?.owner?.address?.state +
								", " +
								car?.owner?.address?.pincode +
								", India"}
						</span>
					</h3>
				</div>
				<div>
					<h3>
						Mobile Number: <span>{car?.owner?.contact}</span>
					</h3>
					<h3>
						Car Number: <span>{car?.registrationNo}</span>
					</h3>
				</div>
			</header>
			<main>
				<section className="basicDetails">
					<div>
						<h3>
							Brand Name: <span>{car?.brand}</span>
						</h3>
						<h3>
							Year: <span>{getDatePart(car?.createdAt, "year")}</span>
						</h3>
					</div>
					<div>
						<h3>
							Model: <span>{car?.model}</span>
						</h3>
						<h3>
							Rent From: <span>{formatDate(car?.trip[0]?.createdAt ? car?.trip[0]?.createdAt : car?.createdAt)}</span>
						</h3>
					</div>
				</section>
				<section className="advDetails">
					<h4>Rent Description</h4>
					<article>
						<div>
							<h3>
								Total Days: <span>{findTotalDays(car?.createdAt)} days</span>
							</h3>
							<h3>
								Total Kilometer: <span>{car?.totalkm}km</span>
							</h3>
							<h3>
								Period From: <span>{car?.rentdescription?.period}</span>
							</h3>
						</div>
						<div>
							<h3>
								Rent Cost: <span>{car?.rentdescription?.cost}₹/days</span>
							</h3>
							<h3>
								Sub Total: <span>{car?.rentdescription?.total}</span>
							</h3>
						</div>
					</article>
				</section>
				<section className="carBill">
					<h2>Total Cost:</h2>
					<h3>
						<span>with @GST</span>
						<FaIndianRupeeSign />
						{car?.rentdescription?.total + (car?.rentdescription?.total * 18) / 100}
					</h3>
				</section>
			</main>
		</div>
	);
};

export const Tag = ({ Icon, heading, content }) => {
	return (
		<article className="tag">
			<div>
				<Icon />
			</div>
			<h3>{heading}</h3>
			<p>{content}</p>
		</article>
	);
};

export default CarDetails;
