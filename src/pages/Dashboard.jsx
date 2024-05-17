/* eslint-disable react/prop-types */
import {
	AdminSidebar,
	Bar,
	TableContainer,
	TableHeading,
	Table,
	TableHeaders,
	TableBody,
	DashboardRow,
	tripDetailsRow,
	TableFooter,
	Loader,
} from "../components/";
import { getAllTrips } from "../redux/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { IoIosArrowDown, IoIosCalendar, IoIosClose, IoIosSettings } from "react-icons/io";
// import { useDispatch } from "react-redux";

import { tripHeaders } from "../assets/data/dashboard";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TxtLoader from "../components/TxtLoader";
import { toast } from "react-toastify";
import Select, { components } from "react-select";
import { completeTrip, updateOffroad } from "../redux/actions/trip.action";

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoIosArrowDown />
		</components.DropdownIndicator>
	);
};

const customStyles = {
	control: (provided) => ({
		...provided,
		// padding: "0.3rem 0.6rem",
		cursor: "pointer",
		backgroundColor: "#fff",
		width: "100%",
		transition: "all 0.3s ease-in-out",
		border: "2.5px solid rgb(2, 158, 157)",
		"&:hover, &:focus": {
			backgroundColor: "#fff",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.2rem",
		borderRadius: "10px",
		width: "100%",
		fontSize: "1.1rem",
		opacity: "0.8",
		transition: "all 0.3s ease-in-out",
		"&:hover, &:focus": {
			// padding: "0.3rem 0.6rem",
		},
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#000",
		fontSize: "2rem",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
};

// Extract the latest trip status for each driver

const Dashboard = () => {
	const { trips, loading } = useSelector((state) => state.trip);
	const [tripdata, setTripdata] = useState([]);
	const [selectedTrip, setSelectedTrip] = useState();
	const [isOpen, setIsOpen] = useState(false);
	const [isShown, setIsShown] = useState(false);

	// const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const onSelectTrip = (trip) => {
		setSelectedTrip(trip.trip);
	};

	useEffect(() => {
		if (trips?.length !== 0) {
			const data = trips?.map((trip) => ({
				data: [trip?.tripId, trip?.car?.model, trip?.car?.registrationNo, trip?.district],
				status: trip.status,
				_id: trip?._id,
				trip: trip,
			}));
			setTripdata(data);
		}
	}, [trips]);

	useEffect(() => {
		dispatch(getAllTrips());
	}, []);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="dashboard">
				<Bar />
				<section className="heading">
					<h2>Dashboard</h2>
					<Link to="/add/trip">
						<button>Assign Trip</button>
					</Link>
				</section>
				{/* <section className="widget-container">
					<WidgetItem percent={2.8} value={340000} heading="Income" color="rgba(0,115,255)" />
					<WidgetItem percent={-2.5} value={400} heading="Paid" color="rgba(0,198,202)" />
					<WidgetItem percent={4} value={23000} heading="Invoices" color="rgba(0,115,255)" />
				</section> */}
				<section className="driver-container">
					{selectedTrip && (
						<TableContainer className="dashboarddriverDetailsTableContainer">
							<TableHeading>
								<p>Trip Information</p>
							</TableHeading>
							<Table>
								<TableHeaders headers={tripHeaders} style={{ gridTemplateColumns: `repeat(${tripHeaders.length},1fr)` }} />
								<TableBody TableRow={tripDetailsRow} isSingleData={true} data={selectedTrip} />
							</Table>
							<TableFooter footerClass="tripDetailsFooter">
								<div>
									<p>{selectedTrip?.year}</p>
									<h4>Year</h4>
								</div>
								<div>
									<p>{selectedTrip?.frvCode}</p>
									<h4>FRV Code</h4>
								</div>
								<div>
									<p>{new Date(selectedTrip?.start?.date).toLocaleDateString()}</p>
									<h4>Start Date</h4>
								</div>
								<div>
									<p>{selectedTrip?.start?.km} km</p>
									<h4>Start Kilometers</h4>
								</div>
								{selectedTrip?.status !== "completed" && <button onClick={() => setIsShown(true)}>Update offroad</button>}
								{selectedTrip?.status !== "completed" && <button onClick={() => setIsOpen(true)}>Complete Trip</button>}
							</TableFooter>
						</TableContainer>
					)}
				</section>

				<TableContainer className="dashboardTripTableContainer">
					<TableHeading>
						<p>Trip Details </p>
					</TableHeading>
					<Table>
						<TableHeaders headers={tripHeaders} style={{ gridTemplateColumns: `repeat(${tripHeaders.length},1fr)` }} />
						<TableBody onClick={onSelectTrip} TableRow={DashboardRow} data={tripdata.reverse()} />
					</Table>
				</TableContainer>
				{selectedTrip && <Confirm setSelectedTrip={setSelectedTrip} open={isOpen} setIsOpen={setIsOpen} trip={selectedTrip} />}
				{selectedTrip && <ConfirmDate open={isShown} setIsOpen={setIsShown} trip={selectedTrip} />}
			</main>
		</div>
	);
};

const ConfirmDate = ({ open, setIsOpen, trip }) => {
	const [dates, setDates] = useState([]);
	const [date, setDate] = useState();
	const dispatch = useDispatch();

	const handleDateSelect = () => {
		// alert("date selected");
	};

	const deleteDate = (value) => {
		setDates((prevDates) => prevDates.filter((date) => date.value !== value));
	};

	const onDateChange = (e) => {
		setDate(e.toLocaleDateString());
		setDates((prev) => {
			return [
				...prev,
				{
					value: e + 1,
					label: (
						<p style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
							{e.toLocaleDateString()}
							<IoIosClose
								style={{ fontSize: "1.7rem", cursor: "pointer", color: "red" }}
								onClick={() => deleteDate(e.toLocaleDateString())}
							/>
						</p>
					),
				},
			];
		});
	};

	const update = (trip) => {
		if (dates.length > 0) {
			const offroad = {
				count: dates.length,
				dates: dates.map((date) => date.value),
			};
			// console.log(offroad);
			dispatch(updateOffroad(trip._id, offroad));
			dispatch(getAllTrips());
			setIsOpen(false);
		}
	};

	return (
		<dialog className="confirmDateBox" open={open}>
			<div style={{ padding: "2rem" }}>
				<IoIosClose
					style={{ position: "absolute", right: "3%", top: "3%", fontSize: "2rem", cursor: "pointer", color: "red" }}
					onClick={() => setIsOpen(false)}
				/>
				<h5>Update Offroad Days</h5>

				<div
					className="selectdatediv"
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
						flexDirection: "column",
						fontFamily: "poppins",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
							gap: "1rem",
							placeItems: "center",
							width: "100%",
						}}
					>
						<label style={{ width: "40%", textAlign: "left", fontSize: "1rem", fontWeight: 300 }}>Select Dates</label>
						<DatePicker
							showIcon
							icon={IoIosCalendar}
							selected={date}
							onChange={onDateChange}
							dateFormat="Pp"
							toggleCalendarOnIconClick
							onSelect={handleDateSelect}
						/>
					</div>
					{dates.length > 0 && (
						<Select className="filter" defaultValue={dates[0]} options={dates} components={{ DropdownIndicator }} styles={customStyles} />
					)}
					<button onClick={() => update(trip)}>Add offroad</button>
				</div>
			</div>
		</dialog>
	);
};

