import axios from "axios";
import Cookies from "js-cookie";

const URI = "http://localhost:8000";
// const URI = "https://unusu/al-jade-puppy.cyclic.app";

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

		const { data } = await axios.get(`${URI}/api/v1/admin/owners`, config);
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

		const { data } = await axios.get(`${URI}/api/v1/admin/owner?id=${id}`, config);
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

export const updateRate = (id, day) => async (dispatch) => {
	try {
		dispatch({
			type: "UPDATE_OWNER_RATE_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.post(`${URI}/api/v1/admin/owner/edit/rate?id=${id}`, { day }, config);
		const payload = {
			message: data.message,
		};

		dispatch({
			type: "UPDATE_OWNER_RATE_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "UPDATE_OWNER_RATE_FAILURE",
			payload: error.response.data.message,
		});
	}
};

export const addOwners = (owners) => async (dispatch) => {
	try {
		dispatch({
			type: "ADD_MULTIPLE_OWNER_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie

		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		for (const owner of owners) {
			await axios.post(`${URI}/api/v1/admin/add/owner`, owner, config);
			// console.log(data); // Call addSingleOwner function for each owner
		}

		dispatch({
			type: "ADD_MULTIPLE_OWNER_SUCCESS",
			payload: "Owners Added Succesfully",
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "ADD_MULTIPLE_OWNER_FAILURE",
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

		const { data } = await axios.post(`${URI}/api/v1/admin/add/owner`, owner, config);
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
