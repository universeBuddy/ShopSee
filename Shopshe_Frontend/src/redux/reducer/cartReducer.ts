import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/rediucer-types";
import { actions } from "react-table";
import { CartItems } from "../../types/types";

const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
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
    addtoCart: (state, action: PayloadAction<CartItems>) => {
      state.loading = true;
      state.cartItems.push(action.payload);
      state.loading = false;
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter((i) => i.productId !== action.payload)
      state.loading = false;
    },
  },
});


export const {addtoCart,removeCartItem} = cartReducer.actions