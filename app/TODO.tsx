import { createClient } from '@/utils/supabase/server';

export default async function Todos() {
  const supabase = createClient();
  const { data: todo, error } = await supabase.from('TODO').select();

  if (error) {
    console.error('Error fetching todos:', error.message); // Log the error message
    return <div>Error fetching todos: {error.message}</div>; // Display the error message to the user
  }

  if (!todo) {
    console.warn('No todos found');
    return <div>No todos found</div>;
  }

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {todo.map((TODO) => (
          <li key={TODO.id}>{TODO.Title}, {TODO.done ? 'Done' : 'Not Done'}</li>
        ))}
      </ul>
    </div>
  );
  
}
