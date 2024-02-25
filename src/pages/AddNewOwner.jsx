/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { Formik, Field, Form } from "formik";
import VectorImage from "../assets/Vector.jpg";
import { Table, TableBody, TableContainer, TableHeaders, TableHeading, RowDefault } from "../components/TableHOC";
import { components } from "react-select";
import { IoIosArrowDown } from "react-icons/io";

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
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="addNew">
				<Bar />
				<h2>Add Owner</h2>
				<section className="owner-details">
					<div>
						<Formik
							initialValues={{
								uploadFile: "",
								ownerImage: "",
								ownerName: "",
								ownerGender: "",
								ownerMobile: "",
								ownerEmail: "",
								ownerAddress: "",
								ownerGST: "",
								ownerPan: "",
								vehicleRegisterOwner: "",
								vehicleBrand: "",
								vehicleModel: "",
								vehicleNumber: "",
								vehicleFRVCode: "",
								vehicleYear: "",
								vehicleType: "",
								vehicleRentCharges: "",
								vehicleCapacity: "",
							}}
							onSubmit={async (values) => {
								await new Promise((r) => setTimeout(r, 500));
								alert(JSON.stringify(values, null, 2));
							}}
						>
							<Form className="form-control">
								<div className="uploadFiles">
									<div className="toggle-div">
										<Field as="select" name="uploadFile" required>
											<option value="aadhar">Aadhar Card</option>
											<option value="pan">Pan Card</option>
											<option value="driving license">Driving License</option>
										</Field>
										{/* Hidden file input element */}
										<input
											id="file"
											name="file"
											type="file"
											style={{ display: "none" }}
											onChange={(event) => {
												// eslint-disable-next-line no-undef
												setFieldValue("file", event.currentTarget.files[0]);
												console.log(event.currentTarget);
											}}
										/>
										{/* Button to trigger file input */}
										<button type="button" onClick={() => document.getElementById("file").click()}>
											Select File
										</button>
										{/* Display selected file name */}
										<Field
											name="file"
											render={({ field }) => (
												<div style={{ color: "rgb(2, 158, 157)" }}>
													Selected File: {field?.value ? field?.value?.name : "None"}
												</div>
											)}
										/>
									</div>
								</div>

								<div className="owner-information">
									<h2>Owner Information</h2>
									<div className="form-elements">
										<div className="image-div">
											<img src={VectorImage} alt="" />
											{/* Hidden file input element */}
											<input
												id="file"
												name="file"
												type="file"
												style={{ display: "none" }}
												onChange={(event) => {
													// eslint-disable-next-line no-undef
													setFieldValue("file", event.currentTarget.files[0]);
													console.log(event.currentTarget);
												}}
											/>
											{/* Button to trigger file input */}
											<button type="button" onClick={() => document.getElementById("file").click()}>
												Select File
											</button>
											{/* Display selected file name */}
											<Field
												name="file"
												render={({ field }) => (
													<div style={{ color: "rgb(2, 158, 157)" }}>
														Selected File: {field?.value ? field?.value?.name : "None"}
													</div>
												)}
											/>
										</div>
										<div className="content-div">
											<Field id="ownerName" name="ownerName" placeholder="Owner Name" type="text" required />
											<Field as="select" name="ownerGender" required>
												<option value="male">Male</option>
												<option value="female">Female</option>
												<option value="others">Other</option>
											</Field>
											<Field id="ownerMobile" name="ownerMobile" placeholder="Owner Mobile" type="mobile" required />
											<Field id="ownerEmail" name="ownerEmail" placeholder="Owner Email" type="text" required />
											<Field id="ownerAddress" name="ownerAddress" placeholder="Owner Address" type="text" required />
											<Field id="ownerGST" name="ownerGST" placeholder="Owner GST Number" type="text" required />
											<Field id="ownerPan" name="ownerPan" placeholder="Owner PAN Number" type="text" required />
										</div>
									</div>
								</div>

								<div className="car-information">
									<h2>Car Information</h2>
									<div className="form-elements">
										<div className="content-div">
											<Field
												id="vehicleRegisteredOwner"
												name="vehicleRegisteredOwner"
												placeholder="Vehicle Registered Owner"
												type="text"
												required
											/>
											<Field id="brandName" name="brandName" placeholder="Brand Name" type="text" required />
											<Field id="modelNumber" name="modelNumber" placeholder="Model Number" type="text" required />
											<Field id="vehicleNumber" name="vehicleNumber" placeholder="Vehicle Number" type="text" required />
											<Field id="vehicleFRVCode" name="vehicleFRVCode" placeholder="FRVCode" type="text" required />
											<Field id="vehicleYear" name="vehicleYear" placeholder="Vehicle Year" type="text" required />
											<Field as="select" id="vehicleType" name="vehicleType" required>
												<option value="ac">AC</option>
												<option value="non-ac">NON AC</option>
											</Field>
											<Field as="select" id="vehicleRentCharges" name="vehicleRentCharges" required>
												<option value="below">Below 100000</option>
												<option value="between">Between 100000 to 1000000</option>
												<option value="above">Above 1000000</option>
											</Field>
											<Field
												id="vehicleRentCharges"
												name="vehicleRentCharges"
												placeholder="Vehicle Rent Charges"
												type="text"
												required
											/>
											<Field id="vehicleCapacity" name="vehicleCapacity" placeholder="Vehicle Capacity" type="text" required />
											<Field as="select" id="vehicleCapacity" name="vehicleCapacity" required>
												<option value="4seater">4 Seater</option>
												<option value="6seater">6 Seater</option>
												<option value="8seater">8 Seater</option>
												<option value="15seater">15 Seater</option>
											</Field>
										</div>
									</div>
								</div>
								<button type="submit">Add Item</button>
							</Form>
						</Formik>
					</div>
					<TableContainer>
						<TableHeading>
							<p>All Bills</p>
						</TableHeading>
						<Table>
							<TableHeaders style={{ gridTemplateColumns: "repeat(6, 1fr) " }} headers={vehicleHeaders} />
							<TableBody TableRow={RowDefault} data={VehicleData} />
						</Table>
					</TableContainer>
				</section>
			</main>
		</div>
	);
};

export default AddNewOwner;
