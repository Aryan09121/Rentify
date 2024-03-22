import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const carReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("GET_CARS_BY_OWNER_ID_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_CARS_BY_OWNER_ID_SUCCESS", (state, action) => {
			state.loading = false;
			state.cars = action.payload.owners;
			state.message = action.payload.message;
		})
		.addCase("GET_CARS_BY_OWNER_ID_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("GET_ALL_CARS_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_ALL_CARS_SUCCESS", (state, action) => {
			state.loading = false;
			state.allcars = action.payload.cars;
			state.message = action.payload.message;
		})
		.addCase("GET_ALL_CARS_FAILURE", (state, action) => {
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
