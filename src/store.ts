import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  user: { id: string; name: string } | null;
  login: (userData: { id: string; name: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  background: string;
  setBackground: (bg: string) => void;
}

interface TodoState {
  todos: {
    id: number;
    content: string;
    completed: boolean;
    position: { x: number; y: number } | null;
  }[];
  addTodo: (content: string) => void;
  updateTodo: (id: number, content: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  updatePosition: (
    fromIndex: number,
    toIndex: number,
    position?: { x: number; y: number }
  ) => void;
  initialPosition: (id: number, position: { x: number; y: number }) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "user-storage" }
  )
);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      background: "default",
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setBackground: (bg) => set({ background: bg }),
    }),
    { name: "theme-storage" }
  )
);

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (content) => {
        const newTodo = {
          id: Date.now(),
          content, //这是传进来的内容，从Input里传进来的
          completed: false,
          position: null, //重点：初始位置都是同一个地方，所以不能正确排列？
        };
        set((state) => ({ todos: [...state.todos, newTodo] }));
      },
      updateTodo: (id, content) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, content } : todo
          ),
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      initialPosition: (id: number, position: { x: number; y: number }) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, position } : todo
          ),
        }));
      },
      // 正确的 updatePosition 实现：基于索引交换位置
      updatePosition: (
        fromIndex: number,
        toIndex: number,
        position?: { x: number; y: number }
      ) => {
        // 通过 get() 获取当前状态
        const currentTodos = get().todos;
        // 复制数组并调整顺序
        const newTodos = [...currentTodos];
        const [movedItem] = newTodos.splice(fromIndex, 1); // 从原索引移除
        // 如果传递了 position，更新移动后项的位置
        if (position) {
          movedItem.position = position;
        }
        newTodos.splice(toIndex, 0, movedItem); // 插入新索引

        // 通过 set() 更新状态
        set({ todos: newTodos });
      },
    }),
    { name: "todo-storage" }
  )
);
