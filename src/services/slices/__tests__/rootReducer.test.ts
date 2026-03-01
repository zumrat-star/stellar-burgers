import { rootReducer } from '../../rootReducer';

describe('rootReducer', () => {
  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние определено
    expect(initialState).toBeDefined();

    // Проверяем структуру начального состояния
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('auth');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('profileOrders');
    expect(initialState).toHaveProperty('profile');

    // Проверяем, что все редьюсеры инициализированы
    expect(initialState.ingredients).toBeDefined();
    expect(initialState.burgerConstructor).toBeDefined();
  });
});