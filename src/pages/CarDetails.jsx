/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import Select, { components } from "react-select";
import { FaFilter, FaIndianRupeeSign } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { GrStorage } from "react-icons/gr";

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

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: "0.3rem 0.6rem",
		cursor: "pointer",
		backgroundColor: "#029e9d",
		"&:hover, &:focus": {
			backgroundColor: "#029e9d",
			padding: "0.3rem 0.6rem",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.3rem 0.6rem",
		marginRight: "1rem",
		borderRadius: "5px",
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#fcfcfc",
		"&:hover, &:focus": {
			color: "#fcfcfc",
		},
	}),
};

function CarDetails() {
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
						<h3>Pan Card No: DYD35532</h3>
					</div>
					<h3>Rent from: 14/02/2024</h3>
				</div>
				<CarDetailCard />
			</main>
		</div>
	);
}

export const Filter = ({ isOwnerProfile = false }) => {
	return (
		<form className="filter">
			{!isOwnerProfile && <Select defaultValue={options[0]} options={options} components={{ DropdownIndicator }} styles={customStyles} />}
			<div className="filterInp">
				<FaSearch />
				<input type="text" placeholder="Search by car number..." />
			</div>
			<button type="submit">Search</button>
		</form>
	);
};

export const CarDetailCard = () => {
	return (
		<div className="carDetailCard">
			<header>
				<div>
					<h3>
						Owner Name: <span>Himesh Sharma</span>
					</h3>
					<h3 className="address">
						Address: <span>3 Ultra Apartment, Hari Shankar Joshi Road, Dahisagar</span>
					</h3>
				</div>
				<div>
					<h3>
						Mobile Number: <span>9893456274</span>
					</h3>
					<h3>
						Car Number: <span>WB 06 F 5977</span>
					</h3>
				</div>
			</header>
			<main>
				<section className="basicDetails">
					<div>
						<h3>
							Brand Name: <span>Maruti Suzuki</span>
						</h3>
						<h3>
							Year: <span>2023</span>
						</h3>
					</div>
					<div>
						<h3>
							Model: <span>BVXYZOR</span>
						</h3>
						<h3>
							Rent From: <span>17/08/2025</span>
						</h3>
					</div>
				</section>
				<section className="tagContainer">
					<Tag Icon={GrStorage} heading="Capacity" content="4 Seats" />
					<Tag Icon={GrStorage} heading="Type" content="Non AC" />
					<Tag Icon={GrStorage} heading="Capacity" content="4 Seats" />
				</section>
				<section className="advDetails">
					<h4>Rent Description</h4>
					<article>
						<div>
							<h3>
								Total Days: <span>231 days</span>
							</h3>
							<h3>
								Total Kilometer: <span>345933km</span>
							</h3>
							<h3>
								Period From: <span>Jan 21,2023 - Sep 16,2023</span>
							</h3>
						</div>
						<div>
							<h3>
								Rent Cost: <span>766.00rs/days</span>
							</h3>
							<h3>
								Sub Total: <span>34,243.00</span>
							</h3>
						</div>
					</article>
				</section>
				<section className="carBill">
					<h2>Total Cost:</h2>
					<h3>
						<span>with @GST</span>
						<FaIndianRupeeSign />
						1,22,000.00
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
