import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const tripReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("ASSIGN_TRIPS_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("ASSIGN_TRIPS_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload.message;
		})
		.addCase("ASSIGN_TRIPS_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("CLEAR_ERRORS", (state) => {
			state.error = null;
		})
		.addCase("CLEAR_MESSAGES", (state) => {
			state.message = null;
		});
});
