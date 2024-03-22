import { FaSearch } from "react-icons/fa";
import { tripData } from "../assets/data/dashboard";
import AdminSidebar from "./AdminSidebar";
import Bar from "./Bar";
import { AssignRow, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "./TableHOC";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupedCar } from "../actions/car.action";
import { toast } from "react-toastify";

const carsHeaders = ["S No", "Car Brand", "No of Car", "Vehicle Reg No"];

const AssignTrip = () => {
	const { groupedCar, message, error, loading } = useSelector((state) => state.car);
	const [query, setQuery] = useState("");
	const [cars, setCars] = useState("");
	const dispatch = useDispatch();

	const searchCar = (e) => {
		if (e.key === "Enter") {
			dispatch(getGroupedCar(query));
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
		if (groupedCar) {
			const arrangedData = Object.entries(groupedCar.cars).map(([model, cars]) => ({
				model: model,
				count: cars.length,
				brand: cars[0].brand,
			}));

			const data = arrangedData.map((cardata, idx) => {
				return {
					data: [idx + 1, cardata.model, cardata.count, cardata.brand],
					_id: `CAR-${idx + 1}`,
				};
			});

			setCars(data);
		}
	}, [groupedCar]);

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
							{!cars && (
								<Table>
									<div style={{ padding: "2rem 4rem", color: "red", textAlign: "center", fontSize: "2rem" }}>No Cars Found</div>
								</Table>
							)}
							{cars && (
								<Table>
									<TableHeaders headers={carsHeaders} style={{ gridTemplateColumns: `repeat(${carsHeaders.length},1fr)` }} />
									<TableBody TableRow={AssignRow} data={cars} />
								</Table>
							)}
						</TableContainer>
						<form className="assignform">
							<div>
								<label htmlFor="source">Source</label>
								<input type="text" placeholder="Source" />
							</div>
							<div>
								<label htmlFor="Destination">Destination</label>
								<input type="text" placeholder="Destination" />
							</div>
							<div>
								<label htmlFor="source">FRV Code</label>
								<input type="text" placeholder="Frv Code" />
							</div>
							<div>
								<label htmlFor="source">Rate</label>
								<input type="text" placeholder="Rate" />
							</div>
						</form>
					</main>
				</div>
			)}
		</>
	);
};

export default AssignTrip;
