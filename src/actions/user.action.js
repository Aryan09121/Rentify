import axios from "../utils/axios.js";

export const userLogin = (loginDetails) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_LOGIN_REQUEST",
		});
		const data = await axios.post(`/user/login`, loginDetails, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log(data);
		const payload = {
			user: data.user,
			message: data.message,
		};

		dispatch({
			type: "GET_LOGIN_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_LOGIN_FAILURE",
			payload: error.response.data.message,
		});
	}
};
