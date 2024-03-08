/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import { FaArrowRight, FaUser } from "react-icons/fa";
import { TableContainer, Table, TableHeading } from "../components/TableHOC";
import { IoMdAdd } from "react-icons/io";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box } from "@mui/system";

import Bar from "../components/Bar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const xLabels = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dummyData = {
	2022: [4000, 3000, 2000, 2780, 1890, 2390, 3490, 2225, 1347, 644, 2443, 1333],
	2023: [4500, 3200, 2200, 2880, 1990, 2490, 3590, 2325, 1447, 744, 2543, 1433],
	// Add data for other years as needed
};

const AddNew = () => {
	const [selectedYear, setSelectedYear] = useState(""); // State to hold the selected year
	const [chartData, setChartData] = useState([]); // State to hold the chart data for the selected year

	// Function to handle year selection
	const handleYearChange = (event) => {
		setSelectedYear(event.target.value);
		// Here you would fetch the data for the selected year from your backend API and update the chartData state
		// For demonstration purposes, I'll generate dummy data for different years
		const dummyData = {
			2022: [4000, 3000, 2000, 2780, 1890, 2390, 3490, 2225, 1347, 644, 2443, 1333],
			2023: [4500, 3200, 2200, 2880, 1990, 2490, 3590, 2325, 1447, 744, 2543, 1433],
			2021: [6500, 1200, 2200, 1880, 1920, 3383, 1590, 1325, 2447, 1144, 543, 1633],
			2020: [500, 2800, 1200, 1145, 3240, 1630, 1590, 5523, 547, 1744, 2954, 3633],
			// Add data for other years as needed
		};
		setChartData(dummyData[event.target.value] || []);
	};

	useEffect(() => {
		// Set the default selected year to the latest year from dummyData
		const years = Object.keys(dummyData);
		const latestYear = years.length > 0 ? years[years.length - 1] : "";
		setSelectedYear(latestYear);
		setChartData(dummyData[latestYear] || []);
	}, []);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="addNew">
				<Bar />
				<h2>Add Owner</h2>
				<section className="widget-container">
					<WidgetItem designation="Owner" percent={2.8} value={243} />
					<WidgetItem designation="Driver" percent={-2.5} value={143} />
					<WidgetItem designation="Staff" percent={4} value={243} />
				</section>
				<section className="barChartContainer">
					<TableContainer className="addnewOwnerTable">
						<TableHeading>
							<button>
								<FaUser />
								<input type="text" placeholder="Search Owner" />
							</button>
							<div>
								<button>
									<input type="number" placeholder="Year" onChange={handleYearChange} value={selectedYear} />
								</button>
								<button></button>
							</div>
						</TableHeading>
						<Table>
							<Box sx={{ width: "100%", height: "80vh", p: 2, bgcolor: "background.paper" }}>
								{selectedYear !== "" ? (
									chartData.length !== 0 ? (
										<BarChart
											series={[{ data: chartData, label: "Rent Charges", id: "uvId" }]}
											xAxis={[{ data: xLabels, scaleType: "band" }]}
											grid={{ x: true, y: true }}
											leftAxis={null}
											axisHighlight={{
												x: "band", // Or 'none', or 'band'
												y: "line", // Or 'none'
											}}
										/>
									) : (
										<h1 className="red" style={{ textAlign: "center", marginTop: "10rem" }}>
											Please Select the Valid year first
										</h1>
									)
								) : (
									<h1>Please Select the year first</h1>
								)}
							</Box>
						</Table>
					</TableContainer>
				</section>
			</main>
		</div>
	);
};

const WidgetItem = ({ value, designation }) => (
	<article className="widget">
		<div>
			Total {designation} <FaArrowRight />
		</div>
		<h2>{Math.abs(value)}</h2>
		<div className="add-new">
			<Link to={`/add/new/${designation.toLowerCase()}`}>
				Add New {designation} <IoMdAdd />
			</Link>
		</div>
	</article>
);

export default AddNew;
