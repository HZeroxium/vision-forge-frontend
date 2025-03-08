// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
// Import các slice khác khi có

const store = configureStore({
  reducer: {
    auth: authReducer,
    // video: videoReducer, settings: settingsReducer, tts: ttsReducer, ...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
