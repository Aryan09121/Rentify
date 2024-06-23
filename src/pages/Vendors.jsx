/* eslint-disable no-unused-vars */
import { AdminSidebar, Loader } from "../components";
import TableSearchTOC from "../components/TableSearchHOC";
import Bar from "../components/CarBar";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { IoIosArrowDown } from "react-icons/io";
import { getAllInvoices, getVendorsInvoices } from "../redux/actions/invoice.action";
import { getGst } from "../redux/actions/setting.action";
import * as XLSX from "xlsx";

const columns = [
	// { Header: "S No.", accessor: "sno" },
	{ Header: "District", accessor: "district" },
	{ Header: "Vehicle Reg.no", accessor: "registrationno" },
	{ Header: "Make", accessor: "make" },
	{ Header: "Model", accessor: "model" },
	{ Header: "Year", accessor: "year" },
	{ Header: "FRV Code", accessor: "frv" },
	{ Header: "Month", accessor: "month" },
	{ Header: "Start Date", accessor: "start" },
	{ Header: "End Date", accessor: "end" },
	{ Header: "Total Days", accessor: "qty" },
	{ Header: "Offorad Days", accessor: "offroad" },
	{ Header: "Final Qty", accessor: "final" },
	{ Header: "Unit", accessor: "unit" },
	{ Header: "Rate", accessor: "rate" },
	{ Header: "Amount", accessor: "amount" },
];

const DropdownIndicator = (props) => (
	<components.DropdownIndicator {...props}>
		<IoIosArrowDown />
	</components.DropdownIndicator>
);

