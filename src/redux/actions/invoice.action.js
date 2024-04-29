import axios from "axios";
import Cookies from "js-cookie";

// const URI = "http://localhost:8000";
// const URI = "https://unusual-jade-puppy.cyclic.app";

export const generateInvoice = (invoice) => async (dispatch) => {
	try {
		dispatch({
			type: "GENERATE_SINGLE_INVOICE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.post(`http://localhost:8000/api/v1/admin/generate/invoice`, invoice, config);

		const payload = {
			message: data.message,
		};

		dispatch({
			type: "GENERATE_SINGLE_INVOICE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GENERATE_SINGLE_INVOICE_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getAllInvoices = (invoice) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_ALL_INVOICES_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.get(`http://localhost:8000/api/v1/admin/get/invoices`, invoice, config);

		const payload = {
			message: data.message,
			invoices: data.data,
		};

		dispatch({
			type: "GET_ALL_INVOICES_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_ALL_INVOICES_FAILURE",
			payload: error.response.data.message,
		});
	}
};
