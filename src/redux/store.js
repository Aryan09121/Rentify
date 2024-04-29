import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers";
import { ownerReducer } from "./reducers";
import { carReducer } from "./reducers";
import { tripReducer } from "./reducers";
import { invoiceReducer } from "./reducers";

export const store = configureStore({
	reducer: { user: userReducer, owner: ownerReducer, car: carReducer, trip: tripReducer, invoice: invoiceReducer },
});
