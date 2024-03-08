import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
import userImg from "../assets/userImage.png";
import { BsTelephoneFill } from "react-icons/bs";
import { FaUser, FaCar, FaFacebook, FaSort } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdLocationPin } from "react-icons/md";
import { BiLogoGmail } from "react-icons/bi";
import { useEffect, useState } from "react";

import Select, { components } from "react-select";
import { CUSTOME_STYLES } from "../assets/data/constants";

import { vehicleHeaders, vehicleSortOptions, owner } from "../assets/data/owner";
import { CarRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { Link, useNavigate } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";
import UpdateOwner from "./UpdateOwner";

//  ?-- dropdown select

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

function OwnerDetails() {
	const [cardata, setCarData] = useState([]);
	const [ownerdata] = useState(owner);
	const navigate = useNavigate();
	// const [sortedData, setSortedData] = useState(cardata);

	const handleSortChange = (selectedOption) => {
		let sortedDataCopy = [...cardata];
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
		setCarData(sortedDataCopy);
	};

	const remindOwner = () => {
		window.open("https://wa.me/+917415721902?text=Your Payment is Due worth 99000");
	};

	useEffect(() => {
		const carsdata = ownerdata.cars.map((car, index) => {
			return {
				data: [index + 1, car.brand, car.distance, car.rate, car.days, car.amount],
				_id: car._id,
			};
		});
		console.log(carsdata);
		setCarData(carsdata);
	}, [ownerdata]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerDetails">
				<Bar />
				<div>
					<h2>Owner Details</h2>
					<button onClick={remindOwner}>
						Remind For Payment <IoIosWarning />
					</button>
				</div>
				<section className="ownerProfileContainer">
					<section className="profileDetails">
						<header></header>
						<div>
							<article className="basicProfile">
								<img src={userImg} alt="user iamge" />
								<section className="details">
									<div>
										<FaUser />
										<h3>{ownerdata.name}</h3>
									</div>
									<div>
										<BsTelephoneFill />
										<h3>+91 {ownerdata.phone}</h3>
									</div>
									<div>
										<BiLogoGmail />
										<h3>{ownerdata.email}</h3>
									</div>
								</section>
							</article>
							<section className="carDetails">
								<div>
									<FaCar />
									<h3>{ownerdata.cars.length} Cars</h3>
								</div>
								<div>
									<MdLocationPin />
									<h3>{ownerdata.address}</h3>
								</div>
							</section>
							<section className="socials">
								<div className="sociallinks">
									<Link to={ownerdata.facebook}>
										<FaFacebook />
									</Link>
									<Link to={ownerdata.twitter}>
										<FaSquareXTwitter />
									</Link>
									<Link to={ownerdata.instagram}>
										<AiFillInstagram />
									</Link>
								</div>
								<button onClick={() => navigate(`/profile/owner/edit/${ownerdata._id}`)}>Edit Info</button>
							</section>
						</div>
					</section>
					<section className="registrationDetails">
						<header></header>
						<div className="body">
							<div className="detialRow">
								<h4 className="heading">GST Number:</h4>
								<h4 className="value">{ownerdata.gstin}</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">HSN No:</h4>
								<h4 className="value">{ownerdata.hsn}</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Pan Card No:</h4>
								<h4 className="value">{ownerdata.pan}</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Total Km:</h4>
								<h4 className="value">{ownerdata.totalKm}</h4>
							</div>
							<div className="detialRow">
								<h4 className="heading">Joined Date:</h4>
								<h4 className="value">{ownerdata.joining}</h4>
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
							styles={CUSTOME_STYLES}
						/>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${vehicleHeaders.length},1fr)` }} headers={vehicleHeaders} />
						<TableBody TableRow={CarRow} data={cardata} />
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default OwnerDetails;
