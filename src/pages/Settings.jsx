import userImg from "../assets/userImage.png";
import { RxUpdate } from "react-icons/rx";
import Files from "react-files";
import AdminSidebar from "../components/AdminSidebar";
import Bar from "../components/Bar";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getGst, modifyGst, updateRate } from "../redux/actions/setting.action";
import { getAllCars } from "../redux/actions";
import Select, { components } from "react-select";
import { IoIosArrowDown } from "react-icons/io";

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
		padding: "0.3rem 0.6rem",
		cursor: "pointer",
		width: "250px",
		marginLeft: "auto",
		marginRight: "auto",
		backgroundColor: "#fff",
		transition: "all 0.3s ease-in-out",
		border: "2.5px solid rgb(2, 158, 157)",
		Outline: "none",
		"&:hover, &:focus": {
			backgroundColor: "#fff",
			// padding: "0.2rem",
			color: "rgb(2, 158, 157)",
		},
	}),
	singleValue: (provided) => ({
		...provided,
		padding: "0.1rem",
		Outline: "none",
		borderRadius: "10px",
		fontSize: "1rem",
		marginRight: "auto",
		marginLeft: "auto",
		width: "250px",
		opacity: "0.8",
		transition: "all 0.3s ease-in-out",
		"&:hover, &:focus": {
			// padding: "0.3rem 0.6rem",
			color: "rgb(2, 158, 157)",
		},
	}),
	dropdownIndicator: (provided) => ({
		...provided,
		color: "#000",
		width: "fit-content",
		fontSize: "1rem",
		"&:hover, &:focus": {
			color: "rgb(2, 158, 157)",
		},
	}),
};

const Settings = () => {
	const [selectedSettings, setSelectedSettings] = useState("day");

	return (
		<>
			<div className="admin-container">
				<AdminSidebar />
				<main className="settings">
					<Bar />
					<h2>Settings</h2>
					<section className="formUpdation">
						{selectedSettings === "day" && <DayRateUpdate />}
						{selectedSettings === "km" && <KmRateUpdate />}
						{selectedSettings === "gst" && <UpdateGst />}
					</section>
					<section className="updateContainer">
						<button onClick={() => setSelectedSettings("day")}>
							Update Day Rate <RxUpdate />
						</button>
						<button onClick={() => setSelectedSettings("km")}>
							Update Kilometer Rate <RxUpdate />
						</button>
						<button onClick={() => setSelectedSettings("gst")}>
							Update GST VALUE
							<RxUpdate />
						</button>
					</section>
				</main>
			</div>
		</>
	);
};

export default Settings;

// eslint-disable-next-line no-unused-vars
const DayRateUpdate = () => {
	const [dayRate, setDayRate] = useState();
	const { message, error, loading } = useSelector((state) => state.settings);
	const { allcars } = useSelector((state) => state.car);
	const [cars, setCars] = useState([]);
	const [model, setModel] = useState();
	const dispatch = useDispatch();

	const updateDayRate = () => {
		if (model && dayRate) {
			const data = {
				model,
				rate: dayRate,
			};
			dispatch(updateRate(data, "day"));
		}
	};

	useEffect(() => {
		dispatch(getAllCars());
	}, []);

	useEffect(() => {
		if (allcars && allcars.length > 0) {
			const uniqueModels = new Set();
			const data = allcars.reduce((acc, car) => {
				if (!uniqueModels.has(car.model)) {
					uniqueModels.add(car.model);
					acc.push({
						value: car.model,
						label: car.model,
					});
				}
				return acc;
			}, []);

			// console.log(data);

			setCars(data);
			setModel(data[0].value);
		}
	}, [allcars]);

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
		<div className="logoUpdate">
			<Select
				className="filter"
				defaultValue={cars[0]}
				options={cars}
				value={{ value: model, label: model }}
				components={{ DropdownIndicator }}
				styles={customStyles}
				id="company"
				onChange={(e) => setModel(e.value)}
			/>
			<input type="text" placeholder="Enter Day Rate..." value={dayRate} onChange={(e) => setDayRate(e.target.value)} />
			<button disabled={loading} onClick={() => updateDayRate()}>
				{loading ? "Loading..." : "Update Day Rate"}
			</button>
		</div>
	);
};
// eslint-disable-next-line no-unused-vars
const KmRateUpdate = () => {
	const [kmRate, setKmRate] = useState();
	const { message, error, loading } = useSelector((state) => state.settings);
	const { allcars } = useSelector((state) => state.car);
	const [cars, setCars] = useState([]);
	const [model, setModel] = useState();
	const dispatch = useDispatch();

	const updateDayRate = () => {
		if (model && kmRate) {
			const data = {
				model,
				rate: kmRate,
			};
			dispatch(updateRate(data, "km"));
		}
	};

	useEffect(() => {
		dispatch(getAllCars());
	}, []);

	useEffect(() => {
		if (allcars && allcars.length > 0) {
			const uniqueModels = new Set();
			const data = allcars.reduce((acc, car) => {
				if (!uniqueModels.has(car.model)) {
					uniqueModels.add(car.model);
					acc.push({
						value: car.model,
						label: car.model,
					});
				}
				return acc;
			}, []);

			setCars(data);
			setModel(data[0].value);
		}
	}, [allcars]);

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
		<div className="logoUpdate">
			<Select
				className="filter"
				defaultValue={cars[0]}
				options={cars}
				value={{ value: model, label: model }}
				components={{ DropdownIndicator }}
				styles={customStyles}
				id="company"
				onChange={(e) => {
					setModel(e.value);
				}}
			/>
			<input type="text" placeholder="Enter Km Rate..." value={kmRate} onChange={(e) => setKmRate(e.target.value)} />

			<button disabled={loading} onClick={() => updateDayRate()}>
				{loading ? "Loading..." : "Update KM Rate"}
			</button>
		</div>
	);
};
const UpdateGst = () => {
	const [gst, setGst] = useState();
	const { gst: gstValue, message, error } = useSelector((state) => state.settings);
	const dispatch = useDispatch();

	const updateGst = () => {
		dispatch(modifyGst(gst));
	};

	useEffect(() => {
		dispatch(getGst());
	}, []);

	useEffect(() => {
		if (gstValue) {
			setGst(gstValue);
		}
	}, [gstValue]);

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
		<div className="logoUpdate">
			<input type="text" placeholder="gst in %" value={gst} onChange={(e) => setGst(e.target.value)} />
			<button onClick={() => updateGst()}>Update GST</button>
		</div>
	);
};
