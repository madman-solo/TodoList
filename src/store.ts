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
    position: { x: number; y: number };
  }[];
  addTodo: (content: string) => void;
  updateTodo: (id: number, content: string) => void;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  updatePosition: (id: number, position: { x: number; y: number }) => void;
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
    (set) => ({
      todos: [],
      addTodo: (content) => {
        const newTodo = {
          id: Date.now(),
          content,
          completed: false,
          position: { x: 0, y: 0 },
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
      updatePosition: (id, position) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, position } : todo
          ),
        })),
    }),
    { name: "todo-storage" }
  )
);

// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// // 定义待办事项类型
// interface ITodo {
//   id: number;
//   content: string;
//   completed: boolean;
// }

// // 状态仓库
// export const useTodoStore = create(
//   persist(
//     (set, get) => ({
//       todoList: [] as ITodo[],
//       // 添加待办
//       addTodo: (content: string) => {
//         if (content.trim()) {
//           set({
//             todoList: [
//               ...get().todoList,
//               { id: Date.now(), content, completed: false },
//             ],
//           });
//         }
//       },
//       // 切换完成状态
//       toggleTodo: (id: number) => {
//         set({
//           todoList: get().todoList.map((todo) =>
//             todo.id === id ? { ...todo, completed: !todo.completed } : todo
//           ),
//         });
//       },
//       // 删除待办
//       removeTodo: (id: number) => {
//         set({
//           todoList: get().todoList.filter((todo) => todo.id !== id),
//         });
//       },
//       // 拖拽排序
//       reorderTodos: (fromIndex: number, toIndex: number) => {
//         const newTodoList = [...get().todoList];
//         const [movedItem] = newTodoList.splice(fromIndex, 1);
//         newTodoList.splice(toIndex, 0, movedItem);
//         set({ todoList: newTodoList });
//       },
//     }),
//     { name: "todo-storage" } // 持久化存储到 localStorage
//   )
// );
