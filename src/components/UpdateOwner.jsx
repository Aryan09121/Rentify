/* eslint-disable react/prop-types */
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
import { useState, useEffect } from "react";
import { AssignRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCars, getSingleCar } from "../redux/actions";
import { toast } from "react-toastify";
import { updateRate } from "../redux/actions/owner.action";

const carsHeaders = ["S No", "Vehicle Reg No", "Car Brand", "Car Model", "Action"];

const UpdateOwner = () => {
	const { allcars } = useSelector((state) => state.car);
	const [query, setQuery] = useState("");
	const [carsdata, setCarsdata] = useState([]);
	const [tableCardata, setTableCardata] = useState([]);
	const [searchData, setSearchData] = useState([]);
	const [isCarSelected, setIsCarSelected] = useState(false);
	const [selectedCar, setSelectedCar] = useState("");
	const { id } = useParams();
	const dispatch = useDispatch();

	const editRate = (id) => {
		setSelectedCar(id);
	};

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

	useEffect(() => {
		if (allcars?.length > 0) {
			const data = allcars.filter((car) => car.owner === id);
			// console.log(data);

			const carsdata = data.map((car, idx) => ({
				data: [idx + 1, car?.registrationNo, car?.brand, car?.model],
				action: <button onClick={() => editRate(car?._id)}>Update Rate</button>,
				id: car._id,
			}));

			setCarsdata(carsdata);
		}
	}, [allcars, id]);

	useEffect(() => {
		dispatch(getAllCars());
	}, []);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="updateOwner">
				<Bar />
				{!selectedCar ? (
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
							<TableBody TableRow={AssignRow} data={query ? searchData : carsdata} />
						</Table>
					</TableContainer>
				) : (
					<UpdateRate carId={selectedCar} />
				)}
			</main>
		</div>
	);
};

const UpdateRate = ({ carId }) => {
	const [update, setUpdate] = useState(0);
	const { car } = useSelector((state) => state.car);
	const { message, error } = useSelector((state) => state.owner);
	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		const data = Number(update);
		if (update && data !== 0) {
			dispatch(updateRate(carId, data));
		} else {
			toast.error("All fields are required");
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
	}, [message, error, dispatch]);

	useEffect(() => {
		if (car) {
			setUpdate(car.rent);
		}
	}, [car]);

	useEffect(() => {
		dispatch(getSingleCar(carId));
	}, []);

	return (
		<form onSubmit={submitHandler}>
			<h2>Update Car Rent</h2>
			<div>
				<label htmlFor="date">Rent Charges</label>
				<input type="number" onChange={(e) => setUpdate(e.target.value)} value={update} name="update" id="date" placeholder="day rate" />
			</div>
			<div className="btnsUpdate">
				<button type="submit">Update Details</button>
			</div>
		</form>
	);
};

export default UpdateOwner;