const customStyles = {
	control: (provided) => ({
		...provided,
		cursor: "pointer",
		width: "150px",
		marginLeft: "auto",
		marginRight: "2rem",
		backgroundColor: "#fff",
		fontSize: ".8rem",
		transition: "all 0.3s ease-in-out",
		border: "2.5px solid rgb(2, 158, 157)",
		outline: "none",
		"&:hover, &:focus": {
			backgroundColor: "#fff",
			color: "rgb(2, 158, 157)",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.1rem",
		outline: "none",
		borderRadius: "10px",
		fontSize: ".8rem",
		marginRight: "2rem",
		width: "fit-content",
		opacity: "0.8",
		transition: "all 0.3s ease-in-out",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#000",
		width: "fit-content",
		fontSize: ".8rem",
		fontSize: "1rem",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
};

function formatDate(date) {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const year = date.getFullYear();
	const month = date.getMonth();
	const day = date.getDate();
	return `${day} ${months[month]} ${year}`;
}

function extractYearMonthInWords(dateString) {
	const date = new Date(dateString);
	const year = date.getFullYear();
	const month = date.toLocaleString("default", { month: "long" });
	return { year, month };
}

const fixed = (n) => parseFloat(Number(n).toFixed(2));

const Vendors = () => {
	const [query, setQuery] = useState("");
	const [selectedMonth, setSelectedMonth] = useState("");
	const { invoices, loading } = useSelector((state) => state.invoice);
	const { gst } = useSelector((state) => state.settings);
	const [invdata, setInvdata] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [dateOptions, setDateOptions] = useState([]);
	const dispatch = useDispatch();

	const handleSearch = (e) => setQuery(e.target.value);

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			filteredData.map((invoice, index) => {
				const row = {
					"S No.": index + 1,
					District: invoice.district,
					"Vehicle Reg. No": invoice.registrationno,
					Make: invoice.make,
					Model: invoice.model,
					Year: invoice.year,
					"FRV Code": invoice.frv,
					Month: invoice.month,
					"Start Date": invoice.start,
					"End Date": invoice.end,
					"Total Days": invoice.qty,
					"Offroad Days": invoice.offroad,
					"Final Qty": invoice.final,
					Unit: invoice.unit,
					Rate: invoice.rate,
					Amount: invoice.amount,
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
		dispatch(getGst());
	}, [dispatch]);

	useEffect(() => {
		if (invoices && invoices.length > 0) {
			const dateSet = new Set();
			const allData = [];

			const data = invoices.reduce((acc, invoice, index) => {
				for (const invoicedata of invoice.months) {
					if (invoicedata.car.registrationNo === "MP04CT1234") {
						console.log(invoicedata);
					}
					const date = new Date(invoicedata.invoiceDate).toISOString().split("T")[0]; // Format the date as 'YYYY-MM-DD'
					if (!acc[date]) {
						acc[date] = [];
					}

					const formattedData = {
						sno: index + 1,
						district: invoicedata.district,
						registrationno: invoice.car.registrationNo,
						make: invoice.owner.name,
						model: invoice.car.model,
						year: invoice.car.year,
						frv: invoicedata.frvCode,
						month: `${new Date(invoicedata.invoiceDate).toLocaleString("default", { month: "long" })} ${new Date(
							invoicedata.invoiceDate
						).getFullYear()}`,
						start: formatDate(invoicedata.startDate),
						end: formatDate(invoicedata.endDate),
						qty: invoicedata.days,
						offroad: invoicedata.offroad,
						final: invoicedata?.totalDays,
						unit: "Days",
						rate: invoicedata?.rent,
						amount: fixed(invoicedata.rent * invoicedata.totalDays),
					};

					acc[date].push(formattedData);
					dateSet.add(date); // Collect unique dates
					allData.push(formattedData);
				}
				return acc;
			}, {});
			console.log(allData);
			setInvdata(allData);
			setFilteredData(allData);
			setDateOptions(
				Array.from(dateSet).map((date) => ({
					label: new Date(date).toLocaleString("default", { month: "long" }) + " " + new Date(date).getFullYear(),
					value: new Date(date).toLocaleString("default", { month: "long" }) + " " + new Date(date).getFullYear(),
				}))
			);
		}
	}, [invoices]);

	useEffect(() => {
		if (selectedMonth) {
			const filteredData = invdata.filter((item) => {
				return item.month.toLowerCase().includes(selectedMonth.toLowerCase());
			});
			setFilteredData(filteredData);
		} else {
			setFilteredData(invdata);
		}
	}, [selectedMonth, invdata]);

	useEffect(() => {
		const filteredData = invdata.filter(
			(item) =>
				item?.district?.toLowerCase().includes(query.toLowerCase()) ||
				item?.registrationno.toLowerCase().includes(query.toLowerCase()) ||
				item?.make?.toLowerCase()?.includes(query.toLowerCase()) ||
				item?.model?.toLowerCase()?.includes(query.toLowerCase()) ||
				item?.year?.toString()?.toLowerCase().includes(query.toLowerCase()) ||
				item?.frv?.toLowerCase()?.includes(query.toLowerCase()) ||
				item?.month?.toLowerCase()?.includes(query.toLowerCase()) ||
				item?.start?.toLowerCase()?.includes(query.toLowerCase()) ||
				item?.end?.toLowerCase()?.includes(query.toLowerCase()) ||
				item?.qty?.toString()?.toLowerCase().includes(query.toLowerCase()) ||
				item?.unit?.toLowerCase()?.includes(query.toLowerCase()) ||
				item?.rate?.toString()?.toLowerCase().includes(query.toLowerCase())
		);
		console.log(filteredData);
		setFilteredData(filteredData);
	}, [query, invdata]);

	// const Table = useCallback(() => {
	// 	return TableSearchTOC(columns, query || selectedMonth ? filteredData : invdata, "dashboard-product-box", "", true, 50);
	// }, [query, selectedMonth, filteredData, invdata]);

	const Table = useCallback(
		TableSearchTOC(columns, loading ? [{ sno: 1 }] : query || selectedMonth ? filteredData : invdata, "dashboard-product-box", "", true, 50),
		[query, selectedMonth, filteredData, invdata]
	);

	return (
		<section className="admin-container">
			<AdminSidebar />
			<main className="searchCars">
				<Bar query={query} handleSearch={handleSearch} />
				<h2 style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
					Perfect Vendor Payment Month of Oct 2024
					<Select
						className="filter"
						options={dateOptions}
						value={dateOptions.find((option) => option.value === selectedMonth)}
						components={{ DropdownIndicator }}
						styles={customStyles}
						onChange={(e) =>
							setSelectedMonth(`${new Date(e.value).toLocaleString("default", { month: "long" })} ${new Date(e.value).getFullYear()}`)
						}
					/>
				</h2>
				{Table()}
				<div>
					<button onClick={exportToExcel}>Export to Excel</button>
				</div>
			</main>
		</section>
	);
};

export default Vendors;
