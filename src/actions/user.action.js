// import axios from "../utils/axios.js";
import axios from "axios";
import Cookies from "js-cookie";

// const URI = "http://localhost:8000";
const URI = "https://unusual-jade-puppy.cyclic.app";

export const userLogin = (loginDetails) => async (dispatch) => {
	try {
		dispatch({
			type: "GET_LOGIN_REQUEST",
		});
		const { data } = await axios.post(`${URI}/api/v1/user/login`, loginDetails);

		const payload = {
			user: data.data.user,
			message: data.message,
		};

		Cookies.set("token", data.data.token, { expires: 1 });

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

export const logoutUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_LOGOUT_REQUEST",
		});

		Cookies.remove("token");

		const payload = {
			message: "User Logged Out Successfully",
		};

		dispatch({
			type: "GET_LOGOUT_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_LOGOUT_FAILURE",
			payload: "there was an error while logging out",
		});
	}
};

export const loadUser = () => async (dispatch) => {
	try {
		dispatch({
			type: "LOAD_USER_REQUEST",
		});

		const token = Cookies.get("token"); // Get the token from the cookie
		const config = {
			headers: {
				Authorization: `Bearer ${token}`, // Include the token in the Authorization header
			},
		};

		const { data } = await axios.get(`${URI}/api/v1/user/me`, config);

		dispatch({
			type: "LOAD_USER_SUCCESS",
			payload: data.data.user,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "LOAD_USER_FAILURE",
			payload: "error while loading user",
		});
	}
};
