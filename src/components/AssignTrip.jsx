/* eslint-disable react/prop-types */
import { FaSearch } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";
import readXlsxFile from "read-excel-file";
import Bar from "./Bar";
import { AssignRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { assignSingleTrip, assignTrip, getAllCars } from "../redux/actions";

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

const expectedTripHeaders = ["Vehicle Registration Number", "District", "Year", "FRV Code", "Start Date", "Start Km"];

const AssignForm = ({ carId }) => {
	const [trip, setTrip] = useState({ registrationNo: "", district: "", year: "", frvCode: "", start: { date: "", km: "" } });
	const dispatch = useDispatch();

	const assignTripHandler = async (e) => {
		e.preventDefault();
		if (trip.district && trip.frvCode && trip.year && trip.registrationNo && trip.start.date && trip.start.km) {
			dispatch(assignSingleTrip(trip));
			toast.success("hii");
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
		setTrip((curr) => {
			return {
				...curr,
				registrationNo: carId,
			};
		});
	}, []);

	return (
		<form className="assignform" onSubmit={assignTripHandler}>
			<div>
				<label htmlFor="district">District</label>
				<input type="text" id="district" placeholder="District" name="district" value={trip.district} onChange={onHandleChange} />
			</div>
			<div>
				<label htmlFor="year">Year</label>
				<input type="number" id="year" placeholder="ex: 2024" name="year" value={trip.year} onChange={onHandleChange} />
			</div>
			<div>
				<label htmlFor="frvcode">FRV Code</label>
				<input type="text" id="frvcode" placeholder="ex. ASK101" name="frvCode" value={trip.frvCode} onChange={onHandleChange} />
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
							year: data[2],
							frvCode: data[3],
							start: {
								date: data[4],
								km: data[5],
							},
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
			{/*<div>
				<label htmlFor="district">District</label>
				<input type="text" id="district" placeholder="District" />
			</div>
			<div>
				<label htmlFor="year">Year</label>
				<input type="number" id="year" placeholder="ex: 2024" />
			</div>
			<div>
				<label htmlFor="frvcode">FRV Code</label>
				<input type="text" id="frvcode" placeholder="ex. ASK101" />
			</div>
			<div>
				<label htmlFor="startdate">Start Date</label>
				<input type="date" id="startdate" placeholder="Start Date" />
			</div>
			<div>
				<label htmlFor="startkm">Start Kilometers</label>
				<input type="text" id="startkm" placeholder="start Kilometers" />
			</div> */}
			<button onClick={assignTripHandler}>Assign Trip</button>
		</div>
	);
};
