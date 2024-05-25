/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { TiTick } from "react-icons/ti";
import Select, { components } from "react-select";
import { IoIosArrowDown, IoIosClose } from "react-icons/io";
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

// eslint-disable-next-line no-unused-vars
const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoIosArrowDown />
		</components.DropdownIndicator>
	);
};

// const ownersCarHeaders = ["Serial No", "Brand Name", "Kilometers", "Rate", "Total Days", "Amount"];

const expectedOwnerHeaders = [
	"Name",
	"Bank Name",
	"Account No",
	"IFSC Code",
	"District and Location",
	"Vehicle No",
	"Vehicle Type",
	"Monthly Payment",
	"Phone Number",
];
// const expectedAccountHeaders = ["Phone", "Brand", "Model", "Vehicle Registration Number", "km", "date", "Rent Charges"];

const AddNewOwner = () => {
	// ? states

	// eslint-disable-next-line no-unused-vars
	const { message, error, loading } = useSelector((state) => state.owner);
	const dispatch = useDispatch();

	// ? excel file
	const [ownerFinal, setOwnerFinal] = useState([]);

	// owner personal details
	const [owner, setOwner] = useState({
		name: "",
		avatar: "",
		phone: "",
		gender: genderSortOptions[0].value,
		email: "",
		aadhar: "",
		pan: "",
		address: {
			street: "",
			city: "",
			state: "",
			pincode: "",
		},
		account: "",
		ifsc: "",
	});

	//  ? handlers

	const handleOwnerFileUpload = (event) => {
		const file = event.target.files[0];
		readOwnerExcelFile(file);
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
					console.log(ownerData);
					const ownerDictionary = {}; // Dictionary to store owners and their data
					ownerData.forEach((data) => {
						const phoneNumber = data[8];
						const ownerKey = `${data[0]}_${phoneNumber}`; // Using a combination of name and phone number as key
						if (!ownerDictionary[ownerKey]) {
							// If owner does not exist in dictionary, initialize with an array containing the owner data
							ownerDictionary[ownerKey] = {
								name: data[0],
								phone: phoneNumber,
								address: {
									street: data[4],
								},
								account: data[2],
								bankName: data[1],
								ifsc: data[3],
								registration: [{ registrationNo: data[5], model: data[6] }],
							};
						} else {
							// If owner exists in dictionary, append the registration number to the existing registration array
							ownerDictionary[ownerKey].registration.push({ registrationNo: data[5], model: data[6] });
						}
					});
					const ownerArray = Object.values(ownerDictionary);
					// console.log(ownerArray);
					setOwnerFinal(ownerArray);
					return toast.success("Owners Data Read Successfully");
				} else {
					return toast.error("Invalid File Format");
				}
			})
			.catch((error) => {
				console.error("Error reading Owner Excel file:", error);
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

	const removeOwner = () => {
		setOwnerFinal([]);
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
		// console.log(ownerFinal);
		dispatch(addOwners(ownerFinal));
		setOwnerFinal([]);
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
	}, [dispatch, error, message]);

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
														name="aadhar"
														value={owner.aadhar}
														onChange={onInputChange}
														placeholder="Aadhar No *"
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
													<input
														type="text"
														name="ifsc"
														value={owner.ifsc}
														onChange={onInputChange}
														placeholder="IFSC Code *"
														required
													/>
													<input
														type="text"
														value={owner.account}
														name="account"
														onChange={onInputChange}
														placeholder="Account Number *"
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
