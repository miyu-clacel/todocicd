import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export const fetchTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from("todo")
    .select()
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []) as Todo[];
};

export const insertTodo = async (title: string): Promise<Error | null> => {
  const { error } = await supabase.from("todo").insert({ title })
  return error;
};
