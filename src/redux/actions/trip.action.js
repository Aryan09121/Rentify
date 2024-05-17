import axios from "axios";
import Cookies from "js-cookie";

const URI = import.meta.env.VITE_API_URL;

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
		const { data } = await axios.post(`${URI}/add/trip`, trip, config);

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
			// eslint-disable-next-line no-unused-vars
			const { data } = await axios.post(`${URI}/add/trip`, trip, config);
		});
		dispatch({
			type: "ASSIGN_TRIPS_SUCCESS",
			payload: "Trips assigned successfully",
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

		const { data } = await axios.get(`${URI}/get/trips`, config);

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

export const completeTrip = (id, end) => async (dispatch) => {
	try {
		dispatch({
			type: "COMPLETE_TRIPS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/complete/trip?id=${id}`, { end }, config);

		const payload = data.message;

		dispatch({
			type: "COMPLETE_TRIPS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "COMPLETE_TRIPS_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const updateOffroad = (id, offroad) => async (dispatch) => {
	try {
		dispatch({
			type: "UPDATE_OFFROAD_REQUEST",
		});
		console.log(offroad);

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/update/offroad?id=${id}`, { offroad }, config);

		const payload = data.message;

		dispatch({
			type: "UPDATE_OFFROAD_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "UPDATE_OFFROAD_FAILURE",
			payload: error.response.data.message,
		});
	}
};
