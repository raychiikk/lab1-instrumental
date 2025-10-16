import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTodos } from '../useTodos';

// Мокаємо localStorage
const localStorageMock = (() => {
let store = {};
return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
};
})();

global.localStorage = localStorageMock;

describe('useTodos', () => {
beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

it('ініціалізується з порожнім списком', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
    expect(result.current.allTodos).toEqual([]);
});

it('додає нову задачу', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
    result.current.addTodo('Test task');
    });

    expect(result.current.allTodos).toHaveLength(1);
    expect(result.current.allTodos[0].text).toBe('Test task');
});

it('перемикає статус задачі', () => {
    const { result } = renderHook(() => useTodos());
    
    let todoId;
    act(() => {
    const todo = result.current.addTodo('Test task');
    todoId = todo.id;
    });

    act(() => {
    result.current.toggleTodo(todoId);
    });

    expect(result.current.allTodos[0].completed).toBe(true);

    act(() => {
    result.current.toggleTodo(todoId);
    });

    expect(result.current.allTodos[0].completed).toBe(false);
});

it('видаляє задачу', () => {
    const { result } = renderHook(() => useTodos());
    
    let todoId;
    act(() => {
    const todo = result.current.addTodo('Test task');
    todoId = todo.id;
    });

    expect(result.current.allTodos).toHaveLength(1);

    act(() => {
    result.current.deleteTodo(todoId);
    });

    expect(result.current.allTodos).toHaveLength(0);
});

it('фільтрує задачі правильно', () => {
    const { result } = renderHook(() => useTodos());
    
    let todoId1;
    act(() => {
    const todo1 = result.current.addTodo('Task 1');
    result.current.addTodo('Task 2');
    todoId1 = todo1.id;
    result.current.toggleTodo(todoId1);
    });

    // За замовчуванням показує всі
    expect(result.current.todos).toHaveLength(2);

    // Фільтр активних
    act(() => {
    result.current.setFilter('active');
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].completed).toBe(false);

    // Фільтр виконаних
    act(() => {
    result.current.setFilter('completed');
    });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].completed).toBe(true);
});

it('зберігає задачі в localStorage', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
    result.current.addTodo('Persistent task');
    });

    const stored = localStorage.getItem('todos-app-data');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].text).toBe('Persistent task');
});

it('завантажує задачі з localStorage при ініціалізації', () => {
    const testTodos = [{
    id: 'test-1',
    text: 'Stored task',
    completed: false,
    createdAt: Date.now()
    }];
    
    localStorage.setItem('todos-app-data', JSON.stringify(testTodos));

    const { result } = renderHook(() => useTodos());
    
    expect(result.current.allTodos).toHaveLength(1);
    expect(result.current.allTodos[0].text).toBe('Stored task');
});
});