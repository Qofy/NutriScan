import { configureStore } from "@reduxjs/toolkit";
import foodAnalysisReducer from "./features/food-analysis";
import authReducer from "./features/auth";

export const store = configureStore({
  reducer: {
    foodAnalysis: foodAnalysisReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

