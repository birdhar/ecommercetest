import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
import cartReducer from "./cartSlice";
import { clientFunction } from "./clientFunction";

// let preloadedState = undefined;

// if (typeof window !== "undefined") {
//   preloadedState = clientFunction();
// }

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  // preloadedState: preloadedState,
});

// setupListeners(store.dispatch);
