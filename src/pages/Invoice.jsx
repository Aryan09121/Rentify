/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import { IoIosArrowDown } from "react-icons/io";
import Bar from "../components/Bar";
import Select, { components } from "react-select";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { InvoiceRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "../components/TableHOC";
import { FaPlus, FaSearch, FaUpload } from "react-icons/fa";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import NewInvoice from "../components/NewInvoice";
// import { invoice } from "../assets/data/bill";
// eslint-disable-next-line no-unused-vars
import { generatePdf } from "../components/PdfGenerator";
import { useNavigate } from "react-router-dom";
import { getAllInvoices, getIndividualInvoices } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const analyticsFilterOptions = [
	{ value: "month", label: "Monthly" },
	{ value: "all", label: "Annualy" },
];

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoIosArrowDown />
		</components.DropdownIndicator>
	);
};

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

const customStyles = {
	control: (provided) => ({
		...provided,
		// padding: "0.3rem 0.6rem",
		cursor: "pointer",
		backgroundColor: "#fff",
		transition: "all 0.3s ease-in-out",
		border: "2.5px solid rgb(2, 158, 157)",
		"&:hover, &:focus": {
			backgroundColor: "#fff",
			// padding: "0.2rem",
			color: "rgb(2, 158, 157)",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.2rem",
		borderRadius: "10px",
		fontSize: "1.1rem",
		opacity: "0.8",
		transition: "all 0.3s ease-in-out",
		"&:hover, &:focus": {
			// padding: "0.3rem 0.6rem",
			color: "rgb(2, 158, 157)",
		},
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#000",
		fontSize: "2rem",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
};

const invoiceHeaders = ["Invoice ID", "Vehicle Owner", "Email", "Issue Date", "Amount", "Status"];

const Invoice = () => {
	const [selectedInvoice, setSelectedInvoice] = useState("all");
	const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);
	const [invoiceData, setInvoiceData] = useState([]);
	const [searchQuery, setSearchQuery] = useState(""); // State to hold search input value
	const [isOpen, setIsOpen] = useState(false);
	const { invoices, allinvoices, message, error } = useSelector((state) => state.invoice);
	const dispatch = useDispatch();

	const navigate = useNavigate();

	//  ? filtering  invoice data
	const filterInvoiceData = (status, query) => {
		let filteredData = invoiceData.slice();

		// ? filtering the invoice data based on the status | paid | unpaid | all invoices

		if (status !== "all") {
			filteredData = filteredData.filter((invoice) => invoice.status === status);
		}

		// ? filtering the invoice data based on the name or email.

		if (query) {
			const lowercaseQuery = query.toLowerCase();
			filteredData = filteredData.filter((invoice) => {
				return invoice.data.some((cell) => {
					return cell?.toString()?.toLowerCase()?.includes(lowercaseQuery);
				});
			});
		}

		setFilteredInvoiceData(filteredData);
	};

	const generatePdf1 = (invoices, owner) => {
		// Convert the invoices array to a JSON string
		const invoicesJson = JSON.stringify(invoices);
		const ownerJson = JSON.stringify(owner);

		// Encode the JSON string to include it in the URL as a query parameter
		const encodedInvoices = encodeURIComponent(invoicesJson);
		const encodedOwner = encodeURIComponent(ownerJson);

		// Navigate to the route with the encoded invoices as a query parameter
		navigate(`/Bill?invoices=${encodedInvoices}&owner=${encodedOwner}`);
	};

	useEffect(() => {
		filterInvoiceData(selectedInvoice, searchQuery);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedInvoice, searchQuery, invoiceData]);

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			filteredInvoiceData.map((invoice) => {
				const row = {
					"Invoice Id": invoice.data[0],
					"Owner Name": invoice.data[1],
					"Owner Email Id": invoice.data[2],
					"Invoice Date": invoice.data[3],
					"Invoice Amount": invoice.data[4],
					Status: invoice.status,
				};
				return row;
			})
		);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
		XLSX.writeFile(workbook, "invoices.xlsx");
	};

	useEffect(() => {
		dispatch(getAllInvoices());
		dispatch(getIndividualInvoices());
	}, []);

	useEffect(() => {
		if (invoices) {
			// console.log(invoices);
			const data = invoices.map((invoice, idx) => {
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
			setInvoiceData(data);
			setFilteredInvoiceData(data);
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
							<Select
								className="filter"
								defaultValue={analyticsFilterOptions[0]}
								options={analyticsFilterOptions}
								components={{ DropdownIndicator }}
								styles={customStyles}
							/>
						</section>
						<section className="invoice_widget_container">
							<WidgetItem designation="All Invoices" value={allinvoices?.length ? allinvoices?.length : 0} />
							<WidgetItem designation="Unpaid Invoices" value={allinvoices?.filter((i) => i.status !== "paid")?.length || 2} />
							<WidgetItem designation="Paid Invoices" value={allinvoices?.filter((i) => i.status === "paid")?.length || 0} />
						</section>
						<TableContainer className="invoice_table_container">
							<TableHeading>
								<h5>All Invoices</h5>
								<div className="invoice_options">
									<button onClick={() => setIsOpen((curr) => !curr)}>
										Create Invoice <FaPlus />
									</button>
								</div>
							</TableHeading>
							<TableHeading className="invoice_functionality">
								<div className="invoice_functionality_sort">
									<h4 className={selectedInvoice === "all" ? "selected_invoice" : ""} onClick={() => setSelectedInvoice("all")}>
										All Invoices
									</h4>
									{/* <h4
										className={selectedInvoice === "pending" ? "selected_invoice" : ""}
										onClick={() => setSelectedInvoice("pending")}
									>
										Pending
									</h4> */}
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
											placeholder="Search by Email, Name"
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
	const [showDropdown, setShowDropdown] = useState(false);
	const [selectedOption, setSelectedOption] = useState(1);

	const handleDropdownClick = () => {
		setShowDropdown(!showDropdown);
	};

	const closeDropdown = (e) => {
		if (e.target.id === "svg") {
			return;
		}
		setShowDropdown(false);
	};

	useEffect(() => {
		setShowDropdown(false);
	}, [selectedOption]);

	return (
		<article className="invoice_widget" onClick={closeDropdown}>
			<div className="invoice_widget_header">
				<span>
					<svg width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 19L15 17L12 19L9 17L6 19L3 17L0 19V0H18V19Z" fill="#029E9D" />
					</svg>
					{designation}
				</span>
				<BsThreeDotsVertical id="svg" onClick={handleDropdownClick} />
				{showDropdown && (
					<div className="dropdown-menu">
						{/* Dropdown items */}
						<div
							style={selectedOption === 1 ? { backgroundColor: "#d70372" } : { backgroundColor: "white" }}
							onClick={() => {
								setSelectedOption(1);
							}}
						>
							Option 1
						</div>
						<div
							style={selectedOption === 2 ? { backgroundColor: "#d70372" } : { backgroundColor: "white" }}
							onClick={() => {
								setSelectedOption(2);
							}}
						>
							Option 2
						</div>
						<div
							style={selectedOption === 3 ? { backgroundColor: "#d70372" } : { backgroundColor: "white" }}
							onClick={() => {
								setSelectedOption(3);
							}}
						>
							Option 3
						</div>
					</div>
				)}
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
