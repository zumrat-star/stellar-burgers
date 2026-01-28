import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Типы состояния
interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

// Начальное состояние
const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

// Функция для создания ингредиента с уникальным id
const createConstructorIngredient = (
  ingredient: TIngredient
): TConstructorIngredient => ({
  ...ingredient,
  id: uuidv4()
});

// Создаем слайс
const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление булки
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    // Добавление ингредиента
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const newIngredient = createConstructorIngredient(action.payload);
      state.ingredients.push(newIngredient);
    },

    // Удаление ингредиента по id
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },

    // Перемещение ингредиента (drag and drop)
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const ingredients = [...state.ingredients];
      const draggedItem = ingredients[dragIndex];

      // Удаляем перетаскиваемый элемент
      ingredients.splice(dragIndex, 1);
      // Вставляем на новую позицию
      ingredients.splice(hoverIndex, 0, draggedItem);

      state.ingredients = ingredients;
    },

    // Очистка всего конструктора (после оформления заказа)
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },

    // Обновление ингредиента (на случай если нужно изменить данные)
    updateIngredient: (
      state,
      action: PayloadAction<{
        id: string;
        changes: Partial<TConstructorIngredient>;
      }>
    ) => {
      const index = state.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.ingredients[index] = {
          ...state.ingredients[index],
          ...action.payload.changes
        };
      }
    }
  }
});

// Экспортируем экшены и редьюсер
export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  updateIngredient
} = constructorSlice.actions;
export default constructorSlice.reducer;

// Селекторы
export const selectConstructor = (state: {
  burgerConstructor: ConstructorState;
}) => state.burgerConstructor;

export const selectConstructorBun = (state: {
  burgerConstructor: ConstructorState;
}) => state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: {
  burgerConstructor: ConstructorState;
}) => state.burgerConstructor.ingredients;

// Селектор для расчёта общей стоимости
export const selectTotalPrice = (state: {
  burgerConstructor: ConstructorState;
}) => {
  const { bun, ingredients } = state.burgerConstructor;
  const bunPrice = bun ? bun.price * 2 : 0;
  const ingredientsPrice = ingredients.reduce(
    (total, item) => total + item.price,
    0
  );
  return bunPrice + ingredientsPrice;
};
