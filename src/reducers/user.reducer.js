import { createReducer } from "@reduxjs/toolkit";

const initialState = {
	loading: true,
};

export const userReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("GET_COUNTRY_NAMES_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_COUNTRY_NAMES_SUCCESS", (state, action) => {
			state.loading = false;
			state.countries = action.payload;
		})
		.addCase("GET_COUNTRY_NAMES_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("CLEAR_ERRORS", (state) => {
			state.error = null;
		})
		.addCase("CLEAR_MESSAGES", (state) => {
			state.messages = null;
		});
});
