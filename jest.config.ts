/**
 * Configured Jest for Stellar Burgers project
 */

import type { Config } from 'jest';

const config: Config = {
  // Используем ts-jest для компиляции TypeScript
  preset: 'ts-jest',
  // Тестовая среда - jsdom (для React компонентов)
  testEnvironment: 'jsdom',
  // Файлы для настройки тестов
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Собираем покрытие кода
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/vite-env.d.ts',
    '!src/index.tsx',
    '!src/**/*.stories.{ts,tsx}'
  ],
  // Маппинг путей (чтобы работали импорты с @)
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components$': '<rootDir>/src/components',
    '^@ui$': '<rootDir>/src/components/ui',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@pages$': '<rootDir>/src/pages',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1'
  },
  // Трансформация файлов
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  // Где искать тесты
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  // Игнорируем node_modules
  testPathIgnorePatterns: ['/node_modules/'],
  // Показывать каждый тест
  verbose: true
};

export default config;
