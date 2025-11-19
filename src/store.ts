import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FontItem, ThemeItem, BackgroundItem } from "./services/api";
interface ItemBase {
  id: number;
  name: string;
  preview: string;
  [key: string]: unknown;
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
  // 新增状态
  myFonts: FontItem[];
  likedItems: ItemBase[];
  myThemes: ThemeItem[];
  myBackgrounds: BackgroundItem[];

  // 方法
  addToMyFonts: (font: FontItem) => void;
  removeFont: (id: number) => void;
  addToLiked: (item: ItemBase) => void;
  removeLike: (id: number) => void;
  addToMyThemes: (theme: ThemeItem) => void;
  removeTheme: (id: number) => void;
  addToMyBackgrounds: (bg: BackgroundItem) => void;
  removeBackground: (id: number) => void;
  downloadFont: (font: FontItem) => void;
  removeFavorite: (id: number) => void;
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
      myFonts: [],
      likedItems: [],
      myThemes: [],
      myBackgrounds: [],
      // 添加字体到我的字体
      addToMyFonts: (font) => {
        set((state) => {
          if (!state.myFonts.some((item) => item.id === font.id)) {
            return { myFonts: [...state.myFonts, font] };
          }
          return state;
        });
      },

      // 从我的字体中移除
      removeFont: (id) => {
        set((state) => ({
          myFonts: state.myFonts.filter((item) => item.id !== id),
        }));
      },

      // 添加到点赞
      addToLiked: (item) => {
        set((state) => {
          if (!state.likedItems.some((i) => i.id === item.id)) {
            return { likedItems: [...state.likedItems, item] };
          }
          return state;
        });
      },

      // 取消点赞
      removeLike: (id) => {
        set((state) => ({
          likedItems: state.likedItems.filter((item) => item.id !== id),
        }));
      },

      // 添加主题
      addToMyThemes: (theme) => {
        set((state) => {
          if (!state.myThemes.some((item) => item.id === theme.id)) {
            return { myThemes: [...state.myThemes, theme] };
          }
          return state;
        });
      },

      // 移除主题
      removeTheme: (id) => {
        set((state) => ({
          myThemes: state.myThemes.filter((item) => item.id !== id),
        }));
      },

      // 添加背景
      addToMyBackgrounds: (bg) => {
        set((state) => {
          if (!state.myBackgrounds.some((item) => item.id === bg.id)) {
            return { myBackgrounds: [...state.myBackgrounds, bg] };
          }
          return state;
        });
      },

      // 移除背景
      removeBackground: (id) => {
        set((state) => ({
          myBackgrounds: state.myBackgrounds.filter((item) => item.id !== id),
        }));
      },
      // todo:下载文件有问题，下载字体文件下载的应该是什么以及确保下载后返回原页面不会出现问题
      // todo:能不能用cheerio以及puppeteer-core进行从网页爬取数据放进prisma数据库中，这里可以用于满足主题内容？或者icon?
      // todo:所有单人用户登录之后存在保存的数据，在退出登录之后这些所有的保存的事件都会消失，用户再次登录时数据又会恢复。
      // todo:背景内容更新以及数据库中未填的数据。
      // todo:点击推荐页面中的小盒子之后会跳转到相应路由下的页面，同时该内容会显示特定状态。
      // todo：背景更换时，是整个项目的背景都会变（这里应该会和星空起冲突，考虑是否去掉，更简约一点）
      // todo:优化侧边栏样式，以及内层我的页面中的字体以及样式。

      // 下载字体并保存到本地
      downloadFont: (font) => {
        // 触发浏览器下载
        const link = document.createElement("a");
        link.href = font.url;
        link.download = `${font.name}.ttf`; // 根据实际字体格式调整
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      // 移除收藏
      removeFavorite: (id) => {
        set((state) => ({
          favoriteFonts: state.favoriteFonts.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: "theme-storage",
    }
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
