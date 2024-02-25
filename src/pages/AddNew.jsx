/* eslint-disable react/prop-types */
import AdminSidebar from "../components/AdminSidebar";
import { FaArrowRight } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

import Bar from "../components/Bar";
import Select, { components } from "react-select";
import { Link } from "react-router-dom";

const options1 = [
	{ value: "", label: "Search Owner" },
	{ value: "price", label: "Price" },
	{ value: "condition", label: "Condition" },
	{ value: "distance", label: "Distance Travelled" },
];

const options2 = [
	{ value: "", label: "Vehicles" },
	{ value: "price", label: "Price" },
	{ value: "condition", label: "Condition" },
	{ value: "distance", label: "Distance Travelled" },
];

const options3 = [
	{ value: "", label: "Year" },
	{ value: "price", label: "Price" },
	{ value: "condition", label: "Condition" },
	{ value: "distance", label: "Distance Travelled" },
];

const DropdownIndicator = (props) => {
	return (
		<components.DropdownIndicator {...props}>
			<IoIosArrowDown />
		</components.DropdownIndicator>
	);
};

const customStyles = {
	control: (provided) => ({
		...provided,
		// padding: "0.3rem 0.6rem",
		cursor: "pointer",
		backgroundColor: "#fff",
		transition: "all 0.3s ease-in-out",
		"&:hover, &:focus": {
			backgroundColor: "#fff",
			color: "rgb(2, 158, 157)",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.2rem",
		borderRadius: "10px",
		fontSize: "1.1rem",
		opacity: "0.8",
		transition: "all 0.3s ease-in-out",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#000",
		fontSize: "2rem",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
};

const AddNew = () => {
	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="addNew">
				<Bar />
				<h2>Add Owner</h2>
				<section className="widget-container">
					<WidgetItem designation="Owner" percent={2.8} value={243} />
					<WidgetItem designation="Driver" percent={-2.5} value={143} />
					<WidgetItem designation="Employee" percent={4} value={243} />
				</section>
				<section className="graph-container">
					<div className="car-chart">
						<div className="nav-toggles">
							<div className="toggle-div">
								<Select
									className="filter"
									defaultValue={options1[0]}
									options={options1}
									components={{ DropdownIndicator }}
									styles={customStyles}
								/>
							</div>
							<div className="right-toggles">
								<div className="toggle-div">
									<Select
										className="filter"
										defaultValue={options2[0]}
										options={options2}
										components={{ DropdownIndicator }}
										styles={customStyles}
									/>
								</div>
								<div className="toggle-div">
									<Select
										className="filter"
										defaultValue={options3[0]}
										options={options3}
										components={{ DropdownIndicator }}
										styles={customStyles}
									/>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
};

const WidgetItem = ({ value, designation }) => (
	<article className="widget">
		<div>
			Total {designation} <FaArrowRight />
		</div>
		<h2>{Math.abs(value)}</h2>
		<div className="add-new">
			<Link to="/add/new/owner">
				Add New {designation} <IoMdAdd />
			</Link>
		</div>
	</article>
);

export default AddNew;
