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
		.addCase("GET_ALL_OWNER_INVOICES_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_ALL_OWNER_INVOICES_SUCCESS", (state, action) => {
			state.loading = false;
			state.ownerInvoices = action.payload.invoices;
			// state.message = action.payload.message;
		})
		.addCase("GET_ALL_OWNER_INVOICES_FAILURE", (state, action) => {
			state.loading = false;
			// state.error = action.payload;
		})
		.addCase("GET_VENDORS_INVOICE_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_VENDORS_INVOICE_SUCCESS", (state, action) => {
			state.loading = false;
			state.vendorInvoices = action.payload.invoices;
			// state.message = action.payload.message;
		})
		.addCase("GET_VENDORS_INVOICE_FAILURE", (state, action) => {
			state.loading = false;
			// state.error = action.payload;
		})
		.addCase("PAY_INVOICE_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("PAY_INVOICE_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload.message;
			state.invoice = action.payload.invoice;
		})
		.addCase("PAY_INVOICE_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("PAY__ALL_INVOICE_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("PAY__ALL_INVOICE_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload.message;
		})
		.addCase("PAY__ALL_INVOICE_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("PAY_OWNER_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("PAY_OWNER_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload.message;
		})
		.addCase("PAY_OWNER_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("GET_SINGLE_INVOICE_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_SINGLE_INVOICE_SUCCESS", (state, action) => {
			state.loading = false;
			state.invoice = action.payload;
		})
		.addCase("GET_SINGLE_INVOICE_FAILURE", (state) => {
			state.loading = false;
			state.invoice = null;
		})
		.addCase("CLEAR_ERRORS", (state) => {
			state.error = null;
		})
		.addCase("CLEAR_MESSAGES", (state) => {
			state.message = null;
		});
});
