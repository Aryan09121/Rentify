/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import TableSearchTOC from "../components/TableSearchHOC";
import { useNavigate } from "react-router-dom";

const columns = [
	{
		Header: "Avatar",
		accessor: "avatar",
	},
	{
		Header: "Owner Name",
		accessor: "name",
	},
	{
		Header: "Total Vehicle",
		accessor: "vehicle",
	},
	{
		Header: "Address",
		accessor: "address",
	},
	{
		Header: "Email",
		accessor: "email",
	},
];

const img = "https://i.pinimg.com/736x/f4/a3/4e/f4a34ef7fd2f8d3a347a8c0dfb73eece.jpg";
const img1 = "https://wallpapers.com/images/hd/cute-avatar-profile-picture-23yuqpb8wz1dqqqv.jpg";

const arr = [
	{
		avatar: <img src={img} style={{ borderRadius: "50%" }} alt="profile image" />,
		name: "Aryan Gupta",
		vehicle: "9",
		address: "Bhopal",
		email: "911aaryan@gmail.com",
		_id: "101",
	},
	{
		avatar: <img src={img1} alt="Shoes" />,
		name: "Neha Sharma",
		vehicle: "5",
		address: "Indore",
		email: "test1@gmail.com",
		_id: "105",
	},
	{
		avatar: <img src={img} style={{ borderRadius: "50%" }} alt="profile image" />,
		name: "Aryan Gupta",
		vehicle: "9",
		address: "Bhopal",
		email: "911aaryan@gmail.com",
		_id: "101",
	},
	{
		avatar: <img src={img1} alt="Shoes" />,
		name: "Neha Sharma",
		vehicle: "5",
		address: "Indore",
		email: "test1@gmail.com",
		_id: "105",
	},
	{
		avatar: <img src={img} style={{ borderRadius: "50%" }} alt="profile image" />,
		name: "Aryan Gupta",
		vehicle: "9",
		address: "Bhopal",
		email: "911aaryan@gmail.com",
		_id: "101",
	},
	{
		avatar: <img src={img1} alt="Shoes" />,
		name: "Neha Sharma",
		vehicle: "5",
		address: "Indore",
		email: "test1@gmail.com",
		_id: "105",
	},
	{
		avatar: <img src={img} style={{ borderRadius: "50%" }} alt="profile image" />,
		name: "Aryan Gupta",
		vehicle: "9",
		address: "Bhopal",
		email: "911aaryan@gmail.com",
		_id: "101",
	},
	{
		avatar: <img src={img1} alt="Shoes" />,
		name: "Neha Sharma",
		vehicle: "5",
		address: "Indore",
		email: "test1@gmail.com",
		_id: "105",
	},
	{
		avatar: <img src={img} style={{ borderRadius: "50%" }} alt="profile image" />,
		name: "Aryan Gupta",
		vehicle: "9",
		address: "Bhopal",
		email: "911aaryan@gmail.com",
		_id: "101",
	},
	{
		avatar: <img src={img1} alt="Shoes" />,
		name: "Neha Sharma",
		vehicle: "5",
		address: "Indore",
		email: "test1@gmail.com",
		_id: "105",
	},
	{
		avatar: <img src={img} style={{ borderRadius: "50%" }} alt="profile image" />,
		name: "Aryan Gupta",
		vehicle: "9",
		address: "Bhopal",
		email: "911aaryan@gmail.com",
		_id: "101",
	},
	{
		avatar: <img src={img1} alt="Shoes" />,
		name: "Neha Sharma",
		vehicle: "5",
		address: "Indore",
		email: "test1@gmail.com",
		_id: "105",
	},
	{
		avatar: <img src={img} style={{ borderRadius: "50%" }} alt="profile image" />,
		name: "Aryan Gupta",
		vehicle: "9",
		address: "Bhopal",
		email: "911aaryan@gmail.com",
		_id: "101",
	},
	{
		avatar: <img src={img1} alt="Shoes" />,
		name: "Neha Sharma",
		vehicle: "5",
		address: "Indore",
		email: "test1@gmail.com",
		_id: "105",
	},
];

function Search() {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const [data, setData] = useState(arr);

	const handleRowClick = (row) => {
		// Access _id property from the row's original data and redirect to the desired page
		const { _id } = row.original;
		navigate(`/profile/owner/${_id}`);
	};

	const handleSearch = (e) => {
		const searchTerm = e.target.value;
		setQuery(searchTerm);
	};

	useEffect(() => {
		const filteredData = arr.filter(
			(item) =>
				item.name.toLowerCase().includes(query.toLowerCase()) ||
				item.email.toLowerCase().includes(query.toLowerCase()) ||
				item.address.toLowerCase().includes(query.toLowerCase()) // Include city search
		);
		console.log(filteredData);
		setData(filteredData);
	}, [query]);

	const Table = useCallback(TableSearchTOC(columns, data, "dashboard-product-box", "Customers", true, 6, handleRowClick), [data]);
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="search">
				<Bar query={query} handleSearch={handleSearch} />
				{Table()}
			</main>
		</div>
	);
}

export default Search;
