/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import userImg from "../assets/userImage.png";
import { TiTick } from "react-icons/ti";
// import { Table, TableBody, TableContainer, TableHeaders, TableHeading, RowDefault } from "../components/TableHOC";
import Select, { components } from "react-select";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import Files from "react-files";
import { useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";
import { IoClose } from "react-icons/io5";
import { RowDefault, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "../components/TableHOC";

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

// const ownersCarData = [
// 	{
// 		data: ["1", "Tata Nexon", "134 km", "543.00/day", "52 days", 4443.0],
// 		_id: 1,
// 	},
// 	{
// 		data: ["2", "Harrier", "224 km", "866.00/day", "12 days", 1121.0],
// 		_id: 2,
// 	},
// 	{
// 		data: ["3", "Maruti Suzuki", "274 km", "300.00/day", "39 days", 5369.0],
// 		_id: 3,
// 	},
// 	{
// 		data: ["4", "Tata Punch", "344 km", "514.00/day", "62 days", 2193.0],
// 		_id: 4,
// 	},
// 	{
// 		data: ["5", "Maruti Breeza", "184 km", "455.00/day", "41 days", 1343.0],
// 		_id: 5,
// 	},
// ];

const ownersCarHeaders = ["Serial No", "Brand Name", "Kilometers", "Rate", "Total Days", "Amount"];

const expectedOwnerHeaders = ["name", "phone number", "gender", "email id", "gstin number", "pan number", "address"];
const expectedCarHeaders = ["name", "brand", "model", "vehicle number", "frv code", "rent", "air conditioning", "seater"];

const AddNewOwner = () => {
	// ? states
	const [photo, setPhoto] = useState();
	const [tableData, setTableData] = useState([]);

	// ? excel file
	const [selectedOwner, setSelectedOwner] = useState("");
	const [dialog, setDialog] = useState(false);
	const [ownerFinal, setOwnerFinal] = useState([]);

	// owner personal details
	const [owner, setOwner] = useState({
		name: "",
		avatar: "",
		phone: "",
		gender: "",
		email: "",
		gst: "",
		pan: "",
		address: "",
		cars: [],
	});

	const [cars, setCars] = useState({
		ownername: "",
		brand: "",
		model: "",
		vehicleno: "",
		frvcode: "",
		rent: "",
		isAc: false,
		seater: 4,
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
					expectedOwnerHeaders.every((value, index) => value === ownerHeadersLower[index]);

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
							address: data[6],
							cars: [],
						};
					});
					setOwnerFinal(newarr);
					return toast.success("Owners Data ReadSuccessfully");
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
					expectedCarHeaders.every((value, index) => value === carHeadersLower[index]);

				if (arraysAreEqual) {
					const carData = rows.slice(1);
					// setCarExcelData(carData);
					const newCars = carData.map((data) => {
						return {
							name: data[0],
							brand: data[1],
							model: data[2],
							vehicleno: data[3],
							frvcode: data[4],
							rent: data[5],
							isAc: data[6],
							seater: data[7],
						};
					});

					// Iterate through the ownerFinal array
					const updatedTableData = ownerFinal.reduce((acc, owner) => {
						// Extract cars data from the current owner
						const carsData = owner.cars.map((car, index) => ({
							data: [index + 1, car.name, car.model, car.brand, car.rent, car.frvcode, car.seater],
							_id: `CAR-${100 + index}`,
						}));

						// Combine the extracted cars data with the existing tableData
						return [...acc, ...carsData];
					}, tableData);
					console.log(updatedTableData);
					setTableData(updatedTableData);

					// Iterate through the ownerFinal array
					const updatedOwners = ownerFinal.map((owner) => {
						// Check if the owner's phone number matches the selected phone number
						if (owner.email === selectedOwner.value) {
							// Add the new cars to the owner's cars property
							return {
								...owner,
								cars: [...owner.cars, ...newCars],
							};
						}
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
		const isCarAlreadyAdded = owner.cars.some((car) => car.vehicleno === cars.vehicleno && car.frvcode === cars.frvcode);
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
					data: [tableData.length + 1, cars.ownername, cars.model, cars.brand, cars.rent, cars.frvcode, cars.seater],
					_id: `CAR-${tableData.length + 1}`,
				},
			];

			// Set the updated tableData to the state
			setTableData(updatedTableData);
			toast.success("Car Added Successfully");
			setCars({
				ownername: "",
				brand: "",
				model: "",
				vehicleno: "",
				frvcode: "",
				rent: "",
				isAc: false,
				seater: 4,
			});
		}
	};

	const ownerDetailsSubmitHandler = (e) => {
		e.preventDefault();
		if (ownerFinal.length === 0) {
			console.table(owner);
			toast.success("Owner Added Successfully");
		} else {
			console.log("car reading...");
		}
	};

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
			<main className="addNewOwner">
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
												<textarea
													name="address"
													onChange={onInputChange}
													value={owner.address}
													cols="30"
													rows="3"
													placeholder="Address *"
													pattern="^[a-zA-Z\s]+,\s*[a-zA-Z\s]+,\s*[a-zA-Z\s]+,\s*\d{6}$"
													title="Please enter a valid address (District, City, State, PIN)"
													required
												></textarea>
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
												value={cars.ownername}
												name="ownername"
												placeholder="Vehicle Owner Name *"
											/>
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
												value={cars.vehicleno}
												name="vehicleno"
												pattern="[A-Z]{2}\s\d{2}\s[A-Z]{2}\s[0-9A-Z]+"
												title="Please enter a valid vehicle Vehicle number"
											/>
										</div>
										<div>
											<input
												type="text"
												onChange={onInputCarChange}
												value={cars.frvcode}
												name="frvcode"
												placeholder="FRV Code *"
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
				<section className="carstable">
					<TableContainer className="addnewOwnerTable">
						<TableHeading>
							<p>All Bills</p>
						</TableHeading>
						<Table>
							<TableHeaders style={{ gridTemplateColumns: `repeat(${ownersCarHeaders.length + 1},1fr)` }} headers={ownersCarHeaders} />
							<TableBody TableRow={RowDefault} data={tableData} />
						</Table>
					</TableContainer>
				</section>
			</main>
		</div>
	);
};

export default AddNewOwner;
