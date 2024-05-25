import axios from "axios";
import Cookies from "js-cookie";

const URI = import.meta.env.VITE_API_URL;

export const addCars = (cars) => async (dispatch) => {
	try {
		dispatch({
			type: "ADD_CARS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/upload/cars`, { cars }, config);
		const payload = data.message;

		dispatch({
			type: "ADD_CARS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ADD_CARS_FAILURE",
			payload: error.response.data.message,
		});
	}
};

// ??!! handling trips and invoices data upload
export const handleTripsInvoices = (stats) => async (dispatch) => {
	try {
		dispatch({
			type: "HANDLE_TRIPS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/uploads/trips/invoices`, stats, config);
		const payload = data.message;

		dispatch({
			type: "HANDLE_TRIPS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "HANDLE_TRIPS_FAILURE",
			payload: error.response.data.message,
		});
	}
};
