// pages/index.tsx

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Todos() {
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);


  
  const fetchTodos = async () => {
    const { data } = await supabase.from('todos').select('*');
    setTodos(data || []);
  };

  const addTodo = async () => {
    if (newTodo.trim().length === 0) return;

    await supabase.from('todos').insert([{ title: newTodo }]);
    setNewTodo('');
    fetchTodos();
  };

  const completeTodo = async (id: string) => {
    await supabase.from('todos').update({ completed: true }).eq('id', id);
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id);
    fetchTodos();
  };

  return (
<div className="max-w-md mx-auto bg-gray-100 p-4 rounded-lg shadow">
  <h1 className="text-2xl font-bold mb-4 text-black">Aicha's To-Do List</h1>
  <div className="overflow-x-auto">
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-lg font-semibold text-black">Task</th>
          <th className="px-4 py-2 text-left text-lg font-semibold text-black">Status</th>
          <th className="px-4 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr key={todo.id} className="border-b border-gray-200">
            <td className={`px-4 py-2 ${todo.completed ? 'text-decoration-line-through text-gray-500' : 'text-black'}`}>
              {todo.title}
            </td>
            <td className={`px-4 py-2 font-bold ${todo.completed ? 'text-green-500' : 'text-red-500'}`}>
              {todo.completed ? 'Done' : 'Not Done'}
            </td>
            <td className="px-4 py-2 space-x-2">
              <button
                className="text-sm text-green-500"
                onClick={() => completeTodo(todo.id)}
              >
                Complete
              </button>
              <button
                className="text-sm text-red-500"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <form onSubmit={(e) => { e.preventDefault(); addTodo(); }}>
    <input
      type="text"
      value={newTodo}
      onChange={(e) => setNewTodo(e.target.value)}
      placeholder="Add a new todo..."
      className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500 mr-2"
    />
    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
      Add
    </button>
  </form>
</div>
  );
}