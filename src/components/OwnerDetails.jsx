/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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

import { vehicleHeaders, vehicleSortOptions } from "../assets/data/owner";
import { CarRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosWarning } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getOwnerById } from "../redux/actions";
import { getGst } from "../redux/actions/setting.action";
import TxtLoader from "./TxtLoader";
// import UpdateOwner from "./UpdateOwner";

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

function findTotalDays(inv, car) {
	const totalDay = inv?.reduce((acc, i) => {
		if (i.car === car._id) {
			return acc + i.dayQty;
		} else {
			return acc;
		}
	}, 0);
	const offroad = inv?.reduce((acc, i) => {
		if (i.car === car._id) {
			return acc + i.offroad;
		} else {
			return acc;
		}
	}, 0);
	return [totalDay, offroad] || 0;
}
const fixed = (n) => {
	return parseFloat(Number(n).toFixed(2));
};

function OwnerDetails() {
	const [cardata, setCarData] = useState([]);
	// const [ownerdata] = useState(owner);
	const [ownerdata, setOwnerdata] = useState({});
	const [amountPending, setamountPending] = useState();
	const [amountPaid, setAmountPaid] = useState();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();
	const { owner, loading } = useSelector((state) => state.owner);
	const { gst } = useSelector((state) => state.settings);
	const [sortedData, setSortedData] = useState([]);
	const [totalDays, setTotalDays] = useState();
	const [unit, setUnit] = useState("date");
	const [carHeaders, setCarHeaders] = useState([]);

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

	useEffect(() => {
		if (ownerdata) {
			// console.log(ownerdata.invoices);
			const carsdata = ownerdata?.cars?.map((car, index) => {
				// console.log(ownerdata.invoices);
				const totalDays = findTotalDays(ownerdata.invoices, car)[0];
				const offroadDays = findTotalDays(ownerdata.invoices, car)[1];
				const subTotal = (totalDays - offroadDays) * car.rent;
				const totalAmount = (subTotal * gst) / 100 + subTotal;
				return {
					data: [index + 1, car?.brand, totalDays, offroadDays, car?.rent, fixed(subTotal), fixed(totalAmount)],
					_id: car?._id,
				};
			});

			// console.log(ownerdata.bills);
			const pendingAmount = ownerdata?.bills?.reduce((acc, bill) => {
				return (
					acc +
					bill?.invoices?.reduce((acc, inv) => {
						const amount = inv.amount;
						const gstAmount = fixed((amount * gst) / 100);
						const totalAmount = fixed(amount + gstAmount);
						return acc + totalAmount;
					}, 0)
				);
			}, 0);

			const paidAmount = ownerdata?.paid?.reduce((acc, bill) => {
				// console.log(bill);
				return (
					acc +
					bill?.bills.reduce(
						(acc, i) =>
							acc +
							i.invoices?.reduce((acc, inv) => {
								// console.log(inv);
								const amount = inv?.amount;
								const gstAmount = fixed((amount * gst) / 100);
								const totalAmount = fixed(amount + gstAmount);
								return fixed(acc + totalAmount);
							}, 0),
						0
					)
				);
			}, 0);

			setAmountPaid(paidAmount);
			setamountPending(pendingAmount);

			const headers = ["Serial.No", "Brand Name", "Total Days", "Offroad", "Rate", "Sub Total", "Total Amount"];

			setCarHeaders(headers);
			setSortedData(carsdata);
		}
	}, [ownerdata, unit, gst]);

	useEffect(() => {
		dispatch(getOwnerById(params.id));
		dispatch(getGst());
	}, [dispatch]);

	useEffect(() => {
		if (owner) {
			setOwnerdata(owner);
			setCarData(owner.cars);
		}
	}, [owner]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerDetails">
				<Bar />
				<div>
					<h2>Owner Details</h2>
				</div>
				<section className="ownerProfileContainer">
					<section className="profileDetails">
						<header></header>
						{loading ? (
							<TxtLoader />
						) : (
							<div>
								<article className="basicProfile">
									<img src={ownerdata?.avatar?.url ? ownerdata.avatar.url : userImg} alt="user iamge" />
									<section className="details">
										<div>
											<FaUser />
											<h3>{ownerdata.name}</h3>
										</div>
										<div>
											<BsTelephoneFill />
											<h3>+91 {ownerdata.contact}</h3>
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
										<h3>{ownerdata?.cars?.length} Cars</h3>
									</div>
									<div>
										<MdLocationPin />
										<h3>
											{ownerdata?.address?.street +
												", " +
												ownerdata?.address?.city +
												", " +
												ownerdata?.address?.state +
												", " +
												ownerdata?.address?.pincode}
										</h3>
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
						)}
					</section>
					<section className="registrationDetails">
						<header></header>
						{loading ? (
							<TxtLoader />
						) : (
							<div className="body">
								<div className="detialRow">
									<h4 className="heading">GST Number:</h4>
									<h4 className="value">{ownerdata.gst}</h4>
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
									<h4 className="value">{totalDays ? totalDays : 0}</h4>
								</div>
								<div className="detialRow">
									<h4 className="heading">Joined Date:</h4>
									<h4 className="value">{formatDate(ownerdata.createdAt)}</h4>
								</div>
								<div className="detialRow">
									<h4 className="heading">Amount Paid:</h4>
									<h4 className="value">{amountPaid}</h4>
								</div>
								<div className="detialRow">
									<h4 className="heading">Pending Amount:</h4>
									<h4 className="value">{amountPending}</h4>
								</div>
							</div>
						)}
					</section>
				</section>
				<TableContainer className="vehicleTableContainer">
					<TableHeading>
						<p style={{ color: "#fcfcfc" }}>Car Details</p>
					</TableHeading>
					{sortedData?.length === 0 ? (
						<h2 style={{ textAlign: "center", margin: "1rem 0", color: "red" }}>No Cars are Found!</h2>
					) : (
						<Table>
							<TableHeaders style={{ gridTemplateColumns: `repeat(${carHeaders?.length},1fr)` }} headers={carHeaders} />
							{loading ? <TxtLoader /> : <TableBody TableRow={CarRow} data={sortedData} />}
						</Table>
					)}
				</TableContainer>
			</main>
		</div>
	);
}

export default OwnerDetails;
