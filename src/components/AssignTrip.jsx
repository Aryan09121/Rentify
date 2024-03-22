import { FaSearch } from "react-icons/fa";
import { driverDetailsHeaders, tripData, tripHeaders } from "../assets/data/dashboard";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
import { DashboardRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";

const AssignTrip = () => {
	const searchCar = (e) => {
		if (e.key === "Enter") {
			console.log("searching...");
		}
	};
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="assignTrip">
				<Bar />
				<h2>Assign A Trip</h2>
				<TableContainer className="carAssignTable">
					<TableHeading>
						<p>Choose Car</p>
						<button>
							<FaSearch /> <input type="text" placeholder="Search Trips..." onKeyDown={searchCar} />
						</button>
					</TableHeading>
					<Table>
						<TableHeaders headers={tripHeaders} style={{ gridTemplateColumns: `repeat(${driverDetailsHeaders.length},1fr)` }} />
						<TableBody TableRow={DashboardRow} data={tripData} />
					</Table>
				</TableContainer>
			</main>
		</div>
	);
};

export default AssignTrip;
