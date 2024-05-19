import Bar from "./Bar";
import AdminSidebar from "./AdminSidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addCar } from "../redux/actions/car.action";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";

const AddCars = () => {
	const [car, setCar] = useState({
		brand: "",
		model: "",
		registrationNo: "",
		rent: "",
		start: {
			km: 0,
			date: new Date(),
		},
	});
	const { message, error, loading } = useSelector((state) => state.car);
	const dispatch = useDispatch();
	const { id } = useParams("id");

	const carAddsSubmitHandler = (e) => {
		e.preventDefault();
		console.log(car);
		if (!car.model || !car.brand || !car.registrationNo || !car.rent || !car.start.km || !car.start.date) {
			toast.error("All  fields are required");
		} else {
			dispatch(addCar(car, id));
		}
	};
	const onInputChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setCar((data) => {
			return {
				...data,
				[name]: value,
			};
		});
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

	if (loading) {
		return <Loader />;
	}
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="addNewForm">
				<Bar />
				<h2>Add Car</h2>
				<section className="newOwnerFormContainer">
					<form className="formContainer" onSubmit={carAddsSubmitHandler}>
						<section className="carDetails">
							<div className="carInputDiv">
								<div>
									<input
										type="text"
										onChange={onInputChange}
										value={car.brand}
										name="brand"
										placeholder="Brand Name *"
										pattern="[A-Za-z0-9\s\-']+"
									/>
									<input type="text" onChange={onInputChange} value={car.rent} placeholder="Rent Charges *" name="rent" />
								</div>
								<div>
									<input
										type="text"
										onChange={onInputChange}
										value={car.model}
										name="model"
										placeholder="Model Number *"
										pattern="[A-Za-z0-9_-]+"
									/>
									<input
										type="text"
										placeholder="Vehicle Number *"
										onChange={onInputChange}
										value={car.registrationNo}
										name="registrationNo"
										title="Please enter a valid vehicle Vehicle number"
									/>
								</div>
								<div>
									<input
										type="text"
										value={car.start.km}
										onChange={(e) =>
											setCar((curr) => {
												return {
													...curr,
													start: {
														...curr.start,
														km: e.target.value,
													},
												};
											})
										}
										placeholder="Start Km"
										name="startkm"
									/>
									<input
										type="date"
										value={car.start.date}
										onChange={(e) =>
											setCar((curr) => {
												return {
													...curr,
													start: {
														...curr.start,
														date: e.target.value,
													},
												};
											})
										}
										placeholder="Start Date dd/MM/YYYY"
										name="startdate"
									/>
								</div>
							</div>
						</section>
						<button type="submit">Add Car</button>
					</form>
				</section>
			</main>
		</div>
	);
};

export default AddCars;
