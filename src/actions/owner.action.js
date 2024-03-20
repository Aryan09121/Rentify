import axios from "axios";
import Cookies from "js-cookie";

export const getOwners = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_OWNERS_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`http://localhost:8000/api/v1/admin/owners`, config);
		const payload = {
			owners: data.data,
			message: data.message,
		};

		dispatch({
			type: "GET_OWNERS_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_OWNERS_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const getOwnerById = (id) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_OWNER_BY_ID_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`http://localhost:8000/api/v1/admin/owner?id=${id}`, config);
		const payload = {
			owner: data.data,
			message: data.message,
		};

		dispatch({
			type: "GET_OWNER_BY_ID_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_OWNER_BY_ID_FAILURE",
			payload: error.response.data.message,
		});
	}
};
export const addSingleOwner = (owner) => async (dispatch) => {
	try {
		dispatch({
			type: "ADD_OWNER_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`http://localhost:8000/api/v1/admin/add/owner`, owner, config);
		console.log(data);

		const payload = {
			message: data.message,
		};

		dispatch({
			type: "ADD_OWNER_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ADD_OWNER_FAILURE",
			payload: error.response.data.message,
		});
	}
};
