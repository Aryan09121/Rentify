/* eslint-disable react/prop-types */
import { FaAsterisk, FaSearch } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import readXlsxFile from "read-excel-file";
import Bar from "./Bar";
import { AssignRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { assignSingleTrip, assignTrip, getAllCars } from "../redux/actions";
import { getAllCompanies } from "../redux/actions/company.action";
import { IoIosArrowDown } from "react-icons/io";

const carsHeaders = ["S No", "Vehicle Reg No", "Car Brand", "Car Model", "Action"];

const AssignTrip = () => {
	const { allcars, message, error, loading } = useSelector((state) => state.car);
	const [query, setQuery] = useState("");
	const [carsdata, setCarsdata] = useState([]);
	const [tableCardata, setTableCardata] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const [isCarSelected, setIsCarSelected] = useState(false);
	const [selectedCar, setSelectedCar] = useState("");
	const [excelMode, setExcelMode] = useState(false);
	const dispatch = useDispatch();

	const searchCar = (e) => {
		const query = e.target.value; // Get the current value of the input field
		setQuery(query); // Update the state with the current query

		// Perform the search whenever the query changes
		const searchResult = carsdata.filter((item) => {
			// Convert all values in the data array to lowercase for case-insensitive search
			const lowercasedData = item.data.map((value) => String(value).toLowerCase());
			// Check if any value in the data array contains the search query
			return lowercasedData.some((value) => value.includes(query.toLowerCase()));
		});
		setSearchData(searchResult);
	};

	const assignTripHandler = (id) => {
		setSelectedCar(id);
		setIsCarSelected(true);
	};

	// useEffect(() => {
	// 	dispatch(getAllCars());
	// }, []);

	useEffect(() => {
		if (allcars) {
			const data = allcars.map((car, idx) => ({
				data: [idx + 1, car?.registrationNo, car?.brand, car?.model],
				action: <button onClick={() => assignTripHandler(car?.registrationNo)}>Assign Trip</button>,
				id: car._id,
			}));

			setCarsdata(data);
		}
	}, [allcars]);

	useEffect(() => {
		const data = carsdata.filter((car) => {
			// if (idx <= 9) {
			return { ...car };
			// }
		});
		setTableCardata(data);
	}, [carsdata]);

	useEffect(() => {
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
	}, [message, error, dispatch]);

	useEffect(() => {
		dispatch(getAllCars());
	}, []);

	return (
		<>
			{loading ? (
				<h2>Loading...</h2>
			) : (
				<div className="admin-container">
					<AdminSidebar />
					<main className="assignTrip">
						<Bar />
						<h2>Assign A Trip</h2>

						{!excelMode && !isCarSelected && (
							<>
								<button className="excelfile" onClick={() => setExcelMode(true)}>
									Read Excel File
								</button>
								<TableContainer className="carAssignTable">
									<TableHeading>
										<p>Choose Car</p>
										<button>
											<FaSearch />
											<input
												value={query}
												onChange={(e) => setQuery(e.target.value)}
												type="text"
												placeholder="Search By email or phone Number..."
												onKeyDown={searchCar}
											/>
										</button>
									</TableHeading>
									<Table>
										<TableHeaders headers={carsHeaders} style={{ gridTemplateColumns: `repeat(${carsHeaders.length},1fr)` }} />
										<TableBody TableRow={AssignRow} data={query ? searchData : tableCardata} />
									</Table>
								</TableContainer>
							</>
						)}
						{excelMode && !isCarSelected && <AssignExcel />}
						{isCarSelected && !excelMode && <AssignForm carId={selectedCar} />}
					</main>
				</div>
			)}
		</>
	);
};

export default AssignTrip;

const expectedTripHeaders = ["Vehicle Registration Number", "District", "FRV Code", "Start Date", "Start Km", "Company Name", "Year"];

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

const AssignForm = ({ carId }) => {
	const [trip, setTrip] = useState({
		registrationNo: "",
		year: new Date().getFullYear(),
		companyId: "",
		district: "",
		frvCode: "",
		start: { date: "", km: "" },
	});
	const [companyOptions, setCompanyOptions] = useState([]);
	const { companies } = useSelector((state) => state.company);
	const dispatch = useDispatch();

	const assignTripHandler = async (e) => {
		e.preventDefault();
		if (trip.district && trip.frvCode && trip.registrationNo && trip.companyId) {
			dispatch(assignSingleTrip(trip));
		} else {
			toast.error("All Fields Are Required");
		}
	};

	const onHandleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setTrip((curr) => {
			if (name === "km" || name === "date") {
				return {
					...curr,
					start: {
						...curr.start,
						[name]: value,
					},
				};
			}
			return {
				...curr,
				[name]: value,
			};
		});
	};

	useEffect(() => {
		dispatch(getAllCompanies());
		setTrip((curr) => {
			return {
				...curr,
				registrationNo: carId,
			};
		});
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

	return (
		<form className="assignform" onSubmit={assignTripHandler}>
			<div>
				<label htmlFor="district">
					District <FaAsterisk />
				</label>
				<input type="text" id="district" placeholder="District" name="district" value={trip.district} onChange={onHandleChange} />
			</div>
			<div>
				<label htmlFor="company">
					Select Company <FaAsterisk />
				</label>
				<Select
					className="filter"
					defaultValue={companyOptions[0]}
					options={companyOptions}
					components={{ DropdownIndicator }}
					styles={customStyles}
					id="company"
					onChange={(e) => {
						setTrip((curr) => {
							return {
								...curr,
								companyId: e.value,
							};
						});
					}}
				/>
			</div>
			<div>
				<label htmlFor="frvcode">
					FRV Code <FaAsterisk />
				</label>
				<input type="text" id="frvcode" placeholder="ex. ASK101" name="frvCode" value={trip.frvCode} onChange={onHandleChange} />
			</div>
			<div>
				<label htmlFor="year">Year</label>
				<input type="text" id="year" placeholder="ex. 2024" name="year" value={trip.year} onChange={onHandleChange} />
			</div>
			<div>
				<label htmlFor="startdate">Start Date</label>
				<input type="date" id="startdate" placeholder="Start Date" name="date" value={trip.start.date} onChange={onHandleChange} />
			</div>
			<div>
				<label htmlFor="startkm">Start Kilometers</label>
				<input type="text" id="startkm" placeholder="start Kilometers" name="km" value={trip.start.km} onChange={onHandleChange} />
			</div>
			<button type="submit">Assign Trip</button>
		</form>
	);
};

const AssignExcel = () => {
	const [trips, setTrips] = useState([]);
	const dispatch = useDispatch();
	const { message, error } = useSelector((state) => state.trip);

	const handleAssignTripFileChange = (event) => {
		const file = event.target.files[0];
		readTripDataFile(file);
		event.target.value = null;
	};

	const readTripDataFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary
				const tripHeaders = rows[0];
				const tripHeadersLower = tripHeaders.map((header) => header.toLowerCase());

				const tripData = rows.slice(1);

				const arraysAreEqual =
					expectedTripHeaders.length === tripHeadersLower.length &&
					expectedTripHeaders.every((value, index) => value.toLowerCase() === tripHeadersLower[index]);

				if (arraysAreEqual) {
					const newarr = tripData.map((data) => {
						return {
							registrationNo: data[0],
							district: data[1],
							frvCode: data[2],
							start: {
								date: data[3],
								km: data[4],
							},
							companyName: data[5],
						};
					});
					setTrips(newarr);
					return toast.success("Trip Data Read Successfully");
				} else {
					return toast.error("Invalid File Format");
				}
			})
			.catch((error) => {
				console.error("Error reading Owner Excel file:", error);
			});
	};

	const assignTripHandler = () => {
		if (trips) {
			dispatch(assignTrip(trips));
		} else {
			toast.error("please select the excel file first");
		}
	};

	useEffect(() => {
		if (message) {
			toast.success(message);
			dispatch({ type: "CLEAR_MESSAGES" });
		}
		if (error) {
			toast.error(error);
			dispatch({ type: "CLEAR_ERRORS" });
		}
	}, [error, message]);

	return (
		<div className="assignform">
			<div className="excelfilecontainer">
				<input type="file" onChange={handleAssignTripFileChange} />
				<h4>Upload Excel File</h4>
			</div>
			<button onClick={assignTripHandler}>Assign Trip</button>
		</div>
	);
};
