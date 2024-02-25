import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
import userImg from "../assets/userImage.png";
import { BsTelephoneFill } from "react-icons/bs";
import { FaUser, FaCar, FaFacebook, FaSort } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { BiLogoGmail } from "react-icons/bi";
import { useState } from "react";

import Select, { components } from "react-select";

import { VehicleData, vehicleHeaders, vehicleSortOptions } from "../assets/data/owner";
import { RowDefault, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";

//  ?-- dropdown select

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

// ?--- custom select styles

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: "0.3rem 0.6rem",
		cursor: "pointer",
		backgroundColor: "#fcfcfc",
		"&:hover, &:focus": {
			backgroundColor: "#fcfcfc",
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
		color: "#111",
		"&:hover, &:focus": {
			color: "#111",
		},
	}),
};

function OwnerDetails() {
	const [sortedData, setSortedData] = useState(VehicleData);

	const handleSortChange = (selectedOption) => {
		let sortedDataCopy = [...VehicleData];
		if (selectedOption.value === "kilometers") {
			sortedDataCopy.sort((a, b) => {
				const kilometersA = parseInt(a.data[2].replace(/ km/g, ""));
				const kilometersB = parseInt(b.data[2].replace(/ km/g, ""));
				return kilometersA - kilometersB;
			});
		} else if (selectedOption.value === "amount") {
			sortedDataCopy.sort((a, b) => a.data[5] - b.data[5]);
		} else if (selectedOption.value === "days") {
			sortedDataCopy.sort((a, b) => parseInt(a.data[4].replace(" days", "")) - parseInt(b.data[4].replace(" days", "")));
		} else if (selectedOption.value === "rate") {
			sortedDataCopy.sort((a, b) => {
				const rateA = parseFloat(a.data[3].replace("/day", ""));
				const rateB = parseFloat(b.data[3].replace("/day", ""));
				return rateA - rateB;
			});
		}
		setSortedData(sortedDataCopy);
	};

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerDetails">
				<Bar />
				<h2>Owner Details</h2>
				<section className="ownerProfileContainer">
					<section className="profileDetails">
						<header></header>
						<div>
							<article className="basicProfile">
								<img src={userImg} alt="user iamge" />
								<section className="details">
									<div>
										<FaUser />
										<h3>Ramesh Gupta</h3>
									</div>
									<div>
										<BsTelephoneFill />
										<h3>+98 7452190256</h3>
									</div>
									<div>
										<BiLogoGmail />
										<h3>demouser.car@gmail.com</h3>
									</div>
								</section>
							</article>
							<section className="carDetails">
								<div>
									<FaCar />
									<h3>3 Cars</h3>
								</div>
								<div>
									<MdLocationPin />
									<h3>3, Ultra Apartment, Hari Shankar Joshi Road, Dahisagar</h3>
								</div>
							</section>
							<section className="socials">
								<div className="sociallinks">
									<FaFacebook />
									<FaSquareXTwitter />
									<AiFillInstagram />
								</div>
								<button>Edit Info</button>
							</section>
						</div>
					</section>
					<section className="registrationDetails">
						<header></header>
						<div className="body">
							<div className="detialRow">
								<h4 className="heading">GST Number:</h4>
								<h4 className="value">BVHDE1425D</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">HSN No:</h4>
								<h4 className="value">BVHDE1425D</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Pan Card No:</h4>
								<h4 className="value">BVHDE1425D</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Total Km:</h4>
								<h4 className="value">2873km</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Joined Date:</h4>
								<h4 className="value">08/02/2024</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Amount Paid:</h4>
								<h4 className="value">24,000.000</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Pending Amount:</h4>
								<h4 className="value">36,000.00</h4>
							</div>
						</div>
					</section>
				</section>
				<TableContainer className="vehicleTableContainer">
					<TableHeading>
						<p>All Bills</p>
						<Select
							defaultValue={vehicleSortOptions[0]}
							options={vehicleSortOptions}
							components={{ DropdownIndicator }}
							onChange={handleSortChange}
							styles={customStyles}
						/>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${vehicleHeaders.length + 1},1fr)` }} headers={vehicleHeaders} />
						<TableBody TableRow={RowDefault} data={sortedData} />
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default OwnerDetails;
