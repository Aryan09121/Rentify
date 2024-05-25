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
			const companyInvoiceData = invoices.map((invoice) => {
				console.log(invoice);
				const { company, months } = invoice;
				const {
					_id: companyId,
					name: companyName,
					contact: companyContact,
					address: companyAddress,
					pan: companyPan,
					gst: companyGst,
					hsn: companyHsn,
				} = company;
				const monthlyCarData = {};
				months.forEach((monthInvoice) => {
					console.log(monthInvoice);
					const { startDate, endDate, billAmount, invoiceDate } = monthInvoice;
					const cars = monthInvoice.cars.map((car) => ({
						model: car.model,
						registrationNo: car.registrationNo,
						// Add other car properties here if needed
					}));

					if (!monthlyCarData[invoiceDate]) {
						monthlyCarData[invoiceDate] = {
							startDate,
							endDate,
							billAmount,
							cars,
						};
					} else {
						monthlyCarData[invoiceDate].cars.push(...cars);
					}
				});
				console.log(monthlyCarData);

				const monthlyInvoices = Object.entries(monthlyCarData).map(([invoiceDate, data]) => ({
					invoiceDate,
					...data,
				}));

				return {
					companyId,
					companyName,
					companyContact,
					companyAddress,
					companyPan,
					companyGst,
					companyHsn,
					monthlyInvoices,
				};
			});
			console.log(companyInvoiceData);
			setInvoiceData(companyInvoiceData);
			setFilteredInvoiceData(companyInvoiceData);
		}
	}, [invoices]);

	useEffect(() => {
		const filterInvoiceData = () => {
			let filteredData = invoiceData.slice();

			if (selectedInvoice !== "all") {
				filteredData = filteredData.filter((invoice) => invoice.monthlyInvoices.some((inv) => inv.companyStatus === selectedInvoice));
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

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			filteredInvoiceData.map((invoice) => {
				return {
					"Invoice Id": invoice.companyId,
					"Owner Name": invoice.companyName,
					"Owner Email Id": invoice.companyContact,
					"Invoice Date": invoice.monthlyInvoices[0].invoiceDate,
					"Invoice Amount": invoice.totalAmount,
					Status: selectedInvoice,
				};
			})
		);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
		XLSX.writeFile(workbook, "invoices.xlsx");
	};

	const generatePdf1 = (data) => {
		const invoicesJson = encodeURIComponent(JSON.stringify(data.invoices));
		const ownerJson = encodeURIComponent(JSON.stringify(data.company));
		const id = encodeURIComponent(JSON.stringify(data.data[0]));
		const date = encodeURIComponent(JSON.stringify(data.data[3]));

		navigate(`/Bill?invoices=${invoicesJson}&owner=${ownerJson}&invId=${id}&date=${date}`);
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
							<WidgetItem
								designation="Paid Invoices"
								value={invoiceData.filter((i) => i.monthlyInvoices.some((inv) => inv.companyStatus === "paid")).length || 0}
							/>
							<WidgetItem
								designation="Unpaid Invoices"
								value={invoiceData.filter((i) => i.monthlyInvoices.some((inv) => inv.companyStatus === "unpaid")).length || 0}
							/>
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
										className={selectedInvoice === "unpaid" ? "selected_invoice" : ""}
										onClick={() => setSelectedInvoice("unpaid")}
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
									<button onClick={exportToExcel}>
										<FaUpload />
										Export
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