const Confirm = ({ open, setSelectedTrip, setIsOpen, trip }) => {
	const [endKm, setEndKm] = useState(false);
	const dispatch = useDispatch();

	const onCompleteTrip = async (trip, end) => {
		await dispatch(completeTrip(trip._id, end));
		await setSelectedTrip(null);
		dispatch(getAllTrips());
	};

	return (
		<dialog className="confirmBox" open={open}>
			<div style={{ padding: "2rem" }}>
				<IoIosClose
					style={{ position: "absolute", right: "3%", top: "3%", fontSize: "2rem", cursor: "pointer", color: "red" }}
					onClick={() => setIsOpen(false)}
				/>
				<h5>Are you want to end the trip??</h5>
				<h6>Fill the neccessary details</h6>

				<div
					style={{
						width: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
						flexDirection: "column",
						fontFamily: "poppins",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
							gap: "1rem",
							placeItems: "center",
							width: "100%",
						}}
					>
						<label style={{ width: "40%", textAlign: "left", fontSize: "1rem", fontWeight: 300 }}>End Kilometer</label>
						<input
							style={{ width: "100%", padding: ".4rem 1rem", borderRadius: "3px" }}
							type="number"
							value={endKm}
							onChange={(e) => setEndKm(e.target.value)}
						/>
					</div>
					<button
						onClick={() => {
							onCompleteTrip(trip, { date: new Date(), km: endKm });
							setIsOpen(false);
						}}
					>
						Complete Trip
					</button>
				</div>
			</div>
		</dialog>
	);
};

export const WidgetItem = ({ heading, value, percent }) => {
	const [selectedOption, setSelectedOption] = useState("Today");
	const handleOptionChange = (e) => {
		setSelectedOption(e.target.value);
	};
	return (
		<article className="widget">
			<div>
				<i>
					<IoIosSettings />
				</i>
				<h4>{heading}</h4>

				<p>
					<select value={selectedOption} onChange={handleOptionChange}>
						<option value="Today">Today</option>
						<option value="LastWeek">Last Week</option>
						<option value="LastMonth">Last Month</option>
						<option value="LastYear">Last Year</option>
						<option value="All">All</option>
					</select>
				</p>
			</div>
			<h2>&#8377; {Math.abs(value)}</h2>
			{percent > 0 ? (
				<h5 className="green">
					<HiTrendingUp /> + {percent}%
				</h5>
			) : (
				<h5 className="red">
					<HiTrendingDown /> {Math.abs(percent)}%
				</h5>
			)}
		</article>
	);
};

export default Dashboard;
