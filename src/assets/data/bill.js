export const billData = [
	{
		data: ["1", "Rohit Mehta", "10923", "KM", 6554],
		_id: 1,
	},
	{
		data: ["2", "Ramesh Gupta", "1407", "KM", 704],
		_id: 2,
	},
];

export const billHeaders = ["Serial No", "Owner Name", "Bill Amount", "GST", "Total Amount"];

export const billDetailsData = [
	{
		data: [
			"1",
			"Minor miant charege - (Travera), Description:Minor maintainance charges on travera vehicle on actual per KM reading per basis as per the Annexure-1 vehicle count- 04nos, Period - 01/02/2023",
			"10923",
			"KM",
			"0.60",
			6554,
		],
		_id: 112,
	},
	{
		data: [
			"2",
			"Minor miant charege - (Travera), Description:Minor maintainance charges on travera vehicle on actual per KM reading per basis as per the Annexure-1 vehicle count- 04nos, Period - 01/02/2023",
			"1407",
			"KM",
			"0.50",
			704,
		],
		_id: 111,
	},
	{
		data: [
			"2",
			"Minor miant charege - (Travera), Description:Minor maintainance charges on travera vehicle on actual per KM reading per basis as per the Annexure-1 vehicle count- 04nos, Period - 01/02/2023",
			"1407",
			"KM",
			"0.50",
			704,
		],
		_id: 113,
	},
	{
		data: [
			"2",
			"Minor miant charege - (Travera), Description:Minor maintainance charges on travera vehicle on actual per KM reading per basis as per the Annexure-1 vehicle count- 04nos, Period - 01/02/2023",
			"1407",
			"KM",
			"0.50",
			704,
		],
		_id: 114,
	},
];

export const billDetailsHeaders = ["Serial No", "Car Details", "Total Days", "Unit", "Rate (Per Day)", "Total Amount"];

export const invoice = [
	{
		_id: "43178",
		owner: {
			name: "Priyansh Dubey",
			phone: "9560743256",
			email: "priyansh@gmail.com",
			address: "24 GF, Roshanpura, Bhopal, Madhya Pradesh, 462042",
		},
		bills: [
			{
				description: "description 1",
				days: "192",
				unit: "km",
				rate: "0.60",
				amount: "900",
				_id: "111",
			},
			{
				description: "description 2",
				days: "432",
				unit: "km",
				rate: "1.90",
				amount: "2949",
				_id: "112",
			},
			{
				description:
					"description 1 description 1 description 1 description 1 description 1 description 1 description 1 description 1 description 1",
				days: "192",
				unit: "km",
				rate: "0.60",
				amount: "900",
				_id: "113",
			},
			{
				description: "description 2",
				days: "432",
				unit: "km",
				rate: "1.90",
				amount: "2949",
				_id: "114",
			},
		],
		issuedate: "Febuary 06, 2021",
		amount: "8367.0",
		gstin: "gst88433",
		status: "paid",
	},
	{
		_id: "43179",
		gstin: "gst88433",
		owner: {
			name: "Ramesh Gupta",
			phone: "9560743256",
			email: "ramesh@gmail.com",
			address: "24 GF, Roshanpura, Bhopal, Madhya Pradesh, 462042",
		},
		bills: [
			{
				description: "description 1",
				days: "192",
				unit: "km",
				rate: "0.60",
				amount: "900",
				_id: "115",
			},
			{
				description: "description 2",
				days: "432",
				unit: "km",
				rate: "1.90",
				amount: "2949",
				_id: "116",
			},
		],
		issuedate: "March 26, 2020",
		amount: "89372.0",
		status: "pending",
	},
	{
		_id: "43182",
		gstin: "gst88433",
		owner: {
			name: "Raghav Singh",
			phone: "9560743256",
			email: "raghav@gmail.com",
			address: "24 GF, Roshanpura, Bhopal, Madhya Pradesh, 462042",
		},
		bills: [
			{
				description: "description 1",
				days: "192",
				unit: "km",
				rate: "0.60",
				amount: "900",
				_id: "117",
			},
			{
				description: "description 2",
				days: "432",
				unit: "km",
				rate: "1.90",
				amount: "2949",
				_id: "118",
			},
		],
		issuedate: "September 14, 2018",
		amount: "12340.0",
		status: "paid",
	},
	{
		_id: "43165",
		gstin: "gst88433",
		owner: {
			name: "Vishal Kumar",
			phone: "9560743256",
			email: "vishal@gmail.com",
			address: "24 GF, Roshanpura, Bhopal, Madhya Pradesh, 462042",
		},
		bills: [
			{
				description: "description 1",
				days: "192",
				unit: "km",
				rate: "0.60",
				amount: "900",
				_id: "119",
			},
			{
				description: "description 2",
				days: "432",
				unit: "km",
				rate: "1.90",
				amount: "2949",
				_id: "120",
			},
		],
		issuedate: "Febuary 06, 2021",
		amount: "8367.0",
		status: "paid",
	},
	{
		_id: "54532",
		gstin: "gst88433",
		owner: {
			name: "Rishi Sahu",
			phone: "9560743256",
			email: "rishi@gmail.com",
			address: "24 GF, Roshanpura, Bhopal, Madhya Pradesh, 462042",
		},
		bills: [
			{
				description: "description 1",
				days: "192",
				unit: "km",
				rate: "0.60",
				amount: "900",
				_id: "121",
			},
			{
				description: "description 2",
				days: "432",
				unit: "km",
				rate: "1.90",
				amount: "2949",
				_id: "123",
			},
		],
		issuedate: "March 26, 2020",
		amount: "89372.0",
		status: "pending",
	},
	{
		_id: "56554",
		gstin: "gst88433",
		owner: {
			name: "Ronak Tiwari",
			phone: "9560743256",
			email: "ronak@gmail.com",
			address: "24 GF, Roshanpura, Bhopal, Madhya Pradesh, 462042",
		},
		bills: [
			{
				description: "description 1",
				days: "192",
				unit: "km",
				rate: "0.60",
				amount: "900",
				_id: "124",
			},
			{
				description: "description 2",
				days: "432",
				unit: "km",
				rate: "1.90",
				amount: "2949",
				_id: "125",
			},
		],
		issuedate: "September 14, 2018",
		amount: "12340.0",
		status: "unpaid",
	},
];
