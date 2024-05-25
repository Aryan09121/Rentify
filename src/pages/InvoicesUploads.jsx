/* eslint-disable react-hooks/exhaustive-deps */
import { IoIosArrowDown } from "react-icons/io";
import Select, { components } from "react-select";
import { AdminSidebar, Bar } from "../components";
import readXlsxFile from "read-excel-file";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { handleTripsInvoices } from "../redux/actions/uploads.action";
import { getAllCompanies } from "../redux/actions/company.action";

const expectedHiringHeaders = [
	"S No",
	"District",
	"Vehicle Reg.No",
	"Make",
	"Model",
	"Year",
	"FRV Code",
	"Month",
	"Start Date",
	"End Date",
	"Total Day",
	"OFF ROAD DAY",
	"FINAL Qty",
	"Unit",
	"Rate",
	"Amount",
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
		width: "100%",
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
		width: "100%",
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

const expectedMaintainaceHeaders = [
	"S No",
	"District",
	"Vehicle Reg.No",
	"Make",
	"Model",
	"Year",
	"FRV Code",
	"Month",
	"Start Km",
	"End Km",
	"Qty",
	"Unit",
	"Rate",
	"Amount",
];

const expectedVendorsHeaders = [
	"S No",
	"District",
	"Vehicle Reg.No",
	"Make",
	"Model",
	"Year",
	"FRV Code",
	"Month",
	"Start Date",
	"End Date",
	"Total Day",
	"OFF ROAD DAY",
	"FINAL Qty",
	"Unit",
	"Rate",
	"Amount",
];

const hiringFieldMapping = (row) => ({
	district: row[1],
	registrationNo: row[2],
	make: row[3],
	model: row[4],
	year: row[5],
	frvCode: row[6],
	month: row[7],
	startDate: row[8],
	endDate: row[9],
	totalDays: row[10],
	offroad: row[11],
	finalQty: row[12],
	unit: row[13],
	rate: row[14],
	amount: row[15],
});

const maintainanceFieldMapping = (row) => ({
	district: row[1],
	registrationNo: row[2],
	make: row[3],
	model: row[4],
	year: row[5],
	frvCode: row[6],
	month: row[7],
	startKm: row[8],
	endKm: row[9],
	qty: row[10],
	unit: row[11],
	rate: row[12],
	amount: row[13],
});

const vendorsFieldMapping = (row) => ({
	district: row[1],
	registrationNo: row[2],
	make: row[3],
	model: row[4],
	year: row[5],
	frvCode: row[6],
	month: row[7],
	startDate: row[8],
	endDate: row[9],
	totalDays: row[10],
	offroad: row[11],
	finalQty: row[12],
	unit: row[13],
	rate: row[14],
	amount: row[15],
});

const readExcelFile = async (file, expectedHeaders, fieldMapping) => {
	try {
		const rows = await readXlsxFile(file);
		const headers = rows[0];
		const headersLower = headers.map((header) => header.toLowerCase());
		const arraysAreEqual =
			expectedHeaders.length === headersLower.length &&
			expectedHeaders.every((value, index) => {
				return value.toLowerCase() === headersLower[index];
			});

		if (!arraysAreEqual) {
			throw new Error("Invalid File Format");
		}

		const data = rows.slice(1).map(fieldMapping);

		return data;
	} catch (error) {
		toast.error(error.message);
		throw error;
	}
};

const InvoicesUploads = () => {
	const [hiring, setHiring] = useState([]);
	const [maintainance, setMaintainance] = useState([]);
	const [vendors, setVendors] = useState([]);
	const [combinedData, setCombinedData] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState("");
	const { companies } = useSelector((state) => state.company);
	const [companyOptions, setCompanyOptions] = useState([]);
	const [analysis, setAnalysis] = useState({});
	const { message, error } = useSelector((state) => state.uploads);
	const dispatch = useDispatch();

	const handleFileUpload = async (event, expectedHeaders, fieldMapping, setMonthlyData) => {
		const file = event.target.files[0];
		try {
			const monthlyData = await readExcelFile(file, expectedHeaders, fieldMapping);
			setMonthlyData(monthlyData);
			toast.success(`${expectedHeaders[2].split(" ")[0]} Data Reads Successfully`);
		} catch (error) {
			console.error(`Error reading ${expectedHeaders[2].split(" ")[0]} Excel file:`, error);
		}
		event.target.value = null;
	};

	const combineData = (hiring, maintenance, vendors) => {
		const combinedData = [];

		for (let i = 0; i < hiring.length; i++) {
			const trip = hiring[i];
			const maintainanceTrip = maintenance[i] || {}; // If there's no corresponding maintenance trip, use an empty object
			const vendorsTrip = vendors[i] || {}; // If there's no corresponding vendors trip, use an empty object

			// Destructure hiring trip data
			const {
				district,
				registrationNo,
				make: brand,
				model,
				year,
				frvCode,
				month,
				startDate,
				endDate,
				totalDays: days,
				offroad,
				finalQty: totalDays,
				rate: dayRate,
				amount: dayAmount,
			} = trip;

			// Destructure maintainance trip data
			const { startKm, endKm, qty: totalKm, rate: kmRate, amount: kmAmount } = maintainanceTrip;

			// Destructure vendors trip data
			const { rate: rent, make: owner, amount: ownerAmount } = vendorsTrip;

			// Construct combined data object
			const combinedTrip = {
				district,
				registrationNo,
				owner,
				brand,
				model,
				year,
				frvCode,
				month,
				startDate,
				endDate,
				startKm,
				endKm,
				days,
				offroad,
				totalDays,
				totalKm,
				rate: { date: dayRate, km: kmRate },
				rent,
				dayAmount,
				kmAmount,
				ownerAmount,
				company: selectedCompany,
			};

			combinedData.push(combinedTrip);
		}

		// Set combined data and calculate analysis
		setCombinedData(combinedData);
		const analysis = calculateAnalysis(combinedData);
		setAnalysis(analysis);
	};

	const calculateAnalysis = (data) => {
		// Define variables for calculations
		const totalKmTraveled = data.reduce((sum, trip) => sum + (trip.totalKm || 0), 0);
		const totalAmount = data.reduce((sum, trip) => sum + (trip.dayAmount || 0) + (trip.kmAmount || 0) + (trip.ownerAmount || 0), 0);
		const uniqueVehicles = new Set(data.map((trip) => trip.registrationNo)).size;

		// console.log(data);
		// District-wise, Owner-wise, Company-wise statistics
		const carStats = {};

		data.forEach((trip) => {
			// District-wise

			// Car-wise
			if (!carStats[trip.registrationNo]) {
				carStats[trip.registrationNo] = {
					totalKmTraveled: 0,
					totalAmount: 0,
					trips: [],
					totalDays: 0,
					rent: 0,
					offroad: 0,
					ownerAmount: 0,
					companyId: "",
				};
			}
			carStats[trip.registrationNo].totalKmTraveled += trip.totalKm || 0;
			carStats[trip.registrationNo].totalAmount += (trip.dayAmount || 0) + (trip.kmAmount || 0) + (trip.ownerAmount || 0);
			carStats[trip.registrationNo].totalDays += trip.totalDays || 0;
			carStats[trip.registrationNo].rent = trip.rent || 0;
			carStats[trip.registrationNo].offroad = trip.offroad || 0;
			carStats[trip.registrationNo].ownerAmount += trip.ownerAmount || 0;
			carStats[trip.registrationNo].trips.push(trip);
			carStats[trip.registrationNo].companyId = trip.company;
		});

		return {
			totalKmTraveled,
			totalAmount,
			uniqueVehicles,
			carStats,
		};
	};

	const SubmitHandler = (e) => {
		e.preventDefault();
		if (Object.keys(analysis).length !== 0) {
			dispatch(handleTripsInvoices(analysis));
		} else {
			toast.error("Please uploads the neccessary files");
		}
	};

	useEffect(() => {
		if (hiring.length > 0 && maintainance.length > 0 && vendors.length > 0) {
			combineData(hiring, maintainance, vendors);
		}
	}, [hiring, hiring.length, maintainance, maintainance.length, vendors, vendors.length]);

	useEffect(() => {
		if (analysis) {
			console.log(analysis);
		}
	}, [analysis]);

	useEffect(() => {
		dispatch(getAllCompanies());
	}, []);

	useEffect(() => {
		if (companies?.length > 0) {
			const options = companies.map((company) => ({
				value: company._id,
				label: company.name,
			}));
			setCompanyOptions(options);
		}
	}, [companies]);

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

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="addNewForm">
				<Bar />
				<h2>Excel Data Upload</h2>
				<section className="newOwnerFormContainer">
					<div className="formContainer">
						<section className="documentUploader">
							<h2 style={{ textAlign: "center" }}>Invoice Generation</h2>
							<h3>Select Hiring&apos;s Data File to Select Cars</h3>
							<Select
								className="filter"
								defaultValue={companyOptions[0]}
								options={companyOptions}
								components={{ DropdownIndicator }}
								styles={customStyles}
								id="company"
								onChange={(e) => {
									setSelectedCompany(e.value);
								}}
							/>
							<input type="file" onChange={(e) => handleFileUpload(e, expectedHiringHeaders, hiringFieldMapping, setHiring)} />
							<h3>Choose Maintainance file</h3>
							<input
								type="file"
								onChange={(e) => handleFileUpload(e, expectedMaintainaceHeaders, maintainanceFieldMapping, setMaintainance)}
							/>
							<h3>Choose Vendors file</h3>
							<input type="file" onChange={(e) => handleFileUpload(e, expectedVendorsHeaders, vendorsFieldMapping, setVendors)} />
							<button onClick={SubmitHandler}>Add Cars</button>
						</section>
					</div>
				</section>
			</main>
		</div>
	);
};

export default InvoicesUploads;
