import { useState, SyntheticEvent } from "react";

type Todo = {
  Id: number
  Description: string
  Completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('All')

  async function addTodo(e: SyntheticEvent) {
    e.preventDefault()
    if (!newTodo.trim()) return
    const todo: Todo = { Id: Date.now(), Description: newTodo.trim(), Completed: false }
    await fetch('/todos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(todo) })
    setTodos([...todos, todo])
    setNewTodo('')
  }

  async function toggleTodo(id: number) {
    const todo = todos.find(t => t.Id === id)!
    const updated = { ...todo, Completed: !todo.Completed }
    await fetch(`/todos/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    setTodos(todos.map(t => t.Id === id ? updated : t))
  }

  const filtered = todos.filter(t =>
    filter === 'All' ? true : filter === 'Active' ? !t.Completed : t.Completed
  )

  return (
    <div className="App">
      <div className="card">
        <form onSubmit={addTodo}>
          <input
            type="text"
            placeholder="What are we doing?"
            value={newTodo}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewTodo(e.target.value)}
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
            <li key={t.Id} onClick={() => toggleTodo(t.Id)} style={{ cursor: 'pointer' }}>
              {t.Completed ? 'DONE' : 'INCOMPLETE'} {t.Description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
