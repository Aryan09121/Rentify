import { IoIosClose } from "react-icons/io";
import { TiTick } from "react-icons/ti";
import { AdminSidebar, Bar } from "../components";
import readXlsxFile from "read-excel-file";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { addCars } from "../redux/actions/uploads.action";

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

const DataUpload = () => {
	const [cars, setCars] = useState();
	const { message, error } = useSelector((state) => state.uploads);
	const dispatch = useDispatch();

	const handleCarFileUpload = (event) => {
		const file = event.target.files[0];
		readHiringExcelFile(file);
		event.target.value = null;
	};

	const handleMaintainanceFileUpload = (event) => {
		const file = event.target.files[0];
		readMaintainanceExcelFile(file);
		event.target.value = null;
	};

	const readHiringExcelFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary

				const carHeaders = rows[0];
				const carHeadersLower = carHeaders.map((header) => header.toLowerCase());
				const arraysAreEqual =
					expectedHiringHeaders.length === carHeadersLower.length &&
					expectedHiringHeaders.every((value, index) => {
						return value.toLowerCase() === carHeadersLower[index];
					});
				if (arraysAreEqual) {
					const carData = rows.slice(1);
					const seenRegistrationNos = new Set();
					const filteredCars = carData.reduce((acc, currCar) => {
						const registrationNo = currCar[2];
						if (!seenRegistrationNos.has(registrationNo)) {
							seenRegistrationNos.add(registrationNo);
							acc.push(currCar);
						}
						return acc;
					}, []);
					// console.log(filteredCars);
					const updatedCars = filteredCars.map((car) => ({
						brand: car[3],
						model: car[4],
						year: car[5],
						registrationNo: car[2],
						start: {
							date: car[8],
							km: undefined,
						},
						rate: {
							date: car[14],
						},
						rent: 0,
					}));

					setCars(updatedCars);
					toast.success("Hiring Data Reads Successfully");
				} else {
					toast.error("Invalid File Format");
				}
			})
			.catch((error) => {
				toast.error("Only Excel files are accepted!");
				console.error("Error reading Car Excel file:", error);
			});
	};

	const readMaintainanceExcelFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary

				const carHeaders = rows[0];
				const carHeadersLower = carHeaders.map((header) => header.toLowerCase());
				const arraysAreEqual =
					expectedMaintainaceHeaders.length === carHeadersLower.length &&
					expectedMaintainaceHeaders.every((value, index) => {
						return value.toLowerCase() === carHeadersLower[index];
					});
				if (arraysAreEqual) {
					const carData = rows.slice(1);
					const seenRegistrationNos = new Set();
					const filteredCars = carData.reduce((acc, currCar) => {
						const registrationNo = currCar[2];
						if (!seenRegistrationNos.has(registrationNo)) {
							seenRegistrationNos.add(registrationNo);
							acc.push(currCar);
						}
						return acc;
					}, []);

					// Update the start.km in the existing cars state
					const updatedCars = cars.map((existingCar) => {
						const matchingCar = filteredCars.find((car) => car[2] === existingCar.registrationNo);
						if (matchingCar) {
							existingCar.start.km = matchingCar[8];
							existingCar.rate.km = matchingCar[12];
						}
						return existingCar;
					});
					setCars(updatedCars);
					toast.success("Maintainance Data Reads Successfully");
				} else {
					toast.error("Invalid File Format");
				}
			})
			.catch((error) => {
				toast.error("Only Excel files are accepted!");
				console.error("Error reading Car Excel file:", error);
			});
	};

	const carSubmitHandler = (e) => {
		e.preventDefault();
		// console.log(cars);
		dispatch(addCars(cars));
	};

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
							<h2 style={{ textAlign: "center" }}>Car Registration</h2>
							<h3>Select Hiring&apos;s Data File to Select Cars</h3>
							<input type="file" onChange={handleCarFileUpload} />
							<h3>Choose Maintainance file</h3>
							<input type="file" onChange={handleMaintainanceFileUpload} />
							<button onClick={carSubmitHandler}>Add Cars</button>
						</section>
					</div>
				</section>
			</main>
		</div>
	);
};

export default DataUpload;
