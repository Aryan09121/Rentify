import axios from "axios";
import Cookies from "js-cookie";

// const URI = "http://localhost:8000";
const URI = "https://unusual-jade-puppy.cyclic.app";

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

		const { data } = await axios.get(`http://localhost:8000/api/v1/admin/cars`, config);
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
			type: "GET_ALL_CARS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/api/v1/admin/singleCar?id=${id}`, config);
		const payload = {
			car: data.data,
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

		const { data } = await axios.get(`${URI}/api/v1/admin/get/car/brand?param=${param}`, config);
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

// export const getCarsByOwnerId = () => async (dispatch) => {
// 	try {
// 		dispatch({
// 			type: "GET_CARS_BY_OWNER_ID_REQUEST",
// 		});

// 		const token = Cookies.get("token"); // Get the token from the cookie

// 		const config = {
// 			headers: {
// 				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
// 			},
// 		};

// 		const { data } = await axios.get(`http://localhost:8000/api/v1/admin/owners`, config);
// 		const payload = {
// 			owners: data.data,
// 			message: data.message,
// 		};

// 		dispatch({
// 			type: "GET_CARS_BY_OWNER_ID_SUCCESS",
// 			payload,
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		dispatch({
// 			type: "GET_CARS_BY_OWNER_ID_FAILURE",
// 			payload: error.response.data.message,
// 		});
// 	}
// };
