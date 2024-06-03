/* eslint-disable react/prop-types */
import { AdminSidebar, Loader } from "../components";
import Bar from "../components/Bar";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { InvoiceRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "../components/TableHOC";
import { FaPlus, FaSearch, FaUpload } from "react-icons/fa";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import NewInvoice from "../components/NewInvoice";
import { useNavigate } from "react-router-dom";
import { getAllInvoices } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function formatDate(date, d = false) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}

	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();

	return d ? day : `${day}, ${months[month]}, ${year}`;
}

const invoiceHeaders = ["Invoice ID", "Company Name", "Email", "Issue Date", "Amount", "Status"];

const fixed = (n) => {
	return parseFloat(Number(n).toFixed(2));
};

const Invoice = () => {
	const [selectedInvoice, setSelectedInvoice] = useState("all");
	const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);
	const [invoiceData, setInvoiceData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const { invoices, message, error, loading } = useSelector((state) => state.invoice);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getAllInvoices());
	}, [dispatch]);

	useEffect(() => {
		if (invoices) {
			const currentMonth = new Date().getMonth(); // Get the current month
			const nextMonth = (currentMonth + 1) % 12; // Calculate the index of the next month (0-indexed)

			const companyInvoiceData = {};

			invoices.forEach((invoice) => {
				const { company, months } = invoice;
				// console.log(invoice.months);
				const {
					_id: companyId,
					name: companyName,
					contact: companyContact,
					address: companyAddress,
					pan: companyPan,
					gst: companyGst,
					hsn: companyHsn,
				} = company;
				// Initialize an empty array to store monthly invoices if not already exists
				if (!companyInvoiceData[companyId]) {
					companyInvoiceData[companyId] = {
						companyId,
						companyName,
						companyContact,
						companyAddress,
						companyPan,
						companyGst,
						companyHsn,
						ownerName: invoice.owner.name,
						monthlyInvoices: [],
					};
				}
				// Iterate through each month's invoice
				months.forEach((monthInvoice, index) => {
					const {
						startDate,
						endDate,
						billAmount,
						invoiceDate,
						startKm,
						endKm,
						rate,
						days,
						offroad,
						dayAmount,
						kmAmount,
						totalDays,
						totalAmount,
						gstAmount,
						rent,
						companyStatus,
						frvCode,
						car,
						district,
					} = monthInvoice;

					// Create an object for the monthly invoice
					const monthlyInvoice = {
						month: formatDate(invoiceDate),
						startDate,
						endDate,
						startKm,
						endKm,
						billAmount,
						rate,
						days,
						offroad,
						dayAmount,
						kmAmount,
						totalDays,
						totalAmount,
						gstAmount,
						rent,
						companyStatus,
						model: invoice.car.model,
						brand: invoice.car.brand,
						registrationNo: invoice.car.registrationNo,
						frvCode,
						district,
						carId: car?._id,
						year: car.year,
					};

					// If this is the first invoice for this month, create a new array for that month
					if (!companyInvoiceData[companyId].monthlyInvoices[index]) {
						companyInvoiceData[companyId].monthlyInvoices[index] = [];
					}

					// Push the monthly invoice to the corresponding month's array
					companyInvoiceData[companyId].monthlyInvoices[index].push(monthlyInvoice);
				});
			});

			// Convert the object of companyInvoiceData into an array
			const companyInvoiceArray = Object.values(companyInvoiceData);

			const invData = companyInvoiceArray.map((invoice, idx) => {
				const monthData = invoice.monthlyInvoices.map((invoiceMonth, i) => {
					const totalAmount = invoiceMonth.reduce((acc, data) => {
						return acc + data.billAmount;
					}, 0);
					const data = {
						data: [idx + i + 1, invoice.companyName, invoice.companyContact, invoiceMonth[0].month, fixed(totalAmount)],
						status: invoiceMonth[0].companyStatus,
						companyId: invoice.companyId,
						companyName: invoice.companyName,
						companyContact: invoice.companyContact,
						companyAddress: invoice.companyAddress,
						companyPan: invoice.companyPan,
						companyHsn: invoice.companyHsn,
						companyGst: invoice.companyGst,
						invoices: invoiceMonth,
					};
					return data;
				});
				return monthData;
			});

			const allData = invData.reduce((acc, curr) => {
				for (const key of curr) {
					acc.push(key);
				}
				return acc;
			}, []);

			// Set the state variables
			setInvoiceData(allData);
			setFilteredInvoiceData(allData);
		}
	}, [invoices]);

	useEffect(() => {
		const filterInvoiceData = () => {
			let filteredData = invoiceData.slice();

			// console.log(filteredData);

			if (selectedInvoice !== "all") {
				filteredData = filteredData.filter((invoice) => invoice.status === selectedInvoice);
			}

			if (searchQuery) {
				const lowercaseQuery = searchQuery.toLowerCase();
				filteredData = filteredData.filter(
					(invoice) =>
						invoice.companyName.toLowerCase().includes(lowercaseQuery) || invoice.companyContact.toLowerCase().includes(lowercaseQuery)
				);
			}
			setFilteredInvoiceData(filteredData);
		};

		filterInvoiceData();
	}, [selectedInvoice, searchQuery, invoiceData]);

	useEffect(() => {
		console.log(filteredInvoiceData);
	}, [filteredInvoiceData]);

	useEffect(() => {
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
	}, [message, error, dispatch]);

	const generatePdf1 = (data) => {
		const invoicesJson = encodeURIComponent(JSON.stringify(data));
		navigate(`/Bill?invoices=${invoicesJson}`);
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="invoice">
				<Bar />
				{isOpen ? (
					<NewInvoice setIsOpen={setIsOpen} />
				) : (
					<>
						<section className="invoice_filter">
							<h2>Invoices</h2>
						</section>
						<section className="invoice_widget_container">
							<WidgetItem designation="All Invoices" value={invoiceData.length || 0} />
							<WidgetItem designation="Paid Invoices" value={invoiceData?.filter((i) => i.status === "paid").length || 0} />
							<WidgetItem designation="Unpaid Invoices" value={invoiceData?.filter((i) => i.status === "pending").length || 0} />
						</section>
						<TableContainer className="invoice_table_container">
							<TableHeading>
								<h5>All Invoices</h5>
								<div className="invoice_options">
									<button onClick={() => setIsOpen(!isOpen)}>
										Create Invoice <FaPlus />
									</button>
								</div>
							</TableHeading>
							<TableHeading className="invoice_functionality">
								<div className="invoice_functionality_sort">
									<h4 className={selectedInvoice === "all" ? "selected_invoice" : ""} onClick={() => setSelectedInvoice("all")}>
										All Invoices
									</h4>
									<h4 className={selectedInvoice === "paid" ? "selected_invoice" : ""} onClick={() => setSelectedInvoice("paid")}>
										Paid
									</h4>
									<h4
										className={selectedInvoice === "pending" ? "selected_invoice" : ""}
										onClick={() => setSelectedInvoice("pending")}
									>
										Unpaid Invoices
									</h4>
								</div>
								<div className="invoice_functionality_search">
									<button>
										<FaSearch />
										<input
											type="text"
											placeholder="Search by Company Name or Contact"
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
										/>
									</button>
								</div>
							</TableHeading>
							<Table>
								<TableHeaders style={{ gridTemplateColumns: `repeat(${invoiceHeaders.length},1fr)` }} headers={invoiceHeaders} />
								<TableBody TableRow={InvoiceRow} data={filteredInvoiceData} onClick={generatePdf1} />
							</Table>
						</TableContainer>
					</>
				)}
			</main>
		</div>
	);
};

const WidgetItem = ({ value, designation, percent }) => {
	return (
		<article className="invoice_widget">
			<div className="invoice_widget_header">
				<span>
					<svg width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 19L15 17L12 19L9 17L6 19L3 17L0 19V0H18V19Z" fill="#029E9D" />
					</svg>
					{designation}
				</span>
			</div>
			<h2>{Math.abs(value)}</h2>
			{percent && (
				<div className="invoice_widget_trends">
					{percent > 0 ? (
						<h5 className="green">
							<HiTrendingUp /> {percent}%
						</h5>
					) : (
						<h5 className="red">
							<HiTrendingDown /> {Math.abs(percent)}%
						</h5>
					)}
				</div>
			)}
		</article>
	);
};

export default Invoice;
