/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";
import { AiFillFileText, AiTwotoneCar } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";
import { RiDashboardFill } from "react-icons/ri";
import { IoPersonAdd } from "react-icons/io5";
import { BsFileText } from "react-icons/bs";
// eslint-disable-next-line no-unused-vars
import userImg from "../assets/userImage.png";
import { Link, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { Formik, Form, Field } from "formik";
import { RowDefault, Table, TableBody, TableContainer, TableHeaders, TableHeading } from "../components/TableHOC";

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

const Settings = () => {
	const location = useLocation();

	const [showModal, setShowModal] = useState(false);
	const [phoneActive, setPhoneActive] = useState(window.innerWidth < 1000);

	const resizeHandler = () => {
		setPhoneActive(window.innerWidth < 1000);
	};

	useEffect(() => {
		window.addEventListener("resize", resizeHandler);

		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	return (
		<>
			<div className="admin-container">
				<AdminSidebar />
				<main className="dashboard">
					<Bar />
					<h2>Settings</h2>
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
									<div className="owner-information">
										<h2>Owner Information</h2>
										<div className="form-elements">
											<div className="image-div">
												{/* <img src={VectorImage} alt="" /> */}
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
												<Field id="ownerName" name="ownerName" placeholder="Owner Name" type="text" />
												<Field id="ownerMobile" name="ownerMobile" placeholder="Owner Mobile" type="mobile" required />
												<Field id="ownerEmail" name="ownerEmail" placeholder="Owner Email" type="text" required />
												<Field id="ownerAddress" name="ownerAddress" placeholder="Owner Address" type="text" required />
												<Field id="ownerGST" name="ownerGST" placeholder="Owner GST Number" type="text" required />
												<Field id="ownerPan" name="ownerPan" placeholder="Owner PAN Number" type="text" required />
											</div>
										</div>
									</div>

									<button type="submit">Update Details</button>
								</Form>
							</Formik>
						</div>
					</section>
				</main>
			</div>
		</>
	);
};

const DivOne = ({ location }) => (
	<div>
		<ul>
			<Li url="/dashboard" text="Dashboard" Icon={RiDashboardFill} location={location} />
			<Li url="/invoice" text="Invoices" Icon={BsFileText} location={location} />
			<Li url="/cars" text="Car Details" Icon={AiTwotoneCar} location={location} />
			<Li url="/profile/owner" text="Owner Profile" Icon={AiFillFileText} location={location} />
			<Li url="/billings" text="Billings" Icon={AiFillFileText} location={location} />
			<Li url="/owner/new" text="Add New Vendor" Icon={IoPersonAdd} location={location} />
			<Li url="/search" text="Search" Icon={AiFillFileText} location={location} />
			<Li url="/settings" text="Settings" Icon={AiFillFileText} location={location} />
		</ul>
	</div>
);
const Li = ({ url, location, text, Icon }) => (
	<li
		style={{
			backgroundColor: location.pathname.includes(url) ? "white" : "transparent",
		}}
	>
		<Link
			to={url}
			style={{
				fontWeight: location.pathname.includes(url) ? "bold" : "400",
			}}
		>
			<Icon
				style={{
					color: location.pathname.includes(url) ? "black" : "white",
				}}
			/>
			{text}
		</Link>
	</li>
);

export default Settings;
