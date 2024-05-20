/* eslint-disable no-unused-vars */
import { AdminSidebar } from "../components";
import TableSearchTOC from "../components/TableSearchHOC";
import Bar from "../components/CarBar";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { IoIosArrowDown } from "react-icons/io";
import { getVendorsInvoices } from "../redux/actions/invoice.action";
import { getGst } from "../redux/actions/setting.action";
import * as XLSX from "xlsx";

const columns = [
	{ Header: "S No.", accessor: "sno" },
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
		fontSize: "1rem",
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
	const { vendorInvoices } = useSelector((state) => state.invoice);
	const { gst } = useSelector((state) => state.settings);
	const [invdata, setInvdata] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [monthOptions, setMonthOptions] = useState([]);
	const dispatch = useDispatch();

	const handleSearch = (e) => setQuery(e.target.value);

	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(
			invdata.map((invoice) => {
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
					"Total Days": invoice.qty,
					"Offorad Days": invoice.offroad,
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
		dispatch(getVendorsInvoices());
		dispatch(getGst());
	}, [dispatch]);

	useEffect(() => {
		if (vendorInvoices?.length > 0) {
			const data = vendorInvoices.map((inv, idx) => {
				const totalDays = inv?.dayQty - inv?.offroad;
				const subTotal = totalDays * inv?.car?.rent;
				const gstAmount = (subTotal * gst) / 100;
				const totalAmount = fixed(subTotal + gstAmount);
				return {
					sno: inv?.invoiceId,
					district: inv?.trip?.district,
					registrationno: inv?.car?.registrationNo,
					make: inv?.owner?.name,
					model: inv?.car?.model,
					year: new Date(inv?.invoiceDate).getFullYear(),
					frv: inv?.trip?.frvCode,
					month: extractYearMonthInWords(inv?.invoiceDate).month + "-" + extractYearMonthInWords(inv?.invoiceDate).year,
					start: formatDate(inv?.from),
					end: formatDate(inv?.to),
					qty: inv?.dayQty,
					offroad: inv?.offroad,
					final: totalDays,
					unit: "Day",
					rate: inv?.car?.rent,
					amount: totalAmount,
				};
			});
			const uniqueMonths = [...new Set(data.map((inv) => inv.month))];
			const options = uniqueMonths.map((month) => ({ value: month, label: month })).reverse();
			options.unshift({ value: "", label: "Select Month" }); // Add default label
			setMonthOptions(options);
			setSelectedMonth(options[0]?.value || "");
			setInvdata(data);
			setFilteredData(data.filter((item) => item.month.toLowerCase().includes(options[0]?.value.toLowerCase())));
		}
	}, [vendorInvoices, gst]);

	useEffect(() => {
		if (selectedMonth) {
			const filteredData = invdata.filter((item) => item.month.toLowerCase().includes(selectedMonth.toLowerCase()));
			setFilteredData(filteredData);
		}
	}, [selectedMonth, invdata]);

	useEffect(() => {
		const filteredData = invdata.filter(
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
		setFilteredData(filteredData);
	}, [query, invdata]);

	const Table = useCallback(
		TableSearchTOC(columns, query || selectedMonth ? filteredData.reverse() : invdata.reverse(), "dashboard-product-box", "", true, 50),
		[filteredData]
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
						options={monthOptions}
						value={monthOptions.find((option) => option.value === selectedMonth)}
						components={{ DropdownIndicator }}
						styles={customStyles}
						onChange={(e) => setSelectedMonth(e.value)}
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
