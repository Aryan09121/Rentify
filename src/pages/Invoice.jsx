/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import { IoIosArrowDown } from "react-icons/io";
import Bar from "../components/Bar";
import Select, { components } from "react-select";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RowDefault, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "../components/TableHOC";
import { FaPlus, FaSearch, FaUpload } from "react-icons/fa";

const analyticsFilterOptions = [
	{ value: "month", label: "Monthly" },
	{ value: "all", label: "Annualy" },
];

const invoiceFilterOptions = [
	{ value: "", label: "Sort By" },
	{ value: "status", label: "Status" },
	{ value: "amount", label: "Amount" },
];

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoIosArrowDown />
		</components.DropdownIndicator>
	);
};

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

const invoiceData = [
	{
		data: ["43178", "Priyansh Dubey", "priyansh.dubey@gmail.com", "Febuary 06, 2021", "₹ 8367.00"],
		status: "paid",
		_id: 11218,
	},
	{
		data: ["43179", "Rahul Sen", "rahul.sen@gmail.com", "April 18, 2019", "₹ 4347.00"],
		status: "pending",
		_id: 11219,
	},
	{
		data: ["43176", "Himanshu Sahu", "sahu091@gmail.com", "June 23, 2018", "₹ 7456.00"],
		status: "pending",
		_id: 11220,
	},
	{
		data: ["43175", "Navjat Kaur", "navya.kaur@gmail.com", "January 22, 2011", "₹ 9474.00"],
		status: "unpaid",
		_id: 11221,
	},
	{
		data: ["43173", "Brij Sahu", "brij.sahu@gmail.com", "October 01, 2015", "₹ 9352.00"],
		status: "paid",
		_id: 11222,
	},
];

const Invoice = () => {
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="invoice">
				<Bar />
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
					<WidgetItem designation="All Invoices" value={283000} percent={2.8} />
					<WidgetItem designation="Draft" value={143} percent={2.8} />
					<WidgetItem designation="Paid Invoices" value={243} percent={-2.8} />
				</section>
				<TableContainer className="invoice_table_container">
					<TableHeading>
						<h5>All Invoices</h5>
						<div className="invoice_options">
							<Select
								defaultValue={invoiceFilterOptions[0]}
								options={invoiceFilterOptions}
								components={{ DropdownIndicator }}
								styles={customStyles}
							/>
							<button>
								Create Invoice <FaPlus />
							</button>
						</div>
					</TableHeading>
					<TableHeading className="invoice_functionality">
						<div className="invoice_functionality_sort">
							<h4>All Invoices</h4>
							<h4>Pending</h4>
							<h4>Paid Invoices</h4>
						</div>
						<div className="invoice_functionality_search">
							<button>
								<FaSearch />
								<input type="text" placeholder="Search by Email, Name" />
							</button>
							<button>
								<FaUpload />
								Export
							</button>
						</div>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${invoiceHeaders.length},1fr)` }} headers={invoiceHeaders} />
						<TableBody TableRow={RowDefault} data={invoiceData} />
					</Table>
				</TableContainer>
			</main>
		</div>
	);
};

const WidgetItem = ({ value, designation, percent }) => (
	<article className="invoice_widget">
		<div className="invoice_widget_header">
			<span>
				<svg width="18" height="19" viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 19L15 17L12 19L9 17L6 19L3 17L0 19V0H18V19Z" fill="#029E9D" />
				</svg>
				{designation}
			</span>
			<BsThreeDotsVertical />
		</div>
		<h2>{Math.abs(value)}</h2>
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
	</article>
);

export default Invoice;
