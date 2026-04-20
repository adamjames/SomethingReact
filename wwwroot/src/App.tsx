import React, { SyntheticEvent } from "react"

const { useState } = React

type Todo = {
  id: number
  description: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('All')

  async function addTodo(e: SyntheticEvent) {
    e.preventDefault()
    if (!newTodo.trim()) return
    const todo: Todo = { id: Date.now(), description: newTodo.trim(), completed: false }
    await fetch('/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(todo) })
    setTodos([...todos, todo])
    setNewTodo('')
  }

  async function toggleTodo(id: number) {
    const todo = todos.find(t => t.id === id)!
    const updated = { ...todo, completed: !todo.completed }
    await fetch(`/todos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setTodos(todos.map(t => t.id === id ? updated : t))
  }

  const filtered = todos.filter(t =>
    filter === 'All' ? true : filter === 'Active' ? !t.completed : t.completed
  )

  return (
    <div className="App">
      <div className="card">
        <form onSubmit={addTodo}>
          <input
            type="text"
            placeholder="What are we doing?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit" disabled={!newTodo.trim()}>Add</button>
        </form>

        <div>
          {['All', 'Active', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} disabled={filter === f}>{f}</button>
          ))}
        </div>

        <ul>
          {filtered.map(t => (
            <li key={t.id} onClick={() => toggleTodo(t.id)} style={{ cursor: 'pointer' }}>
              {t.completed ? 'DONE' : 'INCOMPLETE'} {t.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
