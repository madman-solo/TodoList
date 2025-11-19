import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FontItem } from "./services/api";

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
      // 更新 updatePosition 方法，确保正确交换位置
      updatePosition: (fromIndex: number, toIndex: number) => {
        const currentTodos = get().todos;
        const newTodos = [...currentTodos];

        // 交换位置
        const temp = newTodos[fromIndex];
        newTodos[fromIndex] = newTodos[toIndex];
        newTodos[toIndex] = temp;

        set({ todos: newTodos });
      },
    }),
    { name: "todo-storage" }
  )
);

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  background: string;
  setBackground: (bg: string) => void;
  font: string; // 新增字体设置
  setFont: (font: string) => void; // 新增设置字体方法
  favoriteFonts: FontItem[]; // 收藏的字体列表
  toggleFavoriteFont: (font: FontItem) => void; // 切换字体收藏状态
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "user-storage", // 存储在localStorage中的键名
    }
  )
);

// 添加任务数据存储
interface Task {
  id: string;
  content: string;
  completed: boolean;
  createdAt: Date;
}

interface TaskState {
  tasks: Record<string, Task[]>; // 按用户ID存储任务
  addTask: (userId: string, task: Omit<Task, "id" | "createdAt">) => void;
  toggleTask: (userId: string, taskId: string) => void;
  deleteTask: (userId: string, taskId: string) => void;
}
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      background: "default",
      font: "poppins", // 默认字体
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setBackground: (bg) => set({ background: bg }),
      setFont: (font) => set({ font }), // 新增方法
      favoriteFonts: [],
      toggleFavoriteFont: (font) => {
        set((state) => {
          const isFavorite = state.favoriteFonts.some((f) => f.id === font.id);
          if (isFavorite) {
            return {
              favoriteFonts: state.favoriteFonts.filter(
                (f) => f.id !== font.id
              ),
            };
          } else {
            return { favoriteFonts: [...state.favoriteFonts, font] };
          }
        });
      },
    }),
    { name: "theme-storage" }
  )
);

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: {},
      addTask: (userId, task) =>
        set((state) => {
          const newTask = {
            ...task,
            id: Date.now().toString(),
            createdAt: new Date(),
          };
          return {
            tasks: {
              ...state.tasks,
              [userId]: state.tasks[userId]
                ? [...state.tasks[userId], newTask]
                : [newTask],
            },
          };
        }),
      toggleTask: (userId, taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [userId]:
              state.tasks[userId]?.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ) || [],
          },
        })),
      deleteTask: (userId, taskId) =>
        set((state) => ({
          tasks: {
            ...state.tasks,
            [userId]:
              state.tasks[userId]?.filter((task) => task.id !== taskId) || [],
          },
        })),
    }),
    {
      name: "tasks-storage",
    }
  )
);
