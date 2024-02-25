import { FaSort } from "react-icons/fa";
import { Link } from "react-router-dom";
import Select, { components } from "react-select";

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<FaSort />
		</components.DropdownIndicator>
	);
};

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

/* eslint-disable react/prop-types */
function Table({
	data,
	headers,
	isAllBill = false,
	children,
	length,
	handleSortChange,
	isDriver = false,
	className = "tableContainers",
	sortOptions,
	isOwnerProfile = false,
	isDashboard = false,
	isBill = false,
}) {
	return (
		<section className={className}>
			<div className="tableHeading">
				{children}
				{!isBill && sortOptions && (
					<Select
						defaultValue={sortOptions[0]}
						options={sortOptions}
						components={{ DropdownIndicator }}
						onChange={handleSortChange}
						styles={customStyles}
					/>
				)}
			</div>

			<div className="Table">
				<div
					className="headers"
					style={isBill ? { gridTemplateColumns: `1fr 4fr 1fr 1fr 1fr 1fr` } : { gridTemplateColumns: `repeat(${length},1fr)` }}
				>
					{headers.map((header, index) => {
						return <h3 key={index}>{header}</h3>;
					})}
				</div>
				<div className="tableContentBody">
					{data.map((row) => {
						return (
							<Row
								isAllBill={isAllBill}
								isBill={isBill}
								length={length}
								isOwnerProfile={isOwnerProfile}
								isDashboard={isDashboard}
								key={row._id}
								id={row._id}
								isDriver={isDriver}
								driverId={row?.driver_id}
								status={row.status}
								tdata={isDriver === true ? row : row.data}
							/>
						);
					})}
					{isBill && (
						<div className="billTotal tableContents">
							<div>
								<h4>Taxable Value (%)</h4>
								<h4>29,82269.99</h4>
							</div>
							<div>
								<h4>GST @ 5%</h4>
								<h4>1,49,113.47</h4>
							</div>
							<div>
								<h4>Total (Rs)</h4>
								<h4>31382.91</h4>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

const Row = ({ tdata, driverId, isAllBill, length, isBill, id, status, isOwnerProfile, isDashboard, isDriver }) => {
	if (isDashboard) {
		return (
			<Link to={`/trip/${id}`} className="tableContents" style={{ gridTemplateColumns: `repeat(${length},1fr)` }}>
				{tdata.map((data) => {
					return <h3 key={data}>{data}</h3>;
				})}

				<button className={status === "Ongoing" ? "tableBtn greenbg" : status === "Reached" ? "tableBtn redbg" : "tableBtn yellowbg"}>
					{status}
				</button>
			</Link>
		);
	}
	if (isDriver) {
		return (
			<Link to={`/profile/driver/${driverId}`} className="tableContents" style={{ gridTemplateColumns: `repeat(${length},1fr)` }}>
				{<h3>{tdata.driverName}</h3>}
				<button className={status === "On Trip" ? "tableBtn purplebg" : status === "On Leave" ? "tableBtn redbg" : "tableBtn greenbg"}>
					{status}
				</button>
			</Link>
		);
	}

	if (isOwnerProfile === true) {
		return (
			<Link to={`/profile/owner/${id}`} className="tableContents" style={{ gridTemplateColumns: `repeat(${length},1fr)` }}>
				{tdata.map((data) => {
					return <h3 key={data}>{data}</h3>;
				})}

				<button className={status === "ongoing" ? "tableBtn purplebg" : status === "pending" ? "tableBtn redbg" : "tableBtn greenbg"}>
					{status}
				</button>
			</Link>
		);
	} else if (isAllBill === true) {
		return (
			<Link to={`/billings/${id}`} className="tableContents" style={{ gridTemplateColumns: `repeat(${length},1fr)` }}>
				{tdata.map((data) => {
					return <h3 key={data}>{data}</h3>;
				})}
			</Link>
		);
	} else {
		return (
			<div
				style={isBill ? { gridTemplateColumns: `1fr 4fr 1fr 1fr 1fr 1fr` } : { gridTemplateColumns: `repeat(${length},1fr)` }}
				className="tableContents"
			>
				{tdata.map((data) => {
					return (
						<h3 style={{ textWrap: "balance", textAlign: "left" }} key={data}>
							{data}
						</h3>
					);
				})}
			</div>
		);
	}
};

export default Table;
