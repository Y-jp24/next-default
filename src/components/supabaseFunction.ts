import { supabase } from './supabase';

const getAllTodos = async () => {
  const todos = await supabase.from('todo').select('*');
  return todos;
}