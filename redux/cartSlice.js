"use client";

import { createSlice } from "@reduxjs/toolkit";

let cart = {};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.setItem("store", JSON.stringify({ cart: state }));
    },
    initializeCart: (state, action) => {
      state.items = action.payload?.items;
      state.totalQuantity = action.payload?.totalQuantity;
      state.totalAmount = action.payload?.totalAmount;
    },
    addProductToCart: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem("store", JSON.stringify({ cart: state }));
    },
    increaseCartProduct: (state, action) => {
      const updatedCartItems = state.items.map((item) => {
        if (item?.info?._id === action.payload?.info?._id) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
      localStorage.setItem(
        "store",
        JSON.stringify({ cart: { ...state, items: updatedCartItems } })
      );
      return { ...state, items: updatedCartItems };
    },
    decreaseCartProduct: (state, action) => {
      const updatedCartItems = state.items.map((item) => {
        if (item?.info?._id === action.payload?.info?._id) {
          return { ...item, count: Math.max(1, item.count - 1) };
        }
        return item;
      });
      localStorage.setItem(
        "store",
        JSON.stringify({ cart: { ...state, items: updatedCartItems } })
      );
      return { ...state, items: updatedCartItems };
    },
    removeCartProduct: (state, action) => {
      const updatedCartItems = state.items.filter((item) => {
        return item?.info?._id !== action.payload?.info?._id;
      });
      localStorage.setItem(
        "store",
        JSON.stringify({ cart: { ...state, items: updatedCartItems } })
      );
      return { ...state, items: updatedCartItems };
    },
    getCartTotal: (state, action) => {
      let { totalCount, totalPrice } = state.items.reduce(
        (accumulator, currentItem) => {
          accumulator.totalCount += currentItem.count;
          accumulator.totalPrice += currentItem.info.price * currentItem.count;
          return accumulator;
        },
        { totalCount: 0, totalPrice: 0 }
      );
      return {
        ...state,
        totalQuantity: totalCount,
        totalAmount: totalPrice,
      };
    },
  },
});

export const {
  clearCart,
  initializeCart,
  addProductToCart,
  increaseCartProduct,
  decreaseCartProduct,
  removeCartProduct,
  getCartTotal,
} = cartSlice.actions;

export default cartSlice.reducer;
