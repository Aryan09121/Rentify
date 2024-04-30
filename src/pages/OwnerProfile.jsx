/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { Filter } from "./CarDetails";
import { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { CUSTOME_STYLES } from "../assets/data/constants";

import { customerHeaders, customerData, ownerSortOptions } from "../assets/data/owner";
import { TableBody, Table, TableContainer, TableHeaders, TableHeading, OwnerRow } from "../components/TableHOC";
import { FaSort } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

//  ?--- dropdown indicator

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

// {
// 	"data": [
// 	    "1",
// 	    "M.S, Subramanium",
// 	    "4 Cars",
// 	    "Vishakhapatnam"
// 	],
// 	"status": "ongoing",
// 	"_id": 1
//  }

// {
// 	"address": {
// 	    "street": "Indrapuri A Sector, Abadhpuri",
// 	    "city": "Bhopal",
// 	    "state": "Madhya Pradesh",
// 	    "pincode": "462021"
// 	},
// 	"_id": "65f1367885c1e082a0c7f9f1",
// 	"name": "Priyal Upadhyay",
// 	"contact": "7723423484",
// 	"gender": "female",
// 	"email": "priyal.upadhyay@gmail.com",
// 	"hsn": "DF65PDBR",
// 	"pan": "DYXLI5621",
// 	"joinedDate": "2024-03-13T05:15:36.073Z",
// 	"avatar": {
// 	    "fileId": "",
// 	    "url": "https://cdn.vectorstock.com/i/1000x1000/62/59/default-avatar-photo-placeholder-profile-icon-vector-21666259.webp"
// 	},
// 	"cars": [
// 	    "65f1367885c1e082a0c7f9f3",
// 	    "65f1367885c1e082a0c7f9f7"
// 	],
// 	"createdAt": "2024-03-13T05:15:36.079Z",
// 	"updatedAt": "2024-03-13T07:24:05.201Z",
// 	"__v": 2
//  }

function OwnerProfile() {
	const [sortedData, setSortedData] = useState([]);
	const { owners } = useSelector((state) => state.owner);

	useEffect(() => {
		if (owners) {
			const ownerList = owners.map((owner, idx) => ({
				data: [idx, owner?.name, `${owner?.cars?.length} cars`, owner?.address?.city],
				status: "ongoig",
				_id: owner._id,
			}));
			setSortedData(ownerList);
		}
	}, [owners]);

	// ? handle sorting functionalities
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

	const searchOwner = (e, query) => {
		e.preventDefault();
		const filteredData = customerData.filter((item) => {
			// Adjust this condition based on your data structure
			// Here assumed item.data[1] contains the field to search
			const searchData = item.data.map((value) => value.toLowerCase());
			return searchData.some((value) => value.includes(query.toLowerCase()));
		});
		console.log(filteredData);
		if (filteredData.length === 0) {
			toast.error("Data Not Found");
		}
		setSortedData(() => filteredData);
	};

	// useEffect(() => {
	// 	const filteredData = customerData.filter((item) => {
	// 		// Adjust this condition based on your data structure
	// 		// Here assumed item.data[1] contains the field to search
	// 		const searchData = item.data.map((value) => value.toLowerCase());
	// 		return searchData.some((value) => value.includes(query.toLowerCase()));
	// 	});
	// 	console.log(filteredData);
	// 	const id = setTimeout(() => {
	// 		setSortedData(() => filteredData);
	// 	}, 1000);

	// 	return () => {
	// 		clearInterval(id);
	// 		// setSortedData(customerData);
	// 	};
	// }, [query, sortedData]);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Owner Profile</h2>
				<Filter isOwnerProfile={true} onClickSearchHandler={searchOwner} />
				<TableContainer>
					<TableHeading>
						<p>Owner Profile</p>
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
						<TableBody TableRow={OwnerRow} data={sortedData} />
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default OwnerProfile;
