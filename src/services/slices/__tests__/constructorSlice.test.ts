import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  updateIngredient,
  selectConstructor,
  selectTotalPrice
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Моковые данные
const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

describe('burgerConstructor slice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('должен возвращать начальное состояние', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('должен обрабатывать добавление булки (addBun)', () => {
    const newState = constructorReducer(initialState, addBun(mockBun));
    expect(newState.bun).toEqual(mockBun);
    expect(newState.ingredients).toEqual([]);
  });

  test('должен обрабатывать добавление ингредиента (addIngredient)', () => {
    const newState = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toMatchObject(mockIngredient);
    expect(newState.ingredients[0]).toHaveProperty('id'); // должен быть сгенерирован uuid
  });

  test('должен обрабатывать удаление ингредиента (removeIngredient)', () => {
    // Сначала добавляем ингредиент
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;

    // Удаляем его
    const newState = constructorReducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );
    expect(newState.ingredients).toHaveLength(0);
  });

  test('должен обрабатывать перемещение ингредиентов (moveIngredient)', () => {
    // Добавляем два ингредиента
    let state = constructorReducer(initialState, addIngredient(mockIngredient));
    const secondIngredient = {
      ...mockIngredient,
      _id: '3',
      name: 'Другая начинка'
    };
    state = constructorReducer(state, addIngredient(secondIngredient));

    const firstId = state.ingredients[0].id;
    const secondId = state.ingredients[1].id;

    // Меняем местами (dragIndex: 0, hoverIndex: 1)
    const newState = constructorReducer(
      state,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(newState.ingredients[0].id).toBe(secondId);
    expect(newState.ingredients[1].id).toBe(firstId);
  });

  test('должен обрабатывать очистку конструктора (clearConstructor)', () => {
    const stateWithItems = {
      bun: mockBun,
      ingredients: [
        { ...mockIngredient, id: 'test-id' } as TConstructorIngredient
      ]
    };

    const newState = constructorReducer(stateWithItems, clearConstructor());
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
  });

  test('должен обрабатывать обновление ингредиента (updateIngredient)', () => {
    // Добавляем ингредиент
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(mockIngredient)
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;

    // Обновляем его
    const newState = constructorReducer(
      stateWithIngredient,
      updateIngredient({
        id: ingredientId,
        changes: { price: 999 }
      })
    );

    expect(newState.ingredients[0].price).toBe(999);
  });

  describe('селекторы', () => {
    const mockState = {
      burgerConstructor: {
        bun: mockBun,
        ingredients: [
          { ...mockIngredient, id: '1' } as TConstructorIngredient,
          { ...mockIngredient, id: '2' } as TConstructorIngredient
        ]
      }
    };

    test('selectConstructor должен возвращать весь конструктор', () => {
      expect(selectConstructor(mockState)).toEqual(mockState.burgerConstructor);
    });

    test('selectTotalPrice должен правильно рассчитывать цену', () => {
      // Цена булки * 2 + цена двух ингредиентов = 100*2 + 50*2 = 300
      expect(selectTotalPrice(mockState)).toBe(300);
    });
  });
});
