/* eslint-disable react/prop-types */
import AdminSidebar from "../../components/AdminSidebar";
import Bar from "../../components/Bar";
import { Filter } from "./CarDetails";
import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
// import { toast } from "react-toastify";
// import { XLSX } from "xlsx";
import { read, utils } from "xlsx";
import { toast } from "react-toastify";
import Select, { components } from "react-select";
import { CUSTOME_STYLES } from "../../assets/data/constants";

import { customerHeaders, customerData, ownerSortOptions } from "../../assets/data/owner";
import { TableBody, Table, TableContainer, TableHeaders, TableHeading, OwnerRow } from "../../components/TableHOC";
import { FaSort } from "react-icons/fa";

const expectedColumnOwnerProfile = ["Serial No", "_id", "Owner Name", "Total Vehicle", "Address", "Payment Status"];

//  ?--- dropdown indicator

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

function OwnerProfile() {
	const [file, setFile] = useState("");
	const [fileName, setFileName] = useState("");
	const [isValidFile, setIsValidFile] = useState(false);
	// const [owner, setOwner] = useState(customerData);
	const [sortedData, setSortedData] = useState(customerData);

	const handleUploadFile = (e) => {
		const selectedFile = e.target.files[0];
		if (selectedFile) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const bstr = event.target.result;
				const wb = read(bstr, { type: "binary" });
				const wsname = wb.SheetNames[0];
				const ws = wb.Sheets[wsname];
				// const data = utils.sheet_to_csv(ws, { header: 1 });
				const data = utils.sheet_to_json(ws, { header: 1 })[0];
				console.log(utils.sheet_to_json(ws, { header: 1 })[1]);
				setFile(utils.sheet_to_json(ws, { header: 1 }));
				setFileName(selectedFile.name);
				// console.log(data);
				validateExcelFile(data);
			};
			reader.readAsBinaryString(selectedFile);
		} else {
			console.error("No file selected");
		}
	};

	const validate = (fileContent, expectedColumnOwnerProfile) => {
		let isTrue = true;
		fileContent.forEach((curr, index) => {
			if (curr !== expectedColumnOwnerProfile[index]) {
				// console.table(curr == expectedColumnOwnerProfile[index]);
				isTrue = false;
			}
			// console.table(curr, expectedColumnOwnerProfile[index]);
		});
		return isTrue;
	};

	const validateExcelFile = (fileContent) => {
		const isValid = validate(fileContent, expectedColumnOwnerProfile);
		// console.log(isValid);
		setIsValidFile(isValid);
		if (!isValid) {
			toast.error("Invalid File Format");
			setFile("");
			setFileName("");
		} else {
			toast.success("file uploaded successfully");
		}
	};

	const handleSortChange = (selectedOption) => {
		let sortedDataCopy = [...customerData];
		if (selectedOption.value === "kilometers") {
			sortedDataCopy.sort((a, b) => {
				const kilometersA = parseInt(a.data[2].replace(/ km/g, ""));
				const kilometersB = parseInt(b.data[2].replace(/ km/g, ""));
				return kilometersA - kilometersB;
			});
		} else if (selectedOption.value === "amount") {
			sortedDataCopy.sort((a, b) => a.data[5] - b.data[5]);
		} else if (selectedOption.value === "days") {
			sortedDataCopy.sort((a, b) => parseInt(a.data[4].replace(" days", "")) - parseInt(b.data[4].replace(" days", "")));
		} else if (selectedOption.value === "rate") {
			sortedDataCopy.sort((a, b) => {
				const rateA = parseFloat(a.data[3].replace("/day", ""));
				const rateB = parseFloat(b.data[3].replace("/day", ""));
				return rateA - rateB;
			});
		}
		setSortedData(sortedDataCopy);
	};

	useEffect(() => {
		const readFile = () => {
			if (file) {
				file.map((fileItem, idx) => {
					// let customerObj = {};
					if (idx !== 0) {
						const _id = fileItem[1];
						const status = fileItem[fileItem.length - 1];
						const data = fileItem.filter((item, index) => {
							if (index == 1 || index == fileItem.length - 1) {
								return false;
							} else {
								return true;
							}
						});
						setSortedData((prev) => [...prev, { _id, data, status }]);
					}
				});
			}
			console.log(sortedData);
		};
		readFile();
	}, [file, setFile, sortedData]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Owner Profile</h2>
				<Filter isOwnerProfile={true} />
				<TableContainer>
					<TableHeading>
						<p>All Bills</p>
						<Select
							defaultValue={ownerSortOptions[0]}
							options={ownerSortOptions}
							components={{ DropdownIndicator }}
							onChange={handleSortChange}
							styles={CUSTOME_STYLES}
						/>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${customerHeaders.length},1fr)` }} headers={customerHeaders} />
						<TableBody TableRow={OwnerRow} data={customerData} />
					</Table>
				</TableContainer>
				<form className="addFile">
					{!file && !isValidFile && (
						<>
							<label htmlFor="file">
								<i className="fas fa-file-upload"></i> Upload File
							</label>

							<input
								type="file"
								id="file"
								name="file"
								accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
								onChange={handleUploadFile}
							/>
						</>
					)}
					{file && isValidFile && (
						<>
							<p>{fileName}</p>
							<IoCloseSharp
								style={{ cursor: "pointer", fontSize: "1.3rem" }}
								onClick={() => {
									setFile(""), setIsValidFile(false);
								}}
							/>
						</>
					)}
				</form>
			</main>
		</div>
	);
}

export default OwnerProfile;
