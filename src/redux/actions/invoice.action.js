import axios from "axios";
import Cookies from "js-cookie";

const URI = import.meta.env.VITE_API_URL;

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
		const { data } = await axios.post(`${URI}/generate/invoice`, invoice, config);

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
		const { data } = await axios.get(`${URI}/get/invoices`, invoice, config);

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

export const getAllOwnerInvoices = (invoice) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_ALL_OWNER_INVOICES_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.get(`${URI}/get/owner/invoices`, invoice, config);

		const payload = {
			message: data.message,
			invoices: data.data,
		};

		dispatch({
			type: "GET_ALL_OWNER_INVOICES_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_ALL_OWNER_INVOICES_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getVendorsInvoices = (invoice) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_VENDORS_INVOICE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.get(`${URI}/get/vendors/invoices`, invoice, config);

		const payload = {
			message: data.message,
			invoices: data.data,
		};

		dispatch({
			type: "GET_VENDORS_INVOICE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_VENDORS_INVOICE_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getIndividualInvoices = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_INDIVIDUAL_INVOICES_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.get(`${URI}/get/individual/invoices`, config);

		const payload = data.data;

		dispatch({
			type: "GET_INDIVIDUAL_INVOICES_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_INDIVIDUAL_INVOICES_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getSingleInvoice = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_SINGLE_INVOICE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.get(`${URI}/get/invoice?id=${id}`, { id }, config);

		const payload = data.data;

		dispatch({
			type: "GET_SINGLE_INVOICE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_SINGLE_INVOICE_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const payInvoice = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "PAY_INVOICE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.post(`${URI}/pay/invoice?id=${id}`, { id }, config);

		const payload = {
			message: data.message,
			invoice: data.data,
		};

		dispatch({
			type: "PAY_INVOICE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "PAY_INVOICE_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const payAllInvoice = (ids) => async (dispatch) => {
	try {
		dispatch({
			type: "PAY__ALL_INVOICE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		let dt;

		// eslint-disable-next-line no-unused-vars
		for (const id of ids) {
			dt = await axios.post(`${URI}/pay/invoice?id=${id}`, { id }, config);
		}

		const { data } = dt;

		const payload = {
			message: data.message,
			invoice: data.data,
		};

		dispatch({
			type: "PAY__ALL_INVOICE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "PAY__ALL_INVOICE_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const payAllCompanyInvoices = (companyId, month) => async (dispatch) => {
	try {
		dispatch({
			type: "PAY_ALL_INVOICE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.post(`${URI}/pay/all/invoice`, { companyId, month }, config);

		const payload = data.message;

		dispatch({
			type: "PAY_ALL_INVOICE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "PAY_ALL_INVOICE_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const payOwnerBill = (billdata) => async (dispatch) => {
	try {
		dispatch({
			type: "PAY_OWNER_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		// eslint-disable-next-line no-unused-vars
		const { data } = await axios.post(`${URI}/pay/owner/bill`, billdata, config);

		const payload = {
			message: data.message,
			invoice: data.data,
		};

		dispatch({
			type: "PAY_OWNER_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "PAY_OWNER_FAILURE",
			payload: error.response.data.message,
		});
	}
};
