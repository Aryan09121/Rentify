import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user.reducer";
import { ownerReducer } from "./reducers/owner.reducer";
import { carReducer } from "./reducers/car.reducer";
import { tripReducer } from "./reducers/trip.reducer";

export const store = configureStore({
	reducer: { user: userReducer, owner: ownerReducer, car: carReducer, trip: tripReducer },
});
