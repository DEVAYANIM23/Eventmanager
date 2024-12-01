// import { createSlice } from "@reduxjs/toolkit";

// const initialState = JSON.parse(localStorage.getItem("cart")) || [];

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const existingItem = state.find((item) => item.id === action.payload.id);
//       if (existingItem) {
//         existingItem.quantity += action.payload.quantity;
//       } else {
//         state.push(action.payload);
//       }
//       localStorage.setItem("cart", JSON.stringify(state));
//     },
//     removeFromCart: (state, action) => {
//       const updatedState = state.filter((item) => item.id !== action.payload);
//       localStorage.setItem("cart", JSON.stringify(updatedState));
//       return updatedState;
//     },
//     incrementQuantity: (state, action) => {
//       const item = state.find((item) => item.id === action.payload);
//       if (item) item.quantity += 1;
//       localStorage.setItem("cart", JSON.stringify(state));
//     },
//     decrementQuantity: (state, action) => {
//       const item = state.find((item) => item.id === action.payload);
//       if (item && item.quantity > 1) {
//         item.quantity -= 1;
//       }
//       localStorage.setItem("cart", JSON.stringify(state));
//     },
//     clearCart: () => {
//       localStorage.removeItem("cart");
//       return [];
//     },
//   },
// });

// export const { addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

// export default cartSlice.reducer;
