import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getGst } from "../redux/actions/setting.action";
import { getAllInvoices } from "../redux/actions/invoice.action";
import TxtLoader from "./TxtLoader";
import { FaSearch } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
import { billHeaders } from "../assets/data/bill";
import { BillListRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";

const formatDate = (date, d = false) => {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	return d === false ? `${day}, ${months[month]}, ${year}` : day;
};

const fixed = (n) => parseFloat(Number(n).toFixed(2));

const Billings = () => {
	const dispatch = useDispatch();
	const { invoices, message, error, loading } = useSelector((state) => state.invoice);
	const [invoiceData, setInvoiceData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedInvoice, setSelectedInvoice] = useState("all");
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getAllInvoices());
		dispatch(getGst());
	}, []);

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
		if (invoices?.length > 0) {
			const ownerInvoiceData = {};
			invoices.forEach((invoice) => {
				const { owner, months } = invoice;
				const { _id, name, contact, address: ownerAddress } = owner;
				if (!ownerInvoiceData[_id]) {
					ownerInvoiceData[_id] = {
						ownerId: _id,
						ownerName: name,
						contact,
						ownerAddress,
						monthlyInvoices: [],
					};
				}
				months.forEach((monthInvoice, index) => {
					const monthlyInvoice = { month: formatDate(monthInvoice.invoiceDate), ...monthInvoice };
					if (!ownerInvoiceData[_id].monthlyInvoices[index]) {
						ownerInvoiceData[_id].monthlyInvoices[index] = [];
					}
					ownerInvoiceData[_id].monthlyInvoices[index].push(monthlyInvoice);
				});
			});
			const ownerInvoiceArray = Object.values(ownerInvoiceData);
			const invData = ownerInvoiceArray.flatMap((invoice) =>
				invoice.monthlyInvoices.map((invoiceMonth) => ({
					data: [
						invoice.ownerName,
						invoice.contact,
						invoiceMonth[0].month,
						fixed(invoiceMonth.reduce((acc, data) => acc + data.totalDays * data.rent, 0)),
					],
					status: invoiceMonth[0].ownerStatus === "paid" ? "paid" : "unpaid",
					ownerId: invoice.ownerId,
					ownerName: invoice.ownerName,
					contact: invoice.contact,
					ownerAddress: invoice.ownerAddress,
					ownerPan: invoice.ownerPan,
					invoices: invoiceMonth,
				}))
			);
			setInvoiceData(invData);
		}
	}, [invoices]);

	const sortedAndFilteredData = useMemo(() => {
		let data = [...invoiceData];
		if (searchQuery) {
			data = data.filter((bill) => bill.data.slice(0, 2).join("").toLowerCase().includes(searchQuery.toLowerCase()));
		}
		if (selectedInvoice !== "all") {
			data = data.filter((bill) => bill.status === selectedInvoice);
		}
		return data;
	}, [invoiceData, searchQuery, selectedInvoice]);

	const navigateToBill = (data) => {
		const invoicesJson = encodeURIComponent(JSON.stringify(data));
		navigate(`/billings/data?invoices=${invoicesJson}`);
	};

	const handleInvoiceTypeChange = (type) => {
		setSelectedInvoice(type);
	};

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Bills</h2>
				<TableContainer>
					<TableHeading>
						<p>All Bills</p>
					</TableHeading>
					<TableHeading className="invoice_functionality">
						<div className="invoice_functionality_sort">
							{["all", "paid", "unpaid"].map((status) => (
								<h4
									key={status}
									className={selectedInvoice === status ? "selected_invoice" : ""}
									onClick={() => handleInvoiceTypeChange(status)}
								>
									{status === "all" ? "All Invoices" : status === "paid" ? "Paid" : "Unpaid Invoices"}
								</h4>
							))}
						</div>
						<div className="invoice_functionality_search">
							<button>
								<FaSearch />
								<input
									type="text"
									placeholder="Search by Owner details"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</button>
						</div>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${billHeaders.length},1fr)` }} headers={billHeaders} />
						{loading ? <TxtLoader /> : <TableBody TableRow={BillListRow} data={sortedAndFilteredData} onClick={navigateToBill} />}
					</Table>
				</TableContainer>
			</main>
		</div>
	);
};

export default Billings;
