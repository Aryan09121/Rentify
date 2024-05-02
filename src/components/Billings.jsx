import { Filter } from "../pages/InvoiceDetails";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
// import Table from "./Table";

import { billData, billHeaders } from "../assets/data/bill";
import { BillListRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllInvoices } from "../redux/actions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
	const { invoices, message, error } = useSelector((state) => state.invoice);
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
		if (invoices) {
			// console.log(invoices);
			const data = invoices.map((invoice, idx) => {
				// console.log(invoice);
				const { owner } = invoice;
				const { _id, name, email, createdAt } = owner;

				let totalAmount = 0; // Initialize totalAmount for each owner

				// Iterate through each invoice for the current owner
				invoice.invoices.forEach((invoice) => {
					invoice.invoice.forEach((inv) => {
						totalAmount += inv.totalAmount; // Sum up the totalAmount of each invoice
					});
				});

				const modelInvoices = invoice.invoices;

				let status = "unpaid";
				let allPaid = true;

				for (const modelInvoice of modelInvoices) {
					const someUnpaid = modelInvoice.invoice.some((invoice) => invoice.status === "unpaid");
					if (someUnpaid) {
						allPaid = false;
						break;
					}
				}

				if (allPaid) {
					status = "paid";
				}
				return {
					data: ["INV-10" + idx, name, email, formatDate(createdAt), totalAmount.toFixed(2)],
					_id,
					owner: owner,
					invoices: invoice.invoices,
					status,
				};
			});
			// console.log(data);
			setInvoiceData(data);
		}
	}, [invoices]);

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
		dispatch(getAllInvoices());
	}, []);
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
						<TableBody TableRow={BillListRow} data={invoiceData} onClick={navigateToBill} />
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default Billings;
