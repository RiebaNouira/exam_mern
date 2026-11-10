import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice";
import feedbackReducer from "./feedbackSlice";

// Combine the event and feedback slices into the app-wide Redux store.
export const store = configureStore({
  reducer: {
    events: eventsReducer,
    feedback: feedbackReducer,
  },
});
