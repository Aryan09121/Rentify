/* eslint-disable react/prop-types */
import AdminSidebar from "../../components/AdminSidebar";
import Bar from "../../components/Bar";
import userImg from "../assets/userImage.png";
import { TiTick } from "react-icons/ti";
// import { Table, TableBody, TableContainer, TableHeaders, TableHeading, RowDefault } from "../components/TableHOC";
import Select, { components } from "react-select";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
import Files from "react-files";
import { useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";

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

const VehicleData = [
	{
		data: ["1", "Tata Nexon", "134 km", "543.00/day", "52 days", 4443.0],
		_id: 1,
	},
	{
		data: ["2", "Harrier", "224 km", "866.00/day", "12 days", 1121.0],
		_id: 2,
	},
	{
		data: ["3", "Maruti Suzuki", "274 km", "300.00/day", "39 days", 5369.0],
		_id: 3,
	},
	{
		data: ["4", "Tata Punch", "344 km", "514.00/day", "62 days", 2193.0],
		_id: 4,
	},
	{
		data: ["5", "Maruti Breeza", "184 km", "455.00/day", "41 days", 1343.0],
		_id: 5,
	},
];

const vehicleHeaders = ["Serial No", "Brand Name", "Kilometers", "Rate", "Total Days", "Amount"];

const AddNewOwner = () => {
	// ? states
	const [file, setFile] = useState();
	const [fileName, setFileName] = useState();
	const [photo, setPhoto] = useState();

	// ? excel file
	const [excelData, setExcelData] = useState(null);
	const [ownerList, setOwnerList] = useState([]);
	const [ownerExceldata, setOwnerExcelData] = useState([]);
	const [carExceldata, setCarExcelData] = useState([]);

	// owner personal details
	const [owner, setOwner] = useState({
		carid: "",
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
		ownerid: "",
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
	};

	const handleCarFileUpload = (event) => {
		const file = event.target.files[0];
		readCarExcelFile(file);
	};

	const readOwnerExcelFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary
				const ownerData = rows.slice(1);
				setOwnerExcelData(ownerData);
			})
			.catch((error) => {
				console.error("Error reading Owner Excel file:", error);
			});
	};

	const readCarExcelFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary
				const carData = rows.slice(1);
				setCarExcelData(carData);
			})
			.catch((error) => {
				console.error("Error reading Car Excel file:", error);
			});
	};

	const matchOwnersWithCars = () => {
		const ownersCarsMap = {};

		// Create a map of owners with their cars based on the common ID
		carExceldata.forEach((car) => {
			const ownerId = car[0]; // Assuming the owner ID is the first column
			if (!ownersCarsMap[ownerId]) {
				ownersCarsMap[ownerId] = [];
			}
			ownersCarsMap[ownerId].push(car);
		});

		// Match owners with their cars and create the final structure
		const ownerList = ownerExceldata.map((owner) => {
			const ownerId = owner[0]; // Assuming the owner ID is the first column
			return {
				id: ownerId,
				name: owner[1], // Assuming the owner name is the second column
				// Add other owner details here
				cars: ownersCarsMap[ownerId] || [],
				phone: owner[2],
				gender: owner[3],
				email: owner[4],
				gst: owner[5],
				pan: owner[6],
				address: owner[7],
			};
		});

		// Update state with the matched owners and cars
		setOwnerList(ownerList);
		console.log(ownerList);
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

	// const handleDocumentChange = (files) => {
	// 	console.log(files);
	// 	setFileName(files[0].name);
	// 	setFile(files[0].preview.url);
	// 	setOwner((prev) => {
	// 		return {
	// 			...prev,
	// 			document: files[0].preview.url,
	// 		};
	// 	});
	// };

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

	const removeDocument = () => {
		setFile("");
		setFileName("");
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
		alert("outer form submit");
	};

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="addNewOwner">
				<Bar />
				<h2>Add Owner</h2>
				<section className="newOwnerFormContainer">
					<form className="formContainer" onSubmit={ownerDetailsSubmitHandler}>
						<section className="documentUploader">
							{/* <Select
								defaultValue={documentSortOptions[0]}
								options={documentSortOptions}
								components={{ DropdownIndicator }}
								styles={customStyles}
							/> */}
							{file && fileName && (
								<p className="green">
									<TiTick /> {fileName} Uploaded Succesfully{" "}
									<span className="red" onClick={removeDocument}>
										<IoIosClose />
									</span>
								</p>
							)}
							<input type="file" onChange={handleOwnerFileUpload} />
							<input type="file" onChange={handleCarFileUpload} />
							{ownerList.length !== 0 && (
								<div>
									<h2>Excel Data:</h2>
									<pre>{JSON.stringify(ownerList, null, 2)}</pre>
								</div>
							)}
						</section>
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
										<input type="text" name="name" value={owner.name} onChange={onInputChange} placeholder="Owner Name *" />
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
						<form className="carDetails">
							<h3>Car Information</h3>
							<div className="carInputDiv">
								<div>
									<input
										type="text"
										onChange={onInputCarChange}
										value={cars.ownername}
										name="ownername"
										placeholder="Vehicle Owner Name *"
										required
									/>
									<input
										type="text"
										onChange={onInputCarChange}
										value={cars.brand}
										name="brand"
										placeholder="Brand Name *"
										pattern="[A-Za-z0-9\s\-']+"
										required
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
										required
									/>
									<input
										type="text"
										placeholder="Vehicle Number *"
										onChange={onInputCarChange}
										value={cars.vehicleno}
										name="vehicleno"
										pattern="[A-Z]{2}\s\d{2}\s[A-Z]{2}\s[0-9A-Z]+"
										title="Please enter a valid vehicle Vehicle number"
										required
									/>
								</div>
								<div>
									<input
										type="text"
										onChange={onInputCarChange}
										value={cars.frvcode}
										name="frvcode"
										placeholder="FRV Code *"
										required
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
										required
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
						</form>
						<button onClick={matchOwnersWithCars}>Add Owner</button>
					</form>
				</section>
			</main>
		</div>
	);
};

export default AddNewOwner;
