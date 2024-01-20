import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IProduct, IResponseData } from '../types';
import { Axios } from 'axios';
export interface ICartItem {
  product: IProduct;
  quantity: number;
}
export interface AppState {
  cartItems: ICartItem[];
  orderNote: string;
}

const initialState: AppState = {
  cartItems: [],
  orderNote: '',
};

export const fetchCartItems = createAsyncThunk('users/fetchCartItems', async (axios: Axios, { rejectWithValue }) => {
  try {
    const response = await axios.get<IResponseData<ICartItem[]>>(`/users/cart`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const addCartItem = createAsyncThunk(
  'users/addCartItem',
  async ({ axios, productId, quantity }: { axios: Axios; productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<IResponseData<ICartItem[]>>(`/users/cart/add`, { product: productId, quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const removeCartItem = createAsyncThunk(
  'users/removeCartItem',
  async ({ axios, productId, quantity }: { axios: Axios; productId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<IResponseData<ICartItem[]>>(`/users/cart/remove`, { product: productId, quantity });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const resetCartItems = createAsyncThunk('users/resetCartItems', async (axios: Axios, { rejectWithValue }) => {
  try {
    const response = await axios.post<IResponseData<ICartItem[]>>(`/users/cart/reset`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOrderNote: (state, { payload }: { payload: string }) => {
      state.orderNote = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.cartItems = action.payload.data;
    });
  },
});

export const { setOrderNote } = appSlice.actions;

export default appSlice.reducer;
