import axios from "axios";
import Cookies from "js-cookie";

// const URI = "http://localhost:8000";
// const URI = "https://unusual-jade-puppy.cyclic.app";

export const assignSingleTrip = (trip) => async (dispatch) => {
	try {
		dispatch({
			type: "ASSIGN_TRIPS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.post(`http://localhost:8000/api/v1/admin/add/trip`, trip, config);

		const payload = {
			message: "Trips Assigned Successfully",
		};

		dispatch({
			type: "ASSIGN_TRIPS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ASSIGN_TRIPS_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const assignTrip = (trips) => async (dispatch) => {
	try {
		dispatch({
			type: "ASSIGN_TRIPS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		trips.forEach(async (trip) => {
			await axios.post(`http://localhost:8000/api/v1/admin/add/trip`, trip, config);
		});

		const payload = {
			message: "Trips Assigned Successfully",
		};

		dispatch({
			type: "ASSIGN_TRIPS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ASSIGN_TRIPS_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getAllTrips = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_ALL_TRIPS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`http://localhost:8000/api/v1/admin/get/trips`, config);

		const payload = {
			trips: data.data,
			message: data.message,
		};

		dispatch({
			type: "GET_ALL_TRIPS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_ALL_TRIPS_FAILURE",
			payload: error.response.data.message,
		});
	}
};
