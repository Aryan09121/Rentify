import axios from "axios";
import Cookies from "js-cookie";

const URI = import.meta.env.VITE_API_URL;

export const addCompanies = (companies) => async (dispatch) => {
	try {
		dispatch({
			type: "ADD_MULTIPLE_COMPANY_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		for (const company of companies) {
			await axios.post(`${URI}/add/company`, company, config);
		}

		dispatch({
			type: "ADD_MULTIPLE_COMPANY_SUCCESS",
			payload: "companies details added successfully",
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ADD_MULTIPLE_COMPANY_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const addSingleComapny = (company) => async (dispatch) => {
	try {
		dispatch({
			type: "ADD_COMPANY_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/add/company`, company, config);
		// console.log(data);

		const payload = data.message;

		dispatch({
			type: "ADD_COMPANY_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ADD_COMPANY_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getAllCompanies = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_ALL_COMPANY_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/get/companies`, config);

		const payload = data.data;

		dispatch({
			type: "GET_ALL_COMPANY_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_ALL_COMPANY_FAILURE",
			payload: error.response.data.message,
		});
	}
};
