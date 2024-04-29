/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { AssignRow, Table, TableBody, TableContainer, TableFooter, TableHeaders, TableHeading } from "./TableHOC";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllCars, generateInvoice } from "../redux/actions";

const carsHeaders = ["S No", "Vehicle Reg No", "Car Brand", "Car Model", "Action"];

function NewInvoice({ setIsOpen }) {
	const { allcars, message, error } = useSelector((state) => state.car);
	const dispatch = useDispatch();
	const [carsdata, setCarsdata] = useState();
	const [searchData, setSearchData] = useState([]);
	const [selectedData, setSelectedData] = useState();
	const [query, setQuery] = useState("");
	const [invoicedata, setInvoicedata] = useState([]);

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

	const createInvoiceHandler = (idx) => {
		dispatch(generateInvoice(invoicedata[idx]));
		// toast.success(`Invoice Added ✔️`);
	};

	const onInputChangeHandler = (e, index) => {
		const { name, value } = e.target;
		console.log(name + " == " + value);

		setInvoicedata((prevInvoices) => {
			const updatedInvoices = [...prevInvoices];
			if (name === "date" || name === "km") {
				updatedInvoices[index] = {
					...updatedInvoices[index],
					end: {
						...updatedInvoices[index].end,
						[name]: value,
					},
				};
			} else {
				updatedInvoices[index] = {
					...updatedInvoices[index],
					[name]: value,
				};
			}
			return updatedInvoices;
		});
	};
	const toggleStatus = (index) => {
		setInvoicedata((prevInvoices) => {
			const updatedInvoices = [...prevInvoices];
			updatedInvoices[index] = {
				...updatedInvoices[index],
				status: !updatedInvoices[index]?.status,
			};
			return updatedInvoices;
		});
	};

	useEffect(() => {
		if (allcars && allcars.length !== 0) {
			// Filter cars based on whether all trips are completed or any car has no trips
			const invoiceAvailable = allcars
				.filter((item) => {
					if (item.trip.length === 0) {
						return false; // Include cars with no trips
					} else {
						// Check if all trips of the car are completed
						const allTripsCompleted = item.trip.every((trip) => trip.status !== "completed");
						return allTripsCompleted;
					}
				})
				.reverse();

			const data = invoiceAvailable.map((car, idx) => ({
				data: [idx + 1, car?.registrationNo, car?.brand, car?.model],
				action: (
					<button
						onClick={() => {
							setSelectedData(car);
						}}
					>
						Create Invoice
					</button>
				),
				id: car._id,
			}));

			setCarsdata(data);
		}
	}, [allcars]);

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
		if (selectedData && selectedData.length !== 0) {
			const initialInvoices = selectedData.trip.map((trip) => ({
				tripId: trip.tripId,
				end: {
					km: 0,
					date: "",
				},
				status: true,
			}));
			setInvoicedata(initialInvoices);
		}
	}, [selectedData]);

	useEffect(() => {
		dispatch(getAllCars());
	}, []);

	return (
		<div className="newInvoiceDialogue">
			<div>
				<IoClose onClick={() => setIsOpen(false)} />
				<h2>Add New Invoice</h2>
				{selectedData && (
					<div>
						<TableContainer className="invoiceFormTable">
							<TableHeading>
								<p>Choose Trip</p>
							</TableHeading>
							<TableHeading className="tableForm">
								<div>
									<h5>Trip Id</h5>
								</div>
								<div>
									<h5>Car Registration Number</h5>
								</div>
								<div>
									<h5>Trip District</h5>
								</div>
								<div>
									<h5>End Kilometer</h5>
								</div>
								<div>
									<h5>End Date</h5>
								</div>
								<div>
									<h5>Tenure Closed</h5>
								</div>
								<div>
									<h5>Action</h5>
								</div>
							</TableHeading>
							{selectedData?.trip.map((trip, idx) => {
								return (
									<TableHeading className="tableForm" key={trip.tripId}>
										<div>
											<p>{trip.tripId}</p>
										</div>
										<div>
											<p>{selectedData?.registrationNo}</p>
										</div>
										<div>
											<p>{trip.district}</p>
										</div>
										<div>
											<input
												type="text"
												name="km"
												placeholder="End kilometer"
												value={invoicedata[idx]?.end?.km || ""}
												onChange={(e) => onInputChangeHandler(e, idx)}
											/>
										</div>
										<div>
											<input
												type="date"
												name="date"
												placeholder="End Date"
												value={invoicedata[idx]?.end?.date || ""}
												onChange={(e) => onInputChangeHandler(e, idx)}
											/>
										</div>
										<div>
											<button onClick={() => toggleStatus(idx)}>
												Toggle Status: {invoicedata[idx]?.status ? "True" : "False"}
											</button>
										</div>
										<div>
											<button onClick={() => createInvoiceHandler(idx)}>Create</button>
										</div>
									</TableHeading>
								);
							})}
						</TableContainer>
					</div>
				)}
				{!selectedData && (
					<TableContainer className="createInvoiceTable">
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
							<TableBody TableRow={AssignRow} data={query ? searchData : carsdata} />
						</Table>
					</TableContainer>
				)}
			</div>
		</div>
	);
}

export default NewInvoice;
