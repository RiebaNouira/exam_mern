import { createSlice } from "@reduxjs/toolkit";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Replace the event list after a successful API request.
    setEvents: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Add a newly created event to the top of the list.
    addEvent: (state, action) => {
      state.items.unshift(action.payload);
    },
    // Remove an event from the list by its MongoDB ID.
    removeEvent: (state, action) => {
      state.items = state.items.filter((event) => event._id !== action.payload);
    },
    // Record whether the event request is currently running.
    setEventsLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Save an event request error and stop its loading state.
    setEventsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setEvents,
  addEvent,
  removeEvent,
  setEventsLoading,
  setEventsError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
