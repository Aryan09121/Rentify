import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const invoiceReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("GENERATE_SINGLE_INVOICE_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GENERATE_SINGLE_INVOICE_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload.message;
		})
		.addCase("GENERATE_SINGLE_INVOICE_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("GET_INDIVIDUAL_INVOICES_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_INDIVIDUAL_INVOICES_SUCCESS", (state, action) => {
			state.loading = false;
			state.allinvoices = action.payload;
		})
		.addCase("GET_INDIVIDUAL_INVOICES_FAILURE", (state) => {
			state.loading = false;
			state.allinvoices = [];
		})
		.addCase("GET_ALL_INVOICES_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_ALL_INVOICES_SUCCESS", (state, action) => {
			state.loading = false;
			state.invoices = action.payload.invoices;
			// state.message = action.payload.message;
		})
		.addCase("GET_ALL_INVOICES_FAILURE", (state, action) => {
			state.loading = false;
			// state.error = action.payload;
		})
		.addCase("CLEAR_ERRORS", (state) => {
			state.error = null;
		})
		.addCase("CLEAR_MESSAGES", (state) => {
			state.message = null;
		});
});
