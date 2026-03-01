/// <reference types="cypress" />

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.setCookie('accessToken', 'fake-access-token');
    localStorage.setItem('refreshToken', 'fake-refresh-token');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();

      cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
    });
  });

  describe('Страница ингредиента', () => {
    it('должен открывать страницу ингредиента при клике', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
      cy.contains('Детали ингредиента').should('exist');
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('1255').should('exist');
    });
  });

  describe('Создание заказа', () => {
    it('должен создавать заказ и очищать конструктор', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();
      // Добавляем начинку
      cy.contains('Филе Люминесцентного тетраодонтимформа')
        .parents('li')
        .find('button')
        .contains('Добавить')
        .click();
      // Нажимаем кнопку оформления заказа
      cy.contains('Оформить заказ').click();
      // Ждем ответ от сервера
      cy.wait('@createOrder');
      // Проверяем, что номер заказа отображается
      cy.contains('12345', { timeout: 15000 }).should('be.visible');
      // Проверяем текст "идентификатор заказа"
      cy.contains('идентификатор заказа').should('be.visible');
      // Находим кнопку закрытия по иконке CloseIcon
      cy.get('svg').parents('button').first().click({ force: true });
      // Даем время на закрытие
      cy.wait(1000);
      // Проверяем, что конструктор пуст
      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
