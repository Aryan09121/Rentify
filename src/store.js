import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user.reducer";
import { ownerReducer } from "./reducers/owner.reducer";

export const store = configureStore({
	reducer: { user: userReducer, owner: ownerReducer },
});
