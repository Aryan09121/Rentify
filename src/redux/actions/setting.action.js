import axios from "axios";
import Cookies from "js-cookie";

const URI = "http://localhost:8000";
// const URI = "https://unusual-jade-puppy.cyclic.app";

export const modifyGst = (gst) => async (dispatch) => {
	try {
		dispatch({
			type: "UPDATE_GST_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/api/v1/admin/update/gst`, { gstValue: gst }, config);
		const payload = {
			cars: data.data,
			message: data.message,
		};

		dispatch({
			type: "UPDATE_GST_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "UPDATE_GST_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getGst = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_GST_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/api/v1/admin/get/gst`, config);
		const payload = data.data;

		dispatch({
			type: "GET_GST_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_GST_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const updateRate = (rate, type) => async (dispatch) => {
	try {
		dispatch({
			type: "UPDATE_RATE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		let data;
		if (type === "day") {
			data = await axios.post(`${URI}/api/v1/admin/update/car/dayrate`, { model: rate.model, rate: rate.rate }, config);
		} else {
			data = await axios.post(`${URI}/api/v1/admin/update/car/kmrate`, { model: rate.model, rate: rate.rate }, config);
		}
		const payload = data.data.message;

		dispatch({
			type: "UPDATE_RATE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "UPDATE_RATE_FAILURE",
			payload: error.response.data.message,
		});
	}
};
