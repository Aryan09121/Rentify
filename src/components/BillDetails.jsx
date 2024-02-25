import { Filter } from "../pages/CarDetails";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
// import Table from "./Table";

import { billDetailsData, billDetailsHeaders } from "../assets/data/bill";
import { BillDetailsRow, Table, TableBody, TableContainer, TableFooter, TableHeaders, TableHeading } from "./TableHOC";

function BillDetails() {
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Bills</h2>
				<Filter />
				{/* <Table
					className="tableContainer"
					length={billDetailsHeaders.length}
					data={billDetailsData}
					headers={billDetailsHeaders}
					isBill={true}
				>
					<div className="billHeaders">
						<div>
							<h4>Bill To Address</h4>
							<h4>4157 Washington Ave.Manchester, Kentuchy 39456</h4>
						</div>
						<div>
							<h4>
								Month: <span>Nov 24</span>
							</h4>
							<h4>Vehicle Monthly Rental Basis PO</h4>
						</div>
					</div>
				</Table> */}
				<TableContainer>
					<TableHeading>
						<div className="billHeaders">
							<div>
								<h4>Bill To Address</h4>
								<h4>4157 Washington Ave.Manchester, Kentuchy 39456</h4>
							</div>
							<div>
								<h4>
									Month: <span>Nov 24</span>
								</h4>
								<h4>Vehicle Monthly Rental Basis PO</h4>
							</div>
						</div>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `1fr 4fr 1fr 1fr 1fr 1fr` }} headers={billDetailsHeaders} />
						<TableBody TableRow={BillDetailsRow} data={billDetailsData}></TableBody>
						<TableFooter>
							<div>
								<h4>Taxable Value (%)</h4>
								<h4>29,82269.99</h4>
							</div>
							<div>
								<h4>GST @ 5%</h4>
								<h4>1,49,113.47</h4>
							</div>
							<div>
								<h4>Total (Rs)</h4>
								<h4>31382.91</h4>
							</div>
						</TableFooter>
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default BillDetails;
