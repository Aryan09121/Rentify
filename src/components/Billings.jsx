import { Filter } from "../pages/InvoiceDetails";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
// import Table from "./Table";

import { billHeaders } from "../assets/data/bill";
import { BillListRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getGst } from "../redux/actions/setting.action";
import { getAllOwnerInvoices } from "../redux/actions/invoice.action";
import TxtLoader from "./TxtLoader";

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

function Billings() {
	const dispatch = useDispatch();
	const { ownerInvoices, message, error, loading } = useSelector((state) => state.invoice);
	const [invoiceData, setInvoiceData] = useState([]);
	const navigate = useNavigate();

	const navigateToBill = (data) => {
		// console.log(data);
		const { owner, invoices } = data;
		// Convert the invoices array to a JSON string
		const invoicesJson = JSON.stringify(invoices);
		const ownerJson = JSON.stringify(owner);

		// Encode the JSON string to include it in the URL as a query parameter
		const encodedInvoices = encodeURIComponent(invoicesJson);
		const encodedOwner = encodeURIComponent(ownerJson);

		// Navigate to the route with the encoded invoices as a query parameter
		navigate(`/billings/${data._id}?invoices=${encodedInvoices}&owner=${encodedOwner}`);
	};

	useEffect(() => {
		if (ownerInvoices) {
			// console.log(ownerInvoices);
			const isUniqueOwner = (owner, index, self) => {
				return self.findIndex((o) => o.owner._id === owner.owner._id) === index;
			};
			// console.log(invoices.filter(isUniqueOwner));
			const data = ownerInvoices.filter(isUniqueOwner).map((invoice, idx) => {
				// console.log(invoice);
				const { owner } = invoice;
				// console.log(owner);
				if (owner.bills.length > 0) {
					const { _id, name, email } = owner;

					let totalAmount = 0; // Initialize totalAmount for each owner

					// Iterate through each bills for the current owner
					totalAmount = owner.bills.reduce((acc, bill) => {
						return acc + bill.invoices.reduce((acc, inv) => acc + inv.amount, 0);
					}, 0);

					// console.log(totalAmount);

					let createdDate;
					invoice.invoices.forEach((invoice) => {
						invoice.invoice.forEach((inv) => {
							createdDate = inv.invoiceDate;
						});
					});

					return {
						data: [String(idx + 1).padStart(3, "0"), name, email, formatDate(createdDate), totalAmount.toFixed(2)],
						_id,
						owner: owner,
						invoices: invoice.invoices,
					};
				} else {
					return null;
				}
			});

			setInvoiceData(data.filter((i) => i !== null));
		}
	}, [ownerInvoices]);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
	}, [message, error]);

	useEffect(() => {
		dispatch(getAllOwnerInvoices());
		dispatch(getGst());
	}, []);
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Bills</h2>
				{/* {invoiceData.length > 0 && <Filter />} */}

				<TableContainer>
					<TableHeading>
						<p>All Bills</p>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${billHeaders.length},1fr)` }} headers={billHeaders} />
						{loading ? <TxtLoader /> : <TableBody TableRow={BillListRow} data={invoiceData} onClick={navigateToBill} />}
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default Billings;
