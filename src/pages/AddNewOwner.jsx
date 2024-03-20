/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import userImg from "../assets/userImage.png";
import { TiTick } from "react-icons/ti";
import Select, { components } from "react-select";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import Files from "react-files";
import { useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addSingleOwner } from "../actions/owner.action";
// import { useSelector } from "react-redux";

const customStyles = {
	control: (provided) => ({
		...provided,
		padding: "0.3rem 0.6rem",
		cursor: "pointer",
		backgroundColor: "#fcfcfc",
		"&:hover, &:focus": {
			backgroundColor: "#fcfcfc",
			padding: "0.3rem 0.6rem",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.3rem 0.6rem",
		marginRight: "1rem",
		borderRadius: "5px",
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#111",
		"&:hover, &:focus": {
			color: "#111",
		},
	}),
};

const genderSortOptions = [
	{ value: "male", label: "Male" },
	{ value: "female", label: "Female" },
	{ value: "others", label: "Others" },
];
const airconditionSortOptions = [
	{ value: "", label: "Air Conditioned" },
	{ value: true, label: "AC" },
	{ value: false, label: "NON AC" },
];
const sittingSortOptions = [
	{ value: "", label: "sitting" },
	{ value: "4", label: "4 Seater" },
	{ value: "5", label: "5 Seater" },
	{ value: "6", label: "6 Seater" },
	{ value: "8", label: "8 Seater" },
];

// eslint-disable-next-line no-unused-vars
const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoIosArrowDown />
		</components.DropdownIndicator>
	);
};

// const ownersCarHeaders = ["Serial No", "Brand Name", "Kilometers", "Rate", "Total Days", "Amount"];

const expectedOwnerHeaders = ["Name", "Phone Number", "Gender", "Email Id", "GSTIN Number", "PAN Number", "street", "city", "state", "pincode"];
const expectedCarHeaders = [
	"gmail",
	"brand",
	"model",
	"Vehicle Registration Number",
	"FRV code",
	"Rent",
	"Air Conditioning",
	"Seater",
	"year",
	"isAc",
	"km",
	"date",
];

