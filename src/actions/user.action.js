// import axios from "../utils/axios.js";
import axios from "axios";

export const userLogin = (loginDetails) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_LOGIN_REQUEST",
		});
		const { data } = await axios.post(`http://localhost:8000/api/v1/user/login`, loginDetails);

		const payload = {
			user: data.data.user,
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
