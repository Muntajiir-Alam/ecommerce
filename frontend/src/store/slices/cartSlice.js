import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalItems: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find(
                (cartItem) => cartItem.id === item.id
            );

            if (existingItem) {
                existingItem.quantity += item.quantity || 1;
            } else {
                state.items.push({ ...item, quantity: item.quantity || 1 });
            }

            state.totalItems = state.items.reduce(
                (sum, product) => sum + product.quantity,
                0
            );
            state.totalAmount = state.items.reduce(
                (sum, product) => sum + product.price * product.quantity,
                0
            );
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
            state.totalItems = state.items.reduce(
                (sum, product) => sum + product.quantity,
                0
            );
            state.totalAmount = state.items.reduce(
                (sum, product) => sum + product.price * product.quantity,
                0
            );
        },
        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
            state.totalAmount = 0;
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
