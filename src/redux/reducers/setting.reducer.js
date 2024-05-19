import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const settingReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("UPDATE_GST_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("UPDATE_GST_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload.message;
		})
		.addCase("UPDATE_GST_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("GET_GST_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_GST_SUCCESS", (state, action) => {
			state.loading = false;
			state.gst = action.payload;
		})
		.addCase("GET_GST_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("UPDATE_RATE_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("UPDATE_RATE_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload;
		})
		.addCase("UPDATE_RATE_FAILURE", (state, action) => {
			state.loading = false;
			state.error = action.payload;
		})
		.addCase("SEND_PDF_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("SEND_PDF_SUCCESS", (state, action) => {
			state.loading = false;
			state.message = action.payload;
		})
		.addCase("SEND_PDF_FAILURE", (state, action) => {
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
