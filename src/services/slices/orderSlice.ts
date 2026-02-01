import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { clearConstructor } from './constructorSlice';

// Типы состояния
interface OrderState {
  orderData: TOrder | null;
  isLoading: boolean;
  error: string | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

// Начальное состояние
const initialState: OrderState = {
  orderData: null,
  isLoading: false,
  error: null,
  orderRequest: false,
  orderModalData: null
};

// 1. Создание заказа
export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[], { dispatch, rejectWithValue }) => {
    try {
      const order = await orderBurgerApi(ingredients);
      dispatch(clearConstructor());
      return order;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Ошибка оформления заказа');
      }
      return rejectWithValue('Неизвестная ошибка оформления заказа');
    }
  }
);

// 2. Получение заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (response.orders && response.orders.length > 0) {
        return response.orders[0];
      }
      throw new Error('Заказ не найден');
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Ошибка получения заказа');
      }
      return rejectWithValue('Неизвестная ошибка получения заказа');
    }
  }
);

// Создаем слайс
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderData = null;
      state.orderModalData = null;
      state.error = null;
    },

    // Установка данных для модального окна
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },

    // Сброс ошибки
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка createOrder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.orderData = action.payload;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = (action.payload as string) || 'Ошибка оформления заказа';
      })

      // Обработка fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Ошибка получения заказа';
      });
  }
});

// Экспортируем экшены и редьюсер
export const { clearOrder, setOrderModalData, clearOrderError } =
  orderSlice.actions;
export default orderSlice.reducer;

// Селекторы
export const selectOrderData = (state: { order: OrderState }) =>
  state.order.orderData;

export const selectOrderModalData = (state: { order: OrderState }) =>
  state.order.orderModalData;

export const selectOrderLoading = (state: { order: OrderState }) =>
  state.order.isLoading;

export const selectOrderRequest = (state: { order: OrderState }) =>
  state.order.orderRequest;

export const selectOrderError = (state: { order: OrderState }) =>
  state.order.error;
