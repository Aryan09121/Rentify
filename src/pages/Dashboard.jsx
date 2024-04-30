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
} from "../components/";
import { getAllTrips } from "../redux/actions";

import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
// import { useDispatch } from "react-redux";

import { tripHeaders } from "../assets/data/dashboard";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Extract the latest trip status for each driver

const Dashboard = () => {
	const { trips } = useSelector((state) => state.trip);
	const [tripdata, setTripdata] = useState([]);
	const [selectedTrip, setSelectedTrip] = useState();
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
								<button>Complete Trip</button>
							</TableFooter>
						</TableContainer>
					)}
				</section>
				{tripdata?.length > 0 && (
					<TableContainer className="dashboardTripTableContainer">
						<TableHeading>
							<p>Trip Details</p>
						</TableHeading>
						<Table>
							<TableHeaders headers={tripHeaders} style={{ gridTemplateColumns: `repeat(${tripHeaders.length},1fr)` }} />
							<TableBody onClick={onSelectTrip} TableRow={DashboardRow} data={tripdata} />
						</Table>
					</TableContainer>
				)}
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
