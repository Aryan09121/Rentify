import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers";
import { ownerReducer } from "./reducers";
import { carReducer } from "./reducers";
import { tripReducer } from "./reducers";
import { invoiceReducer } from "./reducers";
import { companyReducer } from "./reducers/company.reducer";
import { settingReducer } from "./reducers/setting.reducer";

export const store = configureStore({
	reducer: {
		user: userReducer,
		owner: ownerReducer,
		car: carReducer,
		trip: tripReducer,
		invoice: invoiceReducer,
		company: companyReducer,
		settings: settingReducer,
	},
});
