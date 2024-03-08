/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import Bar from "../components/Bar";
import { FaSearch, FaPhoneAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiLogoGmail } from "react-icons/bi";

import { tripHeaders, tripData, driverHeaders, driverDetailsData, driverDetailsHeaders } from "../assets/data/dashboard";
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

// const driverData = [
// 	{
// 		driverName: "Raju Malhotra",
// 		_id: 101,
// 		status: "On Trip",
// 		driver_id: 101,
// 	},
// 	{
// 		driverName: "Sanjay Singh",
// 		_id: 102,
// 		status: "On Leave",
// 		driver_id: 102,
// 	},
// 	{
// 		driverName: "Nayak Khanna",
// 		_id: 103,
// 		status: "On Trip",
// 		driver_id: 103,
// 	},
// 	{
// 		driverName: "Trisha",
// 		_id: 104,
// 		status: "On Trip",
// 		driver_id: 104,
// 	},
// ];

// Array of possible statuses

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

// Extract the latest trip and assign random status for each driver
const driverData = Object.entries(groupedTrips).map(([, trips]) => {
	const latestTrip = trips.reduce((latest, trip) => {
		return trip._id > latest._id ? trip : latest;
	});
	const driverId = latestTrip.driver_id;
	return {
		driverName: latestTrip.data[1],
		status: driverStatusMap[driverId], // Assigning the randomly generated status
		id: latestTrip._id,
		driver_id: driverId,
	};
});

// console.log(extractedData);

// Extract the latest trip status for each driver

const Dashboard = () => {
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="dashboard">
				<Bar />
				<h2>Dashboard</h2>

				<section className="widget-container">
					<WidgetItem percent={2.8} value={340000} heading="Income" color="rgba(0,115,255)" />
					<WidgetItem percent={-2.5} value={400} heading="Paid" color="rgba(0,198,202)" />
					<WidgetItem percent={4} value={23000} heading="Invoices" color="rgba(0,115,255)" />
				</section>
				{/* <Table className="tableContainer" data={tripData} length={tripData.length + 1} headers={tripHeaders} isDashboard={true}>
					Tript Details
				</Table> */}
				<TableContainer className="dashboardTripTableContainer">
					<TableHeading>
						<p>Trip Details</p>
					</TableHeading>
					<Table>
						<TableHeaders headers={tripHeaders} style={{ gridTemplateColumns: `repeat(${driverDetailsHeaders.length + 1},1fr)` }} />
						<TableBody TableRow={DashboardRow} data={tripData} />
					</Table>
				</TableContainer>
				<section className="driver-container">
					<TableContainer className="dashboarddriverDetailsTableContainer">
						<TableHeading>
							<p>Driver Information</p>
							<button>
								<FaSearch /> <input type="text" placeholder="Search Driver..." />
							</button>
						</TableHeading>
						<Table>
							<TableHeaders
								headers={driverDetailsHeaders}
								style={{ gridTemplateColumns: `repeat(${driverDetailsHeaders.length},1fr)` }}
							/>
							<TableBody TableRow={DriverDetailsRow} isSingleData={true} data={driverDetailsData} />
							<TableFooter footerClass="driverFooter">
								<div className="tripDetails">
									<div>
										<h3>12</h3>
										<p>Trip Completed</p>
									</div>
									<div>
										<h3>145</h3>
										<p>Total Kilometers</p>
									</div>
									<div>
										<h3>00</h3>
										<p>Accident History</p>
									</div>
								</div>
								<div className="tripcalculated">
									<div>
										<FaPhoneAlt />
										<p>+91 9282632726</p>
									</div>
									<div>
										<BiLogoGmail />
										<p>Javid@gmail.com</p>
									</div>
									<button>Assign Trip</button>
								</div>
							</TableFooter>
						</Table>
					</TableContainer>

					<TableContainer className="dashboardTableContainer">
						<TableHeading>
							<p>Driver List</p>
							<BsThreeDotsVertical />
						</TableHeading>
						<Table>
							<TableHeaders headers={driverHeaders} style={{ gridTemplateColumns: `repeat(${driverHeaders.length},1fr)` }} />
							<TableBody TableRow={DriverRow} data={driverData} />
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
