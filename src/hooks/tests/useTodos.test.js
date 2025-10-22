import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodos } from '../useTodos';

// Створення мок-об'єкта для імітації localStorage
// Це необхідно для ізоляції тестів від реального браузерного середовища
const localStorageMock = (() => {
  let store = {}; // Внутрішнє сховище для даних
  return {
      // Метод для отримання даних за ключем
      getItem: (key) => store[key] || null,
      // Метод для збереження даних (перетворюємо значення в рядок)
      setItem: (key, value) => { store[key] = value.toString(); },
      // Метод для видалення даних
      removeItem: (key) => { delete store[key]; },
      // Метод для повного очищення сховища
      clear: () => { store = {}; }
  };
})();

// Замінюємо глобальний localStorage на наш мок-об'єкт
// Це гарантує, що тести не впливатимуть на реальні дані браузера
global.localStorage = localStorageMock;

// Основний блок тестів для хука useTodos
describe('useTodos', () => {
  // Функція, яка виконується перед кожним тестом
  // Забезпечує чистий стан для кожного тесту
  beforeEach(() => {
      localStorage.clear();  // Очищаємо мокований localStorage
      vi.clearAllMocks();    // Очищаємо всі моки Vitest
  });

  // Тест: перевірка початкової ініціалізації хука
  it('ініціалізується з порожнім списком', () => {
      // renderHook використовується для тестування React хуків
      // Він рендерить хук у віртуальному середовищі
      const { result } = renderHook(() => useTodos());
      
      // Перевіряємо, що обидва списки задач спочатку порожні
      // todos - відфільтрований список, allTodos - всі задачі
      expect(result.current.todos).toEqual([]);
      expect(result.current.allTodos).toEqual([]);
  });

  // Тест: перевірка додавання нової задачі
  it('додає нову задачу', () => {
      const { result } = renderHook(() => useTodos());
      
      // act використовується для оновлення стану в React
      // Всі операції, що змінюють стан, повинні бути обгорнуті в act
      act(() => {
      result.current.addTodo('Test task');
      });

      // Перевіряємо, що задача додалася до списку
      expect(result.current.allTodos).toHaveLength(1);
      // Перевіряємо, що текст задачі зберігся правильно
      expect(result.current.allTodos[0].text).toBe('Test task');
  });

  // Тест: перевірка перемикання статусу задачі (виконано/не виконано)
  it('перемикає статус задачі', () => {
      const { result } = renderHook(() => useTodos());
      
      let todoId; // Змінна для зберігання ID створеної задачі
      
      // Створюємо нову задачу та зберігаємо її ID
      act(() => {
      const todo = result.current.addTodo('Test task');
      todoId = todo.id;
      });

      // Перше перемикання - має змінити статус на true (виконано)
      act(() => {
      result.current.toggleTodo(todoId);
      });

      // Перевіряємо, що задача стала виконаною
      expect(result.current.allTodos[0].completed).toBe(true);

      // Друге перемикання - має повернути статус на false (не виконано)
      act(() => {
      result.current.toggleTodo(todoId);
      });

      // Перевіряємо, що задача знову стала невиконаною
      expect(result.current.allTodos[0].completed).toBe(false);
  });

  // Тест: перевірка видалення задачі
  it('видаляє задачу', () => {
      const { result } = renderHook(() => useTodos());
      
      let todoId;
      
      // Створюємо задачу
      act(() => {
      const todo = result.current.addTodo('Test task');
      todoId = todo.id;
      });

      // Перевіряємо, що задача дійсно додалася
      expect(result.current.allTodos).toHaveLength(1);

      // Видаляємо задачу
      act(() => {
      result.current.deleteTodo(todoId);
      });

      // Перевіряємо, що список став порожнім
      expect(result.current.allTodos).toHaveLength(0);
  });

  // Тест: перевірка роботи фільтрів (всі/активні/виконані)
  it('фільтрує задачі правильно', () => {
      const { result } = renderHook(() => useTodos());
      
      let todoId1;
      
      // Створюємо дві задачі та одну з них позначаємо виконаною
      act(() => {
      const todo1 = result.current.addTodo('Task 1');
      result.current.addTodo('Task 2');
      todoId1 = todo1.id;
        result.current.toggleTodo(todoId1); // Робимо першу задачу виконаною
      });

      // За замовчуванням має показувати всі задачі (2 задачі)
      expect(result.current.todos).toHaveLength(2);

      // Тестуємо фільтр "активні" (невиконані задачі)
      act(() => {
      result.current.setFilter('active');
      });
      // Має залишитися тільки одна активна задача
      expect(result.current.todos).toHaveLength(1);
      // Перевіряємо, що залишилася невиконана задача
      expect(result.current.todos[0].completed).toBe(false);

      // Тестуємо фільтр "виконані"
      act(() => {
      result.current.setFilter('completed');
      });
      // Має залишитися тільки одна виконана задача
      expect(result.current.todos).toHaveLength(1);
      // Перевіряємо, що залишилася виконана задача
      expect(result.current.todos[0].completed).toBe(true);
  });

  // Тест: перевірка збереження даних у localStorage
  it('зберігає задачі в localStorage', () => {
      const { result } = renderHook(() => useTodos());
      
      // Додаємо задачу, що має зберегтися в localStorage
      act(() => {
      result.current.addTodo('Persistent task');
      });

      // Отримуємо дані з localStorage
      const stored = localStorage.getItem('todos-app-data');
      // Перевіряємо, що дані дійсно збереглися
      expect(stored).toBeTruthy();
      
      // Парсимо збережені дані з JSON
      const parsed = JSON.parse(stored);
      // Перевіряємо кількість збережених задач
      expect(parsed).toHaveLength(1);
      // Перевіряємо коректність збереженого тексту задачі
      expect(parsed[0].text).toBe('Persistent task');
  });

  // Тест: перевірка завантаження даних з localStorage при ініціалізації
  it('завантажує задачі з localStorage при ініціалізації', () => {
      // Створюємо тестові дані для localStorage
      const testTodos = [{
      id: 'test-1',
      text: 'Stored task',
      completed: false,
      createdAt: Date.now()
      }];
      
      // Імітуємо наявність даних в localStorage перед ініціацією хука
      localStorage.setItem('todos-app-data', JSON.stringify(testTodos));

      // Рендеримо хук - він має автоматично завантажити дані з localStorage
      const { result } = renderHook(() => useTodos());
      
      // Перевіряємо, що задача завантажилася
      expect(result.current.allTodos).toHaveLength(1);
      // Перевіряємо коректність завантажених даних
      expect(result.current.allTodos[0].text).toBe('Stored task');
  });
});