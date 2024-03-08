import { IoClose, IoIosArrowDown } from "react-icons/io5";
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import userImg from "../assets/userImage.png";
import { TiTick } from "react-icons/ti";
import Select, { components } from "react-select";
import Files from "react-files";
import { useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";
import { IoClose } from "react-icons/io5";

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

const AddNewDriver = () => {
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
				{/* <section className="carstable">
					<TableContainer className="addnewOwnerTable">
						<TableHeading>
							<p>All Bills</p>
						</TableHeading>
						<Table>
							<TableHeaders style={{ gridTemplateColumns: `repeat(${ownersCarHeaders.length + 1},1fr)` }} headers={ownersCarHeaders} />
							<TableBody TableRow={RowDefault} data={tableData} />
						</Table>
					</TableContainer>
				</section> */}
			</main>
		</div>
	);
};

export default AddNewDriver;
