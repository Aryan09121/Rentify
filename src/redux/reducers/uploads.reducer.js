import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const uploadsReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("ADD_CARS_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("ADD_CARS_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload;
		})
		.addCase("ADD_CARS_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("HANDLE_TRIPS_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("HANDLE_TRIPS_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload;
		})
		.addCase("HANDLE_TRIPS_FAILURE", (state, action) => {
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
