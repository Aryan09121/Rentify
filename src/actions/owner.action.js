import axios from "axios";
import Cookies from "js-cookie";

export const getOwners = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_OWNER_REQUEST",
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
			type: "GET_OWNER_SUCCESS",
			payload,
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: "GET_OWNER_FAILURE",
			payload: error.response.data.message,
		});
	}
};
