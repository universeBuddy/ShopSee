import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/rediucer-types";
import { actions } from "react-table";
import { CartItem } from "../../types/types";

const initialState: CartReducerInitialState = {
  loading: false,
  cartItem: [],
  subtotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  },
};

export const cartReducer = createSlice({
  name: "cartReducer",
  initialState,
  reducers: {
    addtoCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;

      const index = state.cartItem.findIndex(i=> i.productId === action.payload.productId);

      if(index !== -1) state.cartItem[index] =action.payload;
      else state.cartItem.push(action.payload)
      state.loading = false;
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItem = state.cartItem.filter((i) => i.productId !== action.payload)
      state.loading = false;
    },
  },
});


export const {addtoCart,removeCartItem} = cartReducer.actions