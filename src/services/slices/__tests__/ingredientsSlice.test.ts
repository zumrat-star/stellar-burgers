import ingredientsReducer, {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

// Моковые данные
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    image: '',
    image_large: '',
    image_mobile: ''
  },
  {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    price: 50,
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    image: '',
    image_large: '',
    image_mobile: ''
  }
];

describe('ingredients slice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  test('должен возвращать начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать fetchIngredients.rejected', () => {
    const errorMessage = 'Ошибка загрузки';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  describe('селекторы', () => {
    const mockState = {
      ingredients: {
        items: mockIngredients,
        isLoading: true,
        error: 'error'
      }
    };

    test('selectIngredients должен возвращать список ингредиентов', () => {
      expect(selectIngredients(mockState)).toEqual(mockIngredients);
    });

    test('selectIngredientsLoading должен возвращать статус загрузки', () => {
      expect(selectIngredientsLoading(mockState)).toBe(true);
    });

    test('selectIngredientsError должен возвращать ошибку', () => {
      expect(selectIngredientsError(mockState)).toBe('error');
    });
  });
});
