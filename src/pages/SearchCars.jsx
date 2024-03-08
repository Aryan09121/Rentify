/* eslint-disable no-unused-vars */
import AdminSidebar from "../components/AdminSidebar";
import TableSearchTOC from "../components/TableSearchHOC";
import Bar from "../components/CarBar";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
	{
		Header: "S No.",
		accessor: "sno",
	},
	{
		Header: "District",
		accessor: "district",
	},
	{
		Header: "Vehicle Reg.no",
		accessor: "registrationno",
	},
	{
		Header: "Make",
		accessor: "make",
	},
	{
		Header: "Model",
		accessor: "model",
	},
	{
		Header: "Year",
		accessor: "year",
	},
	{
		Header: "FRV CODE",
		accessor: "frv",
	},
	{
		Header: "Month",
		accessor: "month",
	},
	{
		Header: "Start",
		accessor: "start",
	},
	{
		Header: "End",
		accessor: "end",
	},
	{
		Header: "Qty",
		accessor: "qty",
	},
	{
		Header: "Unit",
		accessor: "unit",
	},
	{
		Header: "Rate",
		accessor: "rate",
	},
	{
		Header: "Amount",
		accessor: "amount",
	},
];

const arr = [
	{
		sno: 1,
		district: "Bhopal",
		registrationno: "MP67C1469",
		make: "Mahindra",
		model: "Bolero",
		year: 2016,
		frv: "Ask-03",
		month: "July",
		start: 655,
		end: 1755,
		qty: 10,
		unit: "km",
		rate: 100,
		amount: 76343,
	},
	{
		sno: 2,
		district: "Indore",
		registrationno: "MP55D2890",
		make: "Maruti",
		model: "Swift",
		year: 2018,
		frv: "Bsk-01",
		month: "June",
		start: 400,
		end: 1800,
		qty: 14,
		unit: "km",
		rate: 120,
		amount: 100800,
	},
	{
		sno: 3,
		district: "Gwalior",
		registrationno: "MP29F5678",
		make: "Hyundai",
		model: "i20",
		year: 2019,
		frv: "Csk-05",
		month: "September",
		start: 300,
		end: 1500,
		qty: 12,
		unit: "km",
		rate: 110,
		amount: 87120,
	},
	{
		sno: 4,
		district: "Jabalpur",
		registrationno: "MP43G4897",
		make: "Toyota",
		model: "Innova",
		year: 2017,
		frv: "Dsk-02",
		month: "April",
		start: 800,
		end: 2500,
		qty: 18,
		unit: "km",
		rate: 130,
		amount: 152100,
	},
	{
		sno: 5,
		district: "Ujjain",
		registrationno: "MP89H6785",
		make: "Honda",
		model: "City",
		year: 2015,
		frv: "Esk-04",
		month: "February",
		start: 500,
		end: 2000,
		qty: 15,
		unit: "km",
		rate: 115,
		amount: 92100,
	},
	{
		sno: 6,
		district: "Rewa",
		registrationno: "MP32J2345",
		make: "Ford",
		model: "Ecosport",
		year: 2020,
		frv: "Fsk-07",
		month: "November",
		start: 200,
		end: 1200,
		qty: 10,
		unit: "km",
		rate: 105,
		amount: 66150,
	},
	{
		sno: 7,
		district: "Sagar",
		registrationno: "MP76K9876",
		make: "Volkswagen",
		model: "Polo",
		year: 2018,
		frv: "Gsk-06",
		month: "October",
		start: 350,
		end: 1800,
		qty: 13,
		unit: "km",
		rate: 125,
		amount: 86750,
	},
	{
		sno: 8,
		district: "Chhindwara",
		registrationno: "MP21L7654",
		make: "Tata",
		model: "Tiago",
		year: 2019,
		frv: "Hsk-08",
		month: "December",
		start: 600,
		end: 2100,
		qty: 16,
		unit: "km",
		rate: 110,
		amount: 100100,
	},
	{
		sno: 9,
		district: "Satna",
		registrationno: "MP87M4567",
		make: "Renault",
		model: "Kwid",
		year: 2017,
		frv: "Isk-09",
		month: "August",
		start: 450,
		end: 1900,
		qty: 14,
		unit: "km",
		rate: 120,
		amount: 97080,
	},
	{
		sno: 10,
		district: "Ratlam",
		registrationno: "MP34N9876",
		make: "Chevrolet",
		model: "Beat",
		year: 2016,
		frv: "Jsk-10",
		month: "May",
		start: 700,
		end: 2200,
		qty: 17,
		unit: "km",
		rate: 130,
		amount: 115600,
	},
	{
		sno: 11,
		district: "Damoh",
		registrationno: "MP90P5432",
		make: "Skoda",
		model: "Rapid",
		year: 2018,
		frv: "Ksk-11",
		month: "January",
		start: 400,
		end: 1800,
		qty: 13,
		unit: "km",
		rate: 125,
		amount: 91125,
	},
	{
		sno: 12,
		district: "Sehore",
		registrationno: "MP56Q3210",
		make: "Nissan",
		model: "Micra",
		year: 2019,
		frv: "Lsk-12",
		month: "April",
		start: 550,
		end: 1950,
		qty: 15,
		unit: "km",
		rate: 115,
		amount: 86325,
	},
];

const SearchCars = () => {
	const [query, setQuery] = useState("");
	const navigate = useNavigate();

	const [data, setData] = useState(arr);

	const handleSearch = (e) => {
		const searchTerm = e.target.value;
		setQuery(searchTerm);
	};

	const handleRowClick = (row) => {
		// Access _id property from the row's original data and redirect to the desired page
		const { _id } = row.original;
		navigate(`/cars/${_id}`);
	};

	useEffect(() => {
		const filteredData = arr.filter(
			(item) =>
				item.district.toLowerCase().includes(query.toLowerCase()) ||
				item.registrationno.toLowerCase().includes(query.toLowerCase()) ||
				item.make.toLowerCase().includes(query.toLowerCase()) ||
				item.model.toLowerCase().includes(query.toLowerCase()) ||
				item.year.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.frv.toLowerCase().includes(query.toLowerCase()) ||
				item.month.toLowerCase().includes(query.toLowerCase()) ||
				item.start.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.end.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.qty.toString().toLowerCase().includes(query.toLowerCase()) ||
				item.unit.toLowerCase().includes(query.toLowerCase()) ||
				item.rate.toString().toLowerCase().includes(query.toLowerCase())
		);
		console.log(filteredData);
		setData(filteredData);
	}, [query]);
	const Table = useCallback(TableSearchTOC(columns, data, "dashboard-product-box", "", true, 50, handleRowClick), [data]);
	return (
		<section className="admin-container">
			<AdminSidebar />
			<main className="searchCars">
				<Bar query={query} handleSearch={handleSearch} />
				<h2>Cars</h2>
				{Table()}
			</main>
		</section>
	);
};

export default SearchCars;
