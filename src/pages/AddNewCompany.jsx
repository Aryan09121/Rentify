/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { TiTick } from "react-icons/ti";
import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import readXlsxFile from "read-excel-file";
import { useDispatch, useSelector } from "react-redux";
import { addCompanies, addSingleComapny } from "../redux/actions/company.action";
import { Loader } from "../components";

// const ownersCarHeaders = ["Serial No", "Brand Name", "Kilometers", "Rate", "Total Days", "Amount"];

const expectedOwnerHeaders = ["Company Name", "GSTIN Number", "HSN Services No", "PAN Number", "Phone Number", "address"];

const AddNewOwner = () => {
	const { message, error, loading } = useSelector((state) => state.company);
	const dispatch = useDispatch();

	// ? excel file
	const [companyFinal, setCompanyFinal] = useState([]);
	// const dispatch = useDispatch();
	// const { loading, message, error } = useSelector((state) => state.owner);

	// owner personal details
	const [company, setCompany] = useState({
		name: "",
		phone: "",
		email: "",
		gst: "",
		pan: "",
		hsn: "",
		address: "",
	});

	const handleCompanyFileUpload = (event) => {
		const file = event.target.files[0];
		readCompanyExcelFile(file);
		event.target.value = null;
	};

	const readCompanyExcelFile = (file) => {
		readXlsxFile(file)
			.then((rows) => {
				// Skip header row if necessary
				const companyHeaders = rows[0];
				const companyHeadersLower = companyHeaders.map((header) => header.toLowerCase());
				const companyData = rows.slice(1);
				const arraysAreEqual =
					expectedOwnerHeaders.length === companyHeadersLower.length &&
					expectedOwnerHeaders.every((value, index) => value.toLowerCase() === companyHeadersLower[index]);

				if (arraysAreEqual) {
					const newarr = companyData.map((data) => {
						return {
							name: data[0],
							gst: data[1],
							hsn: data[2],
							pan: data[3],
							phone: data[4],
							address: data[5],
						};
					});
					// console.log(newarr);
					setCompanyFinal(newarr);
					return toast.success("Company Data Read Successfully");
				} else {
					return toast.error("Invalid File Format");
				}
			})
			.catch((error) => {
				console.error("Error reading Company Excel file:", error);
			});
	};

	const onInputChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;

		setCompany((prev) => {
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const removeCompany = () => {
		setCompanyFinal([]);
	};

	// ?? adding owners through form
	const companyDetailsSubmitHandler = (e) => {
		e.preventDefault();
		if (companyFinal.length === 0) {
			dispatch(addSingleComapny(company));
		}
	};

	// ?? adding owners through excel files
	const excelSubmitHandler = (e) => {
		e.preventDefault();
		dispatch(addCompanies(companyFinal));
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
			{loading && <Loader />}
			{!loading && (
				<main className="addNewForm">
					<Bar />
					<h2>Add Company</h2>
					<section className="newOwnerFormContainer">
						<form className="formContainer" onSubmit={(e) => companyDetailsSubmitHandler(e)}>
							<section className="documentUploader">
								<h3>Upload Company&apos;s Data File</h3>
								{companyFinal.length !== 0 && (
									<p className="green">
										<TiTick /> Owner&apos;s data Uploaded Succesfully
										<span className="red" onClick={removeCompany}>
											<IoIosClose />
										</span>
									</p>
								)}
								<input type="file" onChange={handleCompanyFileUpload} />
							</section>
							{companyFinal.length === 0 ? (
								<>
									<section className="ownerDetails">
										<h3>Company Information</h3>
										<div className="ownerDetailsFormDiv">
											<div className="ownerDataUpload">
												<div>
													<input
														type="text"
														name="name"
														value={company.name}
														onChange={onInputChange}
														placeholder="Comapny Name *"
													/>
													<input
														type="text"
														name="phone"
														value={company.phone}
														placeholder="Mobile Number *"
														onChange={onInputChange}
														required
														pattern="[0-9]{10}"
													/>
												</div>
												<div>
													<input
														type="text"
														value={company.hsn}
														name="hsn"
														onChange={onInputChange}
														placeholder="HSN Services No *"
														required
													/>
													<input
														type="email"
														placeholder="Email *"
														onChange={onInputChange}
														required
														name="email"
														value={company.email}
													/>
												</div>
												<div>
													<input
														type="text"
														name="gst"
														value={company.gst}
														onChange={onInputChange}
														placeholder="GST Number *"
														required
													/>
													<input
														type="text"
														value={company.pan}
														name="pan"
														onChange={onInputChange}
														placeholder="PAN Card Number *"
														required
													/>
												</div>
												<div>
													<input
														type="text"
														onChange={(e) => {
															setCompany((curr) => {
																return {
																	...curr,
																	address: e.target.value,
																};
															});
														}}
														value={company.address.street}
														placeholder="Locality"
													/>
												</div>
											</div>
										</div>
									</section>
								</>
							) : null}
							{companyFinal.length === 0 ? (
								<button type="submit">Add Company</button>
							) : (
								<button onClick={excelSubmitHandler}>Add Company</button>
							)}
						</form>
					</section>
				</main>
			)}
		</div>
	);
};

export default AddNewOwner;
