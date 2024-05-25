import Bar from "./Bar";
import AdminSidebar from "./AdminSidebar";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { addCar, addMultipleCar } from "../redux/actions/car.action";
import readXlsxFile from "read-excel-file";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { IoIosClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { getOwnerById } from "../redux/actions";

const expectedCarHeaders = ["Phone", "Brand", "Model", "Vehicle Reg No", "km", "date", "Rent Charges"];

const AddCars = () => {
	const [cars, setCars] = useState([]);
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
	const { owner } = useSelector((state) => state.owner);
	const dispatch = useDispatch();
	const { id } = useParams("id");

	const handleCarFileUpload = (event) => {
		const file = event.target.files[0];
		readCarExcelFile(file);
		event.target.value = null;
	};

	const readCarExcelFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary
				const carHeaders = rows[0];
				const carHeadersLower = carHeaders.map((header) => header.toLowerCase());

				const arraysAreEqual =
					expectedCarHeaders.length === carHeadersLower.length &&
					expectedCarHeaders.every((value, index) => value.toLowerCase() === carHeadersLower[index]);

				if (arraysAreEqual) {
					const carData = rows.slice(1);

					const ownerCars = carData.reduce((acc, currCar) => {
						if (currCar[0] == owner.contact) {
							const data = {
								brand: currCar[1],
								model: currCar[2],
								registrationNo: currCar[3],
								rent: currCar[6],
								start: {
									km: currCar[4],
									date: currCar[5],
								},
							};
							console.log(data);
							acc.push(data);
						}
						return acc;
					}, []);
					console.log(ownerCars);
					setCars(ownerCars);
					toast.success("Cars Data Reads Successfully");
				} else {
					toast.error("Invalid File Format");
				}
			})
			.catch((error) => {
				toast.error("Only Excel files are accepted!");
				console.error("Error reading Car Excel file:", error);
			});
	};

	const carAddsSubmitHandler = (e) => {
		e.preventDefault();
		console.log(car);
		if (!car.model || !car.brand || !car.registrationNo || !car.rent || !car.start.km || !car.start.date) {
			toast.error("All  fields are required");
		} else {
			dispatch(addCar(car, id));
		}
	};

	const multipleCarsSubmitHandler = (e) => {
		e.preventDefault();
		if (cars.length > 0) {
			// console.log(cars);
			dispatch(addMultipleCar(cars, id));
		} else {
			toast.error("Please add atleast one car");
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

	useEffect(() => {
		dispatch(getOwnerById(id));
	}, [dispatch, id]);

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
					<form className="formContainer" onSubmit={cars?.length === 0 ? carAddsSubmitHandler : multipleCarsSubmitHandler}>
						<section className="documentUploader">
							<h3>Upload Car&apos;s Data File</h3>
							{cars?.length !== 0 && (
								<p className="green">
									<TiTick /> Car&apos;s data Uploaded Succesfully
									<span className="red">
										<IoIosClose onClick={() => setCars([])} />
									</span>
								</p>
							)}
							<input type="file" onChange={handleCarFileUpload} />
						</section>
						{cars?.length === 0 && (
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
						)}
						<button type="submit">Add Car</button>
					</form>
				</section>
			</main>
		</div>
	);
};

export default AddCars;
