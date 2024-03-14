import axios from "axios";

export const getCountryNames = () => async (dispatch) => {
	try {
		dispatch({
			type: "GET_COUNTRY_NAMES_REQUEST",
		});
		const { data } = await axios.get(`http://api.airvisual.com/v2/countries?key=a049b2ed-ca11-4e3c-b28e-daddd0280c18`);
		dispatch({
			type: "GET_COUNTRY_NAMES_SUCCESS",
			payload: data.data,
		});
	} catch (error) {
		dispatch({
			type: "GET_COUNTRY_NAMES_FAILURE",
			payload: error.response.data.message,
		});
	}
};