const AddNewOwner = () => {
	// ? states
	const [photo, setPhoto] = useState();
	const [tableData, setTableData] = useState([]);

	// const { user } = useSelector((state) => state.user);

	// ? excel file
	const [selectedOwner, setSelectedOwner] = useState("");
	const [dialog, setDialog] = useState(false);
	const [ownerFinal, setOwnerFinal] = useState([]);
	const dispatch = useDispatch();
	const { loading, message, error } = useSelector((state) => state.owner);

	// owner personal details
	const [owner, setOwner] = useState({
		name: "",
		avatar: "",
		phone: "",
		gender: genderSortOptions[0].value,
		email: "",
		gst: "",
		pan: "",
		address: {
			street: "",
			city: "",
			state: "",
			pincode: "",
		},
		cars: [],
	});

	const [cars, setCars] = useState({
		brand: "",
		model: "",
		registrationNo: "",
		frvcode: "",
		rent: "",
		year: "",
		isAc: false,
		seater: 4,
		start: {
			km: 0,
			date: "",
		},
		district: "",
	});

	//  ? handlers

	const handleOwnerFileUpload = (event) => {
		const file = event.target.files[0];
		readOwnerExcelFile(file);
		event.target.value = null;
	};

	const handleCarFileUpload = (event) => {
		const file = event.target.files[0];
		if (selectedOwner) {
			readCarExcelFile(file);
			event.target.value = null;
		} else {
			event.target.value = null;
			toast.error("Please Select the owner first");
		}
	};

	const readOwnerExcelFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary
				const ownerHeaders = rows[0];
				const ownerHeadersLower = ownerHeaders.map((header) => header.toLowerCase());
				const ownerData = rows.slice(1);
				const arraysAreEqual =
					expectedOwnerHeaders.length === ownerHeadersLower.length &&
					expectedOwnerHeaders.every((value, index) => value.toLowerCase() === ownerHeadersLower[index]);

				if (arraysAreEqual) {
					// setOwnerExcelData(() => {
					// 	return ownerData;
					// });
					const newarr = ownerData.map((data) => {
						return {
							name: data[0],
							phone: data[1],
							gender: data[2],
							email: data[3],
							gst: data[4],
							pan: data[5],
							address: {
								street: data[6],
								city: data[7],
								state: data[8],
								pincode: data[9],
							},
							cars: [],
						};
					});
					setOwnerFinal(newarr);
					return toast.success("Owners Data Read Successfully");
				} else {
					return toast.error("Invalid File Format");
				}
			})
			.catch((error) => {
				console.error("Error reading Owner Excel file:", error);
			});
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
					// setCarExcelData(carData);
					// eslint-disable-next-line no-unused-vars
					const newCars = carData.map((data) => {
						// console.log({
						// 	gmail: data[0],
						// 	brand: data[1],
						// 	model: data[2],
						// 	registrationNo: data[3],
						// 	frvcode: data[4],
						// 	rent: data[5],
						// 	isAc: data[6],
						// 	seater: data[7],
						// 	street: data[8],
						// 	city: data[9],
						// 	state: data[10],
						// 	pincode: data[11],
						// });
						const updatedOwners = ownerFinal.map((currowner) => {
							if (currowner.email === data[0]) {
								return {
									...currowner,
									cars: [
										...currowner.cars,
										{
											gmail: data[0],
											brand: data[1],
											model: data[2],
											registrationNo: data[3],
											frvcode: data[4],
											rent: data[5],
											isAc: data[6],
											seater: data[7],
											street: data[8],
											city: data[9],
											state: data[10],
											pincode: data[11],
										},
									],
								};
							}
						});

						console.log(updatedOwners);

						return {
							email: data[0],
							brand: data[1],
							model: data[2],
							registrationNo: data[3],
							frvcode: data[4],
							rent: data[5],
							isAc: data[6],
							seater: data[7],
							street: data[8],
							city: data[9],
							state: data[10],
							pincode: data[11],
						};
					});

					// Iterate through the ownerFinal array
					// const updatedTableData = ownerFinal.reduce((acc, owner) => {
					// 	// Extract cars data from the current owner
					// 	const carsData = owner.cars.map((car, index) => ({
					// 		data: [index + 1, car.name, car.model, car.brand, car.rent, car.frvcode, car.seater],
					// 		_id: `CAR-${100 + index}`,
					// 	}));

					// 	// Combine the extracted cars data with the existing tableData
					// 	return [...acc, ...carsData];
					// }, tableData);
					// console.log(updatedTableData);
					// setTableData(updatedTableData);

					// Iterate through the ownerFinal array
					const updatedOwners = ownerFinal.map((owner) => {
						// Check if the owner's phone number matches the selected phone number
						// if (owner.email === selectedOwner.value) {
						// 	// Add the new cars to the owner's cars property
						// 	return {
						// 		...owner,
						// 		cars: [...owner.cars, ...newCars],
						// 	};
						// }
						// newCars.map((car) => {
						// 	console.log(car.email);
						// });

						return owner;
					});

					// Update the ownerFinal state with the updated owners
					setOwnerFinal(updatedOwners);
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

	const onInputCarChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setCars((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const onSelectAcChange = (selectedValue) => {
		setCars((prev) => {
			return {
				...prev,
				isAc: selectedValue.value,
			};
		});
	};

	const onSelectSeaterChange = (selectedValue) => {
		setCars((prev) => {
			return {
				...prev,
				seater: selectedValue.value,
			};
		});
	};

	const onSelectChange = (selectedValue) => {
		setOwner((prev) => {
			return {
				...prev,
				gender: selectedValue.value,
			};
		});
	};

	const onInputChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setOwner((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const handlePhotoChange = (files) => {
		setPhoto(files[0].preview.url);
		setOwner((prev) => {
			return {
				...prev,
				avatar: files[0].preview.url,
			};
		});
	};

	const handleError = (error) => {
		console.log("error code " + error.code + ": " + error.message);
	};

	const removeOwner = () => {
		setOwnerFinal([]);
	};

	const carDetailsSubmitHandler = (e) => {
		e.preventDefault();
		alert("inner form submit");
		const isCarAlreadyAdded = owner.cars.some((car) => car.registrationNo === cars.registrationNo && car.frvcode === cars.frvcode);
		if (isCarAlreadyAdded) {
			toast.error("Car with the same vehicle number and FRV code already exists for this owner.");
		} else {
			setOwner((prev) => {
				return {
					...prev,
					cars: [...prev.cars, cars],
				};
			});
			const updatedTableData = [
				...tableData,
				{
					data: [tableData.length + 1, cars.model, cars.brand, cars.rent, cars.frvcode, cars.seater],
					_id: `CAR-${tableData.length + 1}`,
				},
			];

			// Set the updated tableData to the state
			setTableData(updatedTableData);
			toast.success("Car Added Successfully");
			setCars({
				brand: "",
				model: "",
				registrationNo: "",
				frvcode: "",
				rent: "",
				year: "",
				isAc: false,
				seater: 4,
				start: {
					km: 0,
					date: null,
				},
			});
		}
	};

	// ?? adding owners through form
	const ownerDetailsSubmitHandler = (e) => {
		e.preventDefault();
		if (ownerFinal.length === 0) {
			console.table(owner);
			dispatch(addSingleOwner(owner));
			toast.success("Owner Added Successfully");
		} else {
			console.log("car reading...");
		}
	};

	// ?? adding owners through excel files
	const excelSubmitHandler = (e) => {
		e.preventDefault();
		toast.success("Owners Added Successfully");
		console.table(ownerFinal);
		console.log(tableData);
	};

	const onOwnerChange = (selectedValue) => {
		console.log(selectedValue.value);
		if (selectedValue.value) {
			setSelectedOwner(selectedValue);
		}
	};

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="addNewForm">
				<Bar />
				<h2>Add Owner</h2>
				<section className="newOwnerFormContainer">
					<form className="formContainer" onSubmit={(e) => ownerDetailsSubmitHandler(e)}>
						<section className="documentUploader">
							<h3>Upload Owner&apos;s Data File</h3>
							{ownerFinal.length !== 0 && (
								<p className="green">
									<TiTick /> Owner&apos;s data Uploaded Succesfully
									<span className="red" onClick={removeOwner}>
										<IoIosClose />
									</span>
								</p>
							)}
							<input type="file" onChange={handleOwnerFileUpload} />
						</section>
						{ownerFinal.length === 0 ? (
							<>
								<section className="ownerDetails">
									<h3>Owner Information</h3>
									<div className="ownerDetailsFormDiv">
										<div className="ownerPhotoUpload">
											{photo ? <img src={photo} alt="owner photo" /> : <img src={userImg} alt="owner profile" />}
											<Files
												className="files-dropzone"
												onChange={handlePhotoChange}
												onError={handleError}
												accepts={["image/*"]}
												multiple={false}
												maxFileSize={10000000}
												clickable
												minFileSize={0}
											>
												Upload Photo
											</Files>
										</div>
										<div className="ownerDataUpload">
											<div>
												<input
													type="text"
													name="name"
													value={owner.name}
													onChange={onInputChange}
													placeholder="Owner Name *"
												/>
												<Select
													defaultValue={genderSortOptions[0]}
													options={genderSortOptions}
													components={{ DropdownIndicator }}
													// value={owner.gender}
													styles={customStyles}
													onChange={onSelectChange}
													name="gender"
												/>
											</div>
											<div>
												<input
													type="text"
													name="phone"
													value={owner.phone}
													placeholder="Mobile Number *"
													onChange={onInputChange}
													required
													pattern="[0-9]{10}"
												/>
												<input
													type="email"
													placeholder="Email *"
													onChange={onInputChange}
													required
													name="email"
													value={owner.email}
												/>
											</div>
											<div>
												<input
													type="text"
													name="gst"
													value={owner.gst}
													onChange={onInputChange}
													placeholder="GST Number *"
													pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z0-9]{1}[A-Z0-9]{1}$"
													required
												/>
												<input
													type="text"
													value={owner.pan}
													name="pan"
													onChange={onInputChange}
													placeholder="PAN Card Number *"
													pattern="[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}"
													required
												/>
											</div>
											<div>
												{/* <textarea
													name="address"
													onChange={onInputChange}
													value={owner.address}
													cols="30"
													rows="3"
													placeholder="Address *"
													pattern="^[a-zA-Z\s]+,\s*[a-zA-Z\s]+,\s*[a-zA-Z\s]+,\s*\d{6}$"
													title="Please enter a valid address (District, City, State, PIN)"
													required
												></textarea> */}
												<input
													type="text"
													onChange={(e) => {
														setOwner((curr) => {
															return {
																...curr,
																address: {
																	...curr.address,
																	street: e.target.value,
																},
															};
														});
													}}
													value={owner.address.street}
													placeholder="Locality"
												/>
												<input
													type="text"
													onChange={(e) => {
														setOwner((curr) => {
															return {
																...curr,
																address: {
																	...curr.address,
																	city: e.target.value,
																},
															};
														});
													}}
													value={owner.address.city}
													placeholder="City"
												/>
											</div>
											<div>
												<input
													type="text"
													onChange={(e) => {
														setOwner((curr) => {
															return {
																...curr,
																address: {
																	...curr.address,
																	state: e.target.value,
																},
															};
														});
													}}
													value={owner.address.state}
													placeholder="State"
												/>
												<input
													type="text"
													onChange={(e) => {
														setOwner((curr) => {
															return {
																...curr,
																address: {
																	...curr.address,
																	pincode: e.target.value,
																},
															};
														});
													}}
													value={owner.address.pincode}
													placeholder="Pin Code"
												/>
											</div>
										</div>
									</div>
								</section>
							</>
						) : null}
						<section className="carDetails">
							{ownerFinal.length === 0 ? (
								<>
									<h3>Car Information</h3>
									<div className="carInputDiv">
										<div>
											<input
												type="text"
												onChange={onInputCarChange}
												value={cars.brand}
												name="brand"
												placeholder="Brand Name *"
												pattern="[A-Za-z0-9\s\-']+"
											/>
										</div>
										<div>
											<input
												type="text"
												onChange={onInputCarChange}
												value={cars.model}
												name="model"
												placeholder="Model Number *"
												pattern="[A-Za-z0-9_-]+"
											/>
											<input
												type="text"
												placeholder="Vehicle Number *"
												onChange={onInputCarChange}
												value={cars.registrationNo}
												name="registrationNo"
												title="Please enter a valid vehicle Vehicle number"
											/>
										</div>
										<div>
											<input
												type="text"
												onChange={onInputCarChange}
												value={cars.frvcode}
												name="frvcode"
												placeholder="FRV Code"
											/>
											<input type="text" name="year" placeholder="Year *" required />
											<Select
												defaultValue={sittingSortOptions[0]}
												options={sittingSortOptions}
												components={{ DropdownIndicator }}
												styles={customStyles}
												onChange={onSelectSeaterChange}
											/>
										</div>
										<div>
											<input
												type="text"
												onChange={onInputCarChange}
												value={cars.rent}
												placeholder="Rent Charges *"
												name="rent"
											/>

											<Select
												defaultValue={airconditionSortOptions[0]}
												options={airconditionSortOptions}
												components={{ DropdownIndicator }}
												styles={customStyles}
												name="isAc"
												onChange={onSelectAcChange}
											/>
										</div>
										<div>
											<input
												type="text"
												value={cars.start.km}
												onChange={(e) =>
													setCars((curr) => {
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
												value={cars.start.date}
												onChange={(e) =>
													setCars((curr) => {
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

									<button onClick={carDetailsSubmitHandler}>Add Car</button>
								</>
							) : (
								<>
									<button className="carExcelBtn" onClick={() => setDialog((curr) => !curr)}>
										Add Cars via Excel file
									</button>
									<dialog open={dialog}>
										<div>
											<IoClose onClick={() => setDialog(false)} />
											<p>Select Owner From Phone Number</p>
											<Select
												defaultValue={
													ownerFinal.map((owner) => ({
														value: owner.email,
														label: owner.email,
													}))[0]
												}
												options={ownerFinal.map((owner) => ({
													value: owner.email,
													label: owner.email,
												}))}
												components={{ DropdownIndicator }}
												styles={customStyles}
												name="ownermap"
												onChange={onOwnerChange}
											/>
											<input type="file" id="carfileupload" onChange={handleCarFileUpload} />
										</div>
									</dialog>
								</>
							)}
						</section>
						{ownerFinal.length === 0 ? <button type="submit">Add Owner</button> : <button onClick={excelSubmitHandler}>Add Owner</button>}
					</form>
				</section>
			</main>
		</div>
	);
};

export default AddNewOwner;
