/* eslint-disable no-unused-vars */
import { AdminSidebar, Loader, TxtLoader } from "../components";
import TableSearchTOC from "../components/TableSearchHOC";
import Bar from "../components/CarBar";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { getIndividualInvoices } from "../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { IoIosArrowDown } from "react-icons/io";
import { payAllCompanyInvoices } from "../redux/actions/invoice.action";
import { toast } from "react-toastify";

const columns = [
	{
		Header: "S No.",
		accessor: "sno",
	},
	{
		Header: "District",
		accessor: "district",
	},
	{
		Header: "Vehicle Reg.no",
		accessor: "registrationno",
	},
	{
		Header: "Make",
		accessor: "make",
	},
	{
		Header: "Model",
		accessor: "model",
	},
	{
		Header: "Year",
		accessor: "year",
	},
	{
		Header: "FRV CODE",
		accessor: "frv",
	},
	{
		Header: "Month",
		accessor: "month",
	},
	{
		Header: "Start",
		accessor: "start",
	},
	{
		Header: "End",
		accessor: "end",
	},
	{
		Header: "Qty",
		accessor: "qty",
	},
	{
		Header: "Unit",
		accessor: "unit",
	},
	{
		Header: "Rate",
		accessor: "rate",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
];

const unitOptions = [
	{ value: "date", label: "DATE" },
	{ value: "km", label: "KM" },
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
		width: "150px",
		marginLeft: "auto",
		marginRight: "2rem",
		backgroundColor: "#fff",
		transition: "all 0.3s ease-in-out",
		border: "2.5px solid rgb(2, 158, 157)",
		Outline: "none",
		"&:hover, &:focus": {
			backgroundColor: "#fff",
			// padding: "0.2rem",
			color: "rgb(2, 158, 157)",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.1rem",
		Outline: "none",
		borderRadius: "10px",
		fontSize: "1rem",
		marginRight: "2rem",
		width: "fit-content",
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
		width: "fit-content",
		fontSize: "1rem",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
};

function formatDate(date) {
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

	// Format the date
	const formattedDate = `${day}, ${months[month]}, ${year}`;

	return formattedDate;
}

function extractYearMonthInWords(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	// Add 1 to month since getMonth() returns zero-based index
	const month = date.toLocaleString("default", { month: "long" });
	return { year, month };
}

const fixed = (n) => parseFloat(Number(n).toFixed(2));
const SearchCars = () => {
	const [query, setQuery] = useState("");
	const [unit, setUnit] = useState("date");
	const [headers, setHeaders] = useState([
		{
			Header: "S No.",
			accessor: "sno",
		},
		{
			Header: "District",
			accessor: "district",
		},
		{
			Header: "Vehicle Reg.no",
			accessor: "registrationno",
		},
		{
			Header: "Make",
			accessor: "make",
		},
		{
			Header: "Model",
			accessor: "model",
		},
		{
			Header: "Year",
			accessor: "year",
		},
		{
			Header: "FRV CODE",
			accessor: "frv",
		},
		{
			Header: "Month",
			accessor: "month",
		},
		{
			Header: "Start",
			accessor: "start",
		},
		{
			Header: "End",
			accessor: "end",
		},
		{
			Header: "Total Day",
			accessor: "days",
		},
		{
			Header: "OFF ROAD DAY",
			accessor: "offroad",
		},
		{
			Header: "FINAL Qty",
			accessor: "finaldays",
		},
		{
			Header: "Unit",
			accessor: "unit",
		},
		{
			Header: "Rate",
			accessor: "rate",
		},
		{
			Header: "Amount",
			accessor: "amount",
		},
	]);
	const [allinvoices, setAllinvoices] = useState([]);
	const { loading, message, error } = useSelector((state) => state.invoice);
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const invoicesArray = searchParams.get("invoices");

	const [data, setData] = useState([]);

	const handleSearch = (e) => {
		const searchTerm = e.target.value;
		setQuery(searchTerm);
	};

	const handleRowClick = (row) => {
		// Access _id property from the row's original data and redirect to the desired page
		const { invoice } = row.original;

		navigate(`/charges/details?id=${invoice._id}`);
	};

	const payBill = () => {
		const companyId = allinvoices.companyId;
		const month = allinvoices.data[3];
		dispatch(payAllCompanyInvoices(companyId, month));
	};

	const exportToExcel = (type) => {
		let worksheet;
		if (type === "date") {
			worksheet = XLSX.utils.json_to_sheet(
				data.map((invoice) => {
					console.log(invoice);
					const row = {
						"Invoice Id": invoice?.sno,
						District: invoice.district,
						"Vehicle Reg. No": invoice.registrationno,
						Make: invoice.make,
						Model: invoice.model,
						Year: invoice.year,
						"Frv Code": invoice.frv,
						Month: invoice.month,
						"Start Date": invoice.start,
						"End Date": invoice.end,
						"Total Days": invoice.totaldays,
						"Offorad Days": invoice.offroad,
						"Final Qty": invoice.final,
						Unit: invoice.unit,
						Rate: invoice.rate,
						Amount: invoice.amount,
					};
					return row;
				})
			);
		} else {
			worksheet = XLSX.utils.json_to_sheet(
				data.map((invoice) => {
					console.log(invoice);
					const row = {
						"Invoice Id": invoice?.sno,
						District: invoice.district,
						"Vehicle Reg. No": invoice.registrationno,
						Make: invoice.make,
						Model: invoice.model,
						Year: invoice.year,
						"Frv Code": invoice.frv,
						Month: invoice.month,
						"Start Km": invoice.start,
						"End Km": invoice.end,
						"Total Km": invoice.qty,
						Unit: invoice.unit,
						Rate: invoice.rate,
						Amount: invoice.amount,
					};
					return row;
				})
			);
		}
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
		XLSX.writeFile(workbook, "invoices.xlsx");
	};

	useEffect(() => {
		const filteredData = data?.filter(
			(item) =>
				item.district.toLowerCase().includes(query.toLowerCase()) ||
				item.registrationno.toLowerCase().includes(query.toLowerCase()) ||
				item.make.toLowerCase().includes(query.toLowerCase()) ||
				item.model.toLowerCase().includes(query.toLowerCase()) ||
				item.year.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.frv.toLowerCase().includes(query.toLowerCase()) ||
				item.month.toLowerCase().includes(query.toLowerCase()) ||
				item.start.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.end.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.qty.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.unit.toLowerCase().includes(query.toLowerCase()) ||
				item.rate.toString().toLowerCase().includes(query.toLowerCase())
		);
		setData(filteredData);
	}, [query]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const Table = useCallback(TableSearchTOC(headers, loading ? [] : data, "dashboard-product-box", "", true, 50, handleRowClick), [data, headers]);

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

	useEffect(() => {
		if (invoicesArray.length > 0) {
			const decodedInvoices = invoicesArray ? JSON.parse(decodeURIComponent(invoicesArray)) : [];
			console.log(decodedInvoices);
			setAllinvoices(decodedInvoices);
		}
	}, [invoicesArray]);

	useEffect(() => {
		if (allinvoices?.invoices?.length > 0) {
			const data = allinvoices?.invoices?.map((inv, idx) => {
				const { year, month } = extractYearMonthInWords(inv.invoiceDate);
				return {
					_id: inv?.carId,
					invoice: inv,
					sno: idx + 1,
					district: inv?.district,
					registrationno: inv?.registrationNo,
					make: inv?.brand,
					model: inv?.model,
					year: inv?.year,
					frv: inv?.frvCode,
					month: inv?.month,
					start: `${inv?.startKm} km`,
					startdate: formatDate(inv?.startDate),
					end: `${inv?.endKm} km`,
					enddate: formatDate(inv?.endDate),
					qty: inv?.endKm - inv?.startKm,
					totaldays: inv?.days,
					offroad: inv?.offroad,
					final: inv?.totalDays,
					unit: unit,
					rate: unit === "km" ? inv?.rate?.km : inv?.rate?.date,
					amount: unit === "km" ? inv?.kmAmount : fixed(inv?.rate?.date * inv?.totalDays),
				};
			});

			// Create a copy of data with original sno order
			const sortedData = data.filter((item) => item !== null).map((item) => ({ ...item }));

			// Sort the copied array based on model
			sortedData?.sort((a, b) => a?.model?.localeCompare(b?.model));

			// Update sno property to maintain original order
			sortedData?.forEach((item, idx) => {
				item.sno = idx + 1;
			});
			let columns;
			if (unit === "km") {
				columns = [
					{
						Header: "S No.",
						accessor: "sno",
					},
					{
						Header: "District",
						accessor: "district",
					},
					{
						Header: "Vehicle Reg.no",
						accessor: "registrationno",
					},
					{
						Header: "Make",
						accessor: "make",
					},
					{
						Header: "Model",
						accessor: "model",
					},
					{
						Header: "Year",
						accessor: "year",
					},
					{
						Header: "FRV CODE",
						accessor: "frv",
					},
					{
						Header: "Month",
						accessor: "month",
					},
					{
						Header: "Start Km",
						accessor: "start",
					},
					{
						Header: "End Km",
						accessor: "end",
					},
					{
						Header: "Qty",
						accessor: "qty",
					},
					{
						Header: "Unit",
						accessor: "unit",
					},
					{
						Header: "Rate",
						accessor: "rate",
					},
					{
						Header: "Amount",
						accessor: "amount",
					},
				];
			} else {
				columns = [
					{
						Header: "S No.",
						accessor: "sno",
					},
					{
						Header: "District",
						accessor: "district",
					},
					{
						Header: "Vehicle Reg.no",
						accessor: "registrationno",
					},
					{
						Header: "Make",
						accessor: "make",
					},
					{
						Header: "Model",
						accessor: "model",
					},
					{
						Header: "Year",
						accessor: "year",
					},
					{
						Header: "FRV CODE",
						accessor: "frv",
					},
					{
						Header: "Month",
						accessor: "month",
					},
					{
						Header: "Start Date",
						accessor: "startdate",
					},
					{
						Header: "End Date",
						accessor: "enddate",
					},
					{
						Header: "Total Day",
						accessor: "totaldays",
					},
					{
						Header: "OFF ROAD DAY",
						accessor: "offroad",
					},
					{
						Header: "FINAL Qty",
						accessor: "final",
					},
					{
						Header: "Unit",
						accessor: "unit",
					},
					{
						Header: "Rate",
						accessor: "rate",
					},
					{
						Header: "Amount",
						accessor: "amount",
					},
				];
			}
			setHeaders(columns);

			setData(sortedData);
		}
	}, [allinvoices, unit]);

	return (
		<section className="admin-container">
			<AdminSidebar />
			<main className="searchCars">
				<Bar query={query} handleSearch={handleSearch} />

				<h2 style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
					{unit === "date" ? "Hiring Charges On Per Day Basis" : "Minor maintainance Charges On on actual KM reading Basis"}{" "}
					<Select
						className="filter"
						defaultValue={unitOptions[0]}
						options={unitOptions}
						components={{ DropdownIndicator }}
						styles={customStyles}
						onChange={(e) => {
							setUnit(e.value);
						}}
					/>
				</h2>

				{Table()}
				<div>
					<button onClick={() => exportToExcel(unit)}>Export to excel</button>
					<button disabled={loading} onClick={() => payBill(data)}>
						{loading ? "Loading..." : "Pay Bill"}
					</button>
				</div>
			</main>
		</section>
	);
};

export default SearchCars;
