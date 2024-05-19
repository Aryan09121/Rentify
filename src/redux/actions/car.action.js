import axios from "axios";
import Cookies from "js-cookie";

const URI = import.meta.env.VITE_API_URL;

export const addCar = (car, id) => async (dispatch) => {
	try {
		dispatch({
			type: "ADD_CAR_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/add/car?id=${id}`, { car }, config);
		const payload = data.message;

		dispatch({
			type: "ADD_CAR_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ADD_CAR_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getAllCars = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_ALL_CARS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/cars`, config);
		const payload = {
			cars: data.data,
			message: data.message,
		};

		dispatch({
			type: "GET_ALL_CARS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_ALL_CARS_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getSingleCar = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_SINGLE_CAR_REQUEST",
		});
		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/singleCar?id=${id}`, config);
		const payload = {
			car: data.data,
			message: data.message,
		};

		dispatch({
			type: "GET_SINGLE_CAR_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_SINGLE_CAR_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getGroupedCar = (param) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_GROUPED_CAR_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/get/car/brand?param=${param}`, config);
		const payload = {
			cars: data.data,
			message: data.message,
		};

		dispatch({
			type: "GET_GROUPED_CAR_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_GROUPED_CAR_FAILURE",
			payload: error.response.data.message,
		});
	}
};
