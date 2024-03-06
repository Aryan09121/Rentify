import { Filter } from "../pages/CarDetails";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
// import Table from "./Table";

import { billData, billHeaders } from "../assets/data/bill";
import { BillListRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";

function Billings() {
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Bills</h2>
				<Filter />
				<TableContainer>
					<TableHeading>
						<p>All Bills</p>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${billHeaders.length},1fr)` }} headers={billHeaders} />
						<TableBody TableRow={BillListRow} data={billData} />
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default Billings;
