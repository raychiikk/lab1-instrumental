import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { getTodoStats } from './utils/todoUtils';
import './App.css';

/**
 * @file Головний компонент додатку Todo List.
 * @brief Рендерить інтерфейс, керує станом форми та обробляє взаємодію користувача.
 * Використовує хук `useTodos` для основної логіки.
 * @returns {JSX.Element} JSX-розмітка всього додатку.
 */
function App() {
  const {
    todos,
    allTodos,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    clearAll
  } = useTodos();

  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('low');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const stats = getTodoStats(allTodos);

  /**
   * Обробник відправки форми.
   * Створює нову задачу через `addTodo`.
   * @param {React.FormEvent} e - Подія форми.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      try {
        addTodo(inputValue, { priority });
        setInputValue('');
        setPriority('low');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  /**
   * Активує режим редагування для задачі.
   * @param {Todo} todo - Об'єкт задачі, що редагується.
   */
  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  /**
   * Зберігає зміни після редагування.
   * @param {string} id - ID задачі, що зберігається.
   */
  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      try {
        updateTodo(id, { text: editText.trim() });
        setEditingId(null);
        setEditText('');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  /**
   * Скасовує режим редагування.
   */
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>📝 Todo List</h1>
          <div className="stats">
            <span>Всього: {stats.total}</span>
            <span>Активних: {stats.active}</span>
            <span>Виконано: {stats.completed}</span>
            <span>Прогрес: {stats.completionRate}%</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="add-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Додати нову задачу..."
            className="input"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="select"
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
          <button type="submit" className="btn btn-primary">
            Додати
          </button>
        </form>

        <div className="controls">
          <div className="filter-buttons">
            <button
              onClick={() => setFilter('all')}
              className={`btn ${filter === 'all' ? 'btn-active' : ''}`}
            >
              Всі
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`btn ${filter === 'active' ? 'btn-active' : ''}`}
            >
              Активні
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`btn ${filter === 'completed' ? 'btn-active' : ''}`}
            >
              Виконані
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select"
          >
            <option value="date">За датою</option>
            <option value="alphabetical">За алфавітом</option>
            <option value="priority">За пріоритетом</option>
          </select>
        </div>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-message">
              Немає задач
            </li>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="checkbox"
                />

                {editingId === todo.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="input"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      className="btn btn-small btn-success"
                    >
                      Зберегти
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-small"
                    >
                      Скасувати
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="todo-text">{todo.text}</span>
                    <span className={`priority-badge priority-${todo.priority}`}>
                      {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                    </span>
                    <div className="todo-actions">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="btn btn-small"
                        disabled={todo.completed}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="btn btn-small btn-danger"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>

        {allTodos.length > 0 && (
          <div className="footer-actions">
            <button onClick={clearCompleted} className="btn">
              Очистити виконані
            </button>
            <button onClick={clearAll} className="btn btn-danger">
              Очистити все
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
