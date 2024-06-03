/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { useEffect, useState } from "react";
import TxtLoader from "../components/TxtLoader";

import { customerHeaders } from "../assets/data/owner";
import { TableBody, Table, TableContainer, TableHeaders, TableHeading, OwnerRow } from "../components/TableHOC";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getOwners } from "../redux/actions";

function OwnerProfile() {
	const [sortedData, setSortedData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [query, setQuery] = useState("");
	const { owners, loading } = useSelector((state) => state.owner);
	const dispatch = useDispatch();

	useEffect(() => {
		if (owners) {
			// console.log(owners);

			const ownerList = owners.map((owner) => {
				let status = owner.bills.length > 0 ? "pending" : "paid";

				return {
					data: [owner?.name, `${owner?.cars?.length} cars`, owner?.address?.street],
					status,
					_id: owner._id,
				};
			});

			setSortedData(ownerList);
		}
	}, [owners]);

	useEffect(() => {
		if (query) {
			const filtered = sortedData.filter((owner) => {
				// Filter based on owner name or any other relevant data
				return owner.data.some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
			});
			setFilteredData(filtered);
		} else {
			setFilteredData([]);
		}
	}, [query, sortedData]);

	useEffect(() => {
		dispatch(getOwners());
	}, []);

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="ownerProfile">
				<Bar />
				<h2>Owner Profile</h2>
				{/* <Filter isOwnerProfile={true} onClickSearchHandler={searchOwner} /> */}
				<TableContainer>
					<TableHeading>
						<p>Owner Profile</p>
						<button>
							<FaSearch /> <input onChange={(e) => setQuery(e.target.value)} value={query} type="text" placeholder="Search..." />
						</button>
					</TableHeading>
					<Table>
						<TableHeaders style={{ gridTemplateColumns: `repeat(${customerHeaders.length},1fr)` }} headers={customerHeaders} />
						{loading ? <TxtLoader /> : <TableBody TableRow={OwnerRow} data={query ? filteredData : sortedData} />}
					</Table>
				</TableContainer>
			</main>
		</div>
	);
}

export default OwnerProfile;
