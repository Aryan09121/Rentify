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
		.addCase("GET_SINGLE_CAR_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_SINGLE_CAR_SUCCESS", (state, action) => {
			state.loading = false;
			state.car = action.payload.car;
			state.message = action.payload.message;
		})
		.addCase("GET_SINGLE_CAR_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("GET_GROUPED_CAR_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_GROUPED_CAR_SUCCESS", (state, action) => {
			state.loading = false;
			state.groupedCar = action.payload.cars;
			state.message = action.payload.message;
		})
		.addCase("GET_GROUPED_CAR_FAILURE", (state, action) => {
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
