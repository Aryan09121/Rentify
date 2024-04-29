/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import userImg from "../assets/userImage.png";
import { TiTick } from "react-icons/ti";
import Select, { components } from "react-select";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import Files from "react-files";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";
import { useDispatch, useSelector } from "react-redux";
import { addOwners, addSingleOwner } from "../redux/actions";

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
const expectedCarHeaders = ["gmail", "Brand", "Model", "Vehicle Registration Number", "km", "date", "rate (date)", "rate (km)"];

const AddNewOwner = () => {
	// ? states
	const [photo, setPhoto] = useState();
	const [tableData, setTableData] = useState([]);

	// eslint-disable-next-line no-unused-vars
	const { message, error, loading } = useSelector((state) => state.owner);
	const dispatch = useDispatch();

	// ? excel file
	const [ownerFinal, setOwnerFinal] = useState([]);
	// const dispatch = useDispatch();
	// const { loading, message, error } = useSelector((state) => state.owner);

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
		registrationNo: "",
		brand: "",
		model: "",
		start: {
			km: 0,
			date: "",
		},
		rate: {
			date: "",
			km: "",
		},
	});

	//  ? handlers

	const handleOwnerFileUpload = (event) => {
		const file = event.target.files[0];
		readOwnerExcelFile(file);
		event.target.value = null;
	};

	const handleCarFileUpload = (event) => {
		const file = event.target.files[0];
		readCarExcelFile(file);
		event.target.value = null;
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

					const updatedOwners = ownerFinal.map((owner) => {
						const matchingCars = carData.filter((car) => car[0] === owner.email);

						if (matchingCars.length > 0) {
							const cars = matchingCars.map((car) => ({
								brand: car[1],
								model: car[2],
								registrationNo: car[3],
								start: {
									date: car[5],
									km: car[4],
								},
								rate: {
									date: car[6],
									km: car[7],
								},
							}));

							console.log({
								...owner,
								cars: owner.cars.concat(cars),
							});

							return {
								...owner,
								cars: owner.cars.concat(cars),
							};
						} else {
							return owner;
						}
					});
					console.log(updatedOwners);
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
		const isCarAlreadyAdded = owner.cars.some((car) => car.registrationNo === cars.registrationNo);
		if (isCarAlreadyAdded) {
			toast.error("Car with the same vehicle number already exists for this owner.");
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
					data: [tableData.length + 1, cars.model, cars.brand, cars.rent, cars.seater],
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
		} else {
			console.log("car reading...");
		}
	};

	// ?? adding owners through excel files
	const excelSubmitHandler = (e) => {
		e.preventDefault();
		dispatch(addOwners(ownerFinal));
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
		<div className="admin-container">
			<AdminSidebar />
			{loading && <h1>Loadin...</h1>}
			{!loading && (
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
										{/* <button className="carExcelBtn"> */}
										<h2 style={{ textAlign: "center", fontFamily: "poppins", fontSize: "1.3rem" }}>Add Cars</h2>
										<input type="file" id="carfileupload" onChange={handleCarFileUpload} />
										{/* </button> */}
									</>
								)}
							</section>
							{ownerFinal.length === 0 ? (
								<button type="submit">Add Owner</button>
							) : (
								<button onClick={excelSubmitHandler}>Add Owner</button>
							)}
						</form>
					</section>
				</main>
			)}
		</div>
	);
};

export default AddNewOwner;
