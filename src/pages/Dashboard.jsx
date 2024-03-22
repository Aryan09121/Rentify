/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import Bar from "../components/Bar";
import { FaSearch } from "react-icons/fa";
// import { useDispatch } from "react-redux";

import { tripHeaders, tripData, driverDetailsData, driverDetailsHeaders } from "../assets/data/dashboard";
import {
	TableContainer,
	TableHeading,
	Table,
	TableHeaders,
	TableBody,
	DriverRow,
	DashboardRow,
	DriverDetailsRow,
	TableFooter,
} from "../components/TableHOC";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { getOwners } from "../actions/owner.action";

const possibleStatuses = ["On Trip", "On Leave", "Available"];

// Group trips by driver id
const groupedTrips = tripData.reduce((acc, trip) => {
	const driverId = trip.driver_id;
	if (!acc[driverId]) {
		acc[driverId] = [];
	}
	acc[driverId].push(trip);
	return acc;
}, {});

// Generate random status for each driver
const driverStatusMap = {
	101: "On Trip",
	102: "On Leave",
	103: "Available",
	104: "On Trip",
};
Object.keys(groupedTrips).forEach((driverId) => {
	const randomIndex = Math.floor(Math.random() * possibleStatuses.length);
	const randomStatus = possibleStatuses[randomIndex];
	driverStatusMap[driverId] = randomStatus;
});

// Extract the latest trip status for each driver

const Dashboard = () => {
	// const dispatch = useDispatch();

	// useEffect(() => {
	// 	dispatch(getOwners());
	// }, [dispatch]);

	// useEffect(() => {
	// 	dispatch(getOwners());
	// }, []);

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

				<section className="widget-container">
					<WidgetItem percent={2.8} value={340000} heading="Income" color="rgba(0,115,255)" />
					<WidgetItem percent={-2.5} value={400} heading="Paid" color="rgba(0,198,202)" />
					<WidgetItem percent={4} value={23000} heading="Invoices" color="rgba(0,115,255)" />
				</section>
				<TableContainer className="dashboardTripTableContainer">
					<TableHeading>
						<p>Trip Details</p>
					</TableHeading>
					<Table>
						<TableHeaders headers={tripHeaders} style={{ gridTemplateColumns: `repeat(${driverDetailsHeaders.length},1fr)` }} />
						<TableBody TableRow={DashboardRow} data={tripData} />
					</Table>
				</TableContainer>
				<section className="driver-container">
					<TableContainer className="dashboarddriverDetailsTableContainer">
						<TableHeading>
							<p>Trip Information</p>
							<button>
								<FaSearch /> <input type="text" placeholder="Search Trips..." />
							</button>
						</TableHeading>
						<Table>
							<TableHeaders
								headers={driverDetailsHeaders}
								style={{ gridTemplateColumns: `repeat(${driverDetailsHeaders.length},1fr)` }}
							/>
							<TableBody TableRow={DriverDetailsRow} isSingleData={true} data={driverDetailsData} />
						</Table>
					</TableContainer>
				</section>
			</main>
		</div>
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
