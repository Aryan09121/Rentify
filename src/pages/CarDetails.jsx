/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import Select, { components } from "react-select";
import { FaFilter, FaIndianRupeeSign } from "react-icons/fa6";
import { FaCar, FaSearch } from "react-icons/fa";
import { CUSTOME_STYLES } from "../assets/data/constants";
import { useState } from "react";
import { IoIosSnow } from "react-icons/io";
import { BsSpeedometer } from "react-icons/bs";
import { car } from "../assets/data/car";

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
	return (
		<div className="carDetailCard">
			<header>
				<div>
					<h3>
						Owner Name: <span>{car.owner.name}</span>
					</h3>
					<h3 className="address">
						Address: <span>{car.owner.address}</span>
					</h3>
				</div>
				<div>
					<h3>
						Mobile Number: <span>{car.owner.phone}</span>
					</h3>
					<h3>
						Car Number: <span>{car.carnumber}</span>
					</h3>
				</div>
			</header>
			<main>
				<section className="basicDetails">
					<div>
						<h3>
							Brand Name: <span>{car.brand}</span>
						</h3>
						<h3>
							Year: <span>{car.year}</span>
						</h3>
					</div>
					<div>
						<h3>
							Model: <span>{car.model}</span>
						</h3>
						<h3>
							Rent From: <span>{car.onboardon}</span>
						</h3>
					</div>
				</section>
				<section className="tagContainer">
					<Tag Icon={FaCar} heading="Capacity" content={`${car.features.capacity}`} />
					<Tag Icon={IoIosSnow} heading="Type" content={`${car.features.type}`} />
					<Tag Icon={BsSpeedometer} heading="Max Speed" content={`${car.features.maxspeed}`} />
				</section>
				<section className="advDetails">
					<h4>Rent Description</h4>
					<article>
						<div>
							<h3>
								Total Days: <span>{car.rentdescription.days} days</span>
							</h3>
							<h3>
								Total Kilometer: <span>{car.rentdescription.distance}km</span>
							</h3>
							<h3>
								Period From: <span>{car.rentdescription.period}</span>
							</h3>
						</div>
						<div>
							<h3>
								Rent Cost: <span>{car.rentdescription.cost}₹/days</span>
							</h3>
							<h3>
								Sub Total: <span>{car.rentdescription.total}</span>
							</h3>
						</div>
					</article>
				</section>
				<section className="carBill">
					<h2>Total Cost:</h2>
					<h3>
						<span>with @GST</span>
						<FaIndianRupeeSign />
						{car.rentdescription.total + (car.rentdescription.total * 18) / 100}
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
