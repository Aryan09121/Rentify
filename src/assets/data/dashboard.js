export const tripHeaders = ["Serial No", "Car Type", "Car Number", "Trip Route", "Status"];

export const tripData = [
	{
		data: ["1", "xylo", "KA 06P 5959", "Bihar - Goa"],
		status: "Ongoing",
		_id: 1,
		driver_id: 101,
	},
	{
		data: ["2", "xylo", "KA 07P 5959", "Bihar - Goa"],
		status: "Reached",
		_id: 2,
		driver_id: 102,
	},
	{
		data: ["3", "xylo", "KA 06P 5999", "Bihar - Goa"],
		status: "Tommorow",
		_id: 3,
		driver_id: 103,
	},
	{
		data: ["4", "xylo", "KA 08P 5959", "Bihar - Goa"],
		status: "Ongoing",
		_id: 4,
		driver_id: 104,
	},
	{
		data: ["5", "xylo", "KA 06P 5959", "Bihar - Goa"],
		status: "Tommorow",
		_id: 5,
		driver_id: 101,
	},
];

export const driverDetailsHeaders = ["Name", "Car No", "Car Type", "Trip Details", "Status"];

export const driverDetailsData = {
	name: "Javid Sheikh",
	carno: "KP 06 P 5959",
	cartype: "Bolero",
	tripDetails: "Mumbai - Goa",
	status: "Completed",
};
