import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const companyReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("ADD_COMPANY_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("ADD_COMPANY_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload;
		})
		.addCase("ADD_COMPANY_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("ADD_MULTIPLE_COMPANY_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("ADD_MULTIPLE_COMPANY_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload;
		})
		.addCase("ADD_MULTIPLE_COMPANY_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("GET_ALL_COMPANY_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_ALL_COMPANY_SUCCESS", (state, action) => {
			state.loading = false;
			state.companies = action.payload;
		})
		.addCase("GET_ALL_COMPANY_FAILURE", (state) => {
			state.loading = false;
		})
		.addCase("CLEAR_ERRORS", (state) => {
			state.error = null;
		})
		.addCase("CLEAR_MESSAGES", (state) => {
			state.message = null;
		});
});
