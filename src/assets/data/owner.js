export const customerHeaders = ["Owner Name", "Total Vehicle", "Address", "Payment Status"];

export const vehicleHeaders = ["Serial No", "Brand Name", "Kilometers", "Rate", "Total Days", "Amount"];

export const vehicleSortOptions = [
	{ value: "", label: "Sort By" },
	{ value: "kilometers", label: "Distance Travelled" },
	{ value: "amount", label: "Amount" },
	{ value: "days", label: "Days" },
	{ value: "rate", label: "Rate" },
];

const owner = {
	_id: 1,
	name: "Saksham Bisen",
	phone: "7415729120",
	email: "dummyuser.car@gmail.com",
	address: "3, Ultra Apartment, Hari Shankar Joshi Road, Dahisagar",
	gstin: "BVHDE1425D",
	hsn: "BVHDE1425D",
	pan: "BVHDE1425D",
	joining: new Date().toDateString(),
	facebook: "https://www.facebook.com",
	twitter: "https://x.com",
	instagram: "https://instagram.com",
	totalKm: "2873",
	paid: 24000.0,
	pending: 36000.0,
	cars: [
		{
			brand: "Tata Nexon",
			distance: 134,
			rate: 543.0,
			days: 51,
			amount: 4443,
			_id: 101,
		},
		{
			brand: "Tata Harrier",
			distance: 134,
			rate: 1943.0,
			days: 41,
			amount: 93269,
			_id: 102,
		},
		{
			brand: "Tata Nexon",
			distance: 134,
			rate: 543.0,
			days: 51,
			amount: 4443,
			_id: 103,
		},
		{
			brand: "Tata Harrier",
			distance: 134,
			rate: 1943.0,
			days: 41,
			amount: 93269,
			_id: 104,
		},
		{
			brand: "Tata Harrier",
			distance: 134,
			rate: 1943.0,
			days: 41,
			amount: 93269,
			_id: 105,
		},
		{
			brand: "Tata Nexon",
			distance: 134,
			rate: 543.0,
			days: 51,
			amount: 4443,
			_id: 106,
		},
		{
			brand: "Tata Harrier",
			distance: 134,
			rate: 1943.0,
			days: 41,
			amount: 93269,
			_id: 107,
		},
	],
};

export { owner };
