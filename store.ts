import { configureStore } from "@reduxjs/toolkit";
import foodAnalysisReducer from "./features/food-analysis";
import authReducer from "./features/auth";
import reportReducer from "./features/report";
import medicalReportsReducer from "./features/medical-reports";
import recommendationsReducer from "./features/recommendations";

export const store = configureStore({
  reducer: {
    foodAnalysis: foodAnalysisReducer,
    auth: authReducer,
    report: reportReducer,
    medicalReports: medicalReportsReducer,
    recommendations: recommendationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

