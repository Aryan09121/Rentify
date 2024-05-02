/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import TableSearchTOC from "../components/TableSearchHOC";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userImg from "../assets/userImage.png";
import { getOwners } from "../redux/actions";

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

function Search() {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();
	const { owners } = useSelector((state) => state.owner);
	const [data, setData] = useState([]);
	const [ownersdata, setOwnersdata] = useState();
	const dispatch = useDispatch();
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
		dispatch(getOwners());
	}, []);

	useEffect(() => {
		if (owners) {
			const ownerlist = [];
			owners.map((owner) => {
				const singleOwner = {
					avatar: <img src={owner?.avatar?.url ? owner?.avatar?.url : userImg} alt={owner.name} />,
					name: owner.name,
					vehicle: owner.cars.length,
					address: owner.address.city,
					email: owner.email,
					_id: owner._id,
				};
				ownerlist.push(singleOwner);
			});
			setOwnersdata(ownerlist);
		}
	}, [owners]);

	useEffect(() => {
		if (ownersdata) {
			const filteredData = ownersdata.filter(
				(item) =>
					item.name.toLowerCase().includes(query.toLowerCase()) ||
					item.email.toLowerCase().includes(query.toLowerCase()) ||
					item.address.toLowerCase().includes(query.toLowerCase()) // Include city search
			);
			setData(filteredData);
		}
	}, [query, ownersdata]);

	const Table = useCallback(TableSearchTOC(columns, data, "dashboard-product-box", "Owners", true, 6, handleRowClick), [data]);
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
