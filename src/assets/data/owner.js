export const customerHeaders = ["Serial No", "Owner Name", "Total Vehicle", "Address", "Payment Status"];

export const customerData = [
	// {
	// 	data: ["1","tstmp1012", "M.S, Subramanium", "4 Cars", "Vishakhapatnam","ongoing"],
	// },
	{
		data: ["1", "M.S, Subramanium", "4 Cars", "Vishakhapatnam"],
		status: "ongoing",
		_id: 1,
	},
	{
		data: ["2", "Ramesh Gupta", "2 Cars", "Varodra"],
		status: "pending",
		_id: 2,
	},
	{
		data: ["3", "Vishwas Patel", "6 Cars", "Mumbai"],
		status: "completed",
		_id: 3,
	},
	{
		data: ["3", "Bhavna Goel", "4 Cars", "Indore"],
		status: "ongoing",
		_id: 4,
	},
	{
		data: ["4", "Saksham Bisen", "9 Cars", "Bhopal"],
		status: "ongoing",
		_id: 5,
	},
];

export const ownerSortOptions = [
	{ value: "", label: "Sort By" },
	{ value: "distance", label: "Distance Travelled" },
	{ value: "location", label: "Location" },
	{ value: "total", label: "Number of Cars" },
	{ value: "status", label: "Payment Status" },
];

//  vehicle data

export const VehicleData = [
	{
		data: ["1", "Tata Nexon", "134 km", "543.00/day", "52 days", 4443.0],
		_id: 1,
	},
	{
		data: ["2", "Harrier", "224 km", "866.00/day", "12 days", 1121.0],
		_id: 2,
	},
	{
		data: ["3", "Maruti Suzuki", "274 km", "300.00/day", "39 days", 5369.0],
		_id: 3,
	},
	{
		data: ["4", "Tata Punch", "344 km", "514.00/day", "62 days", 2193.0],
		_id: 4,
	},
	{
		data: ["5", "Maruti Breeza", "184 km", "455.00/day", "41 days", 1343.0],
		_id: 5,
	},
];

export const vehicleHeaders = ["Serial No", "Brand Name", "Kilometers", "Rate", "Total Days", "Amount"];

export const vehicleSortOptions = [
	{ value: "", label: "Sort By" },
	{ value: "kilometers", label: "Distance Travelled" },
	{ value: "amount", label: "Amount" },
	{ value: "days", label: "Days" },
	{ value: "rate", label: "Rate" },
];
