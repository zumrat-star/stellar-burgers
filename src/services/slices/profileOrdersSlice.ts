import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface ProfileOrdersState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchAll',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    clearProfileOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки истории заказов';
      });
  }
});

export const { clearProfileOrders } = profileOrdersSlice.actions;
export default profileOrdersSlice.reducer;

export const selectProfileOrders = (state: {
  profileOrders: ProfileOrdersState;
}) => state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: {
  profileOrders: ProfileOrdersState;
}) => state.profileOrders.isLoading;

export const selectProfileOrdersError = (state: {
  profileOrders: ProfileOrdersState;
}) => state.profileOrders.error;
