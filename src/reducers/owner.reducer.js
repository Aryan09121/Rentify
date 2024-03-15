import { createReducer } from "@reduxjs/toolkit";

const initialState = {};

export const ownerReducer = createReducer(initialState, (builder) => {
	builder
		.addCase("GET_OWNER_REQUEST", (state) => {
			state.loading = true;
		})
		.addCase("GET_OWNER_SUCCESS", (state, action) => {
			state.loading = false;
			state.owners = action.payload.owners;
			state.message = action.payload.message;
		})
		.addCase("GET_OWNER_FAILURE", (state, action) => {
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
