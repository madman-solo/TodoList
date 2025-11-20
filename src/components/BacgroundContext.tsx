// // src/contexts/BackgroundContext.tsx
// import { createContext, useContext, type ReactNode } from "react";
// import type { BackgroundItem } from "../services/api";
// import { persist } from "zustand/middleware";
// import { create } from "zustand";

// // 定义背景数据类型（与AnimationProps中的参数对应）
// interface BackgroundData {
//   background: string;
//   layers: {
//     type: "line" | "shape" | "image";
//     color?: string;
//     opacity: number;
//     zIndex: number;
//     path?: string;
//     image?: string;
//   }[];
//   selectedBackground: BackgroundItem | null; // 新增选中项的全局状态
// }
// // 定义Store类型（包含数据和修改数据的方法）
// interface BackgroundState extends BackgroundData {
//   setBackgroundData: (data: Partial<BackgroundData>) => void; // 支持部分更新
// }

// // 创建持久化的背景Store
// const useBackgroundStore = create<BackgroundState>()(
//   persist(
//     (set) => ({
//       background: "",
//       layers: [],
//       selectedBackground: null,
//       setBackgroundData: (newData) =>
//         set((state: BackgroundState) => ({ ...state, ...newData })),
//     }),
//     {
//       name: "background-storage", // 存储在localStorage中的键名
//     }
//   )
// );

// const BackgroundContext = createContext<
//   ReturnType<typeof useBackgroundStore> | undefined
// >(undefined);

// // Provider组件：提供全局背景数据
// export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
//   const backgroundStore = useBackgroundStore();
//   return (
//     <BackgroundContext.Provider value={backgroundStore}>
//       {children}
//     </BackgroundContext.Provider>
//   );
// };

// // 自定义Hook：简化数据获取
// export const useBackgroundContext = () => {
//   const context = useContext(BackgroundContext);
//   if (!context) {
//     throw new Error("必须在BackgroundProvider中使用");
//   }
//   return context;
// };

// src/contexts/BackgroundContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import type { BackgroundItem } from "../services/api";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { useThemeStore } from "../store";

// 定义背景数据类型
interface BackgroundData {
  background: string;
  layers: {
    type: "line" | "shape" | "image";
    color?: string;
    opacity: number;
    zIndex: number;
    path?: string;
    image?: string;
  }[];
  selectedBackground: BackgroundItem | null;
}

// 定义Store类型
interface BackgroundState extends BackgroundData {
  setBackgroundData: (data: Partial<BackgroundData>) => void;
  setAsBackground: (item: BackgroundItem) => void;
}

// 创建持久化的背景Store
const useBackgroundStore = create<BackgroundState>()(
  persist(
    (set) => ({
      background: "",
      layers: [],
      selectedBackground: null,
      setBackgroundData: (newData) =>
        set((state: BackgroundState) => ({ ...state, ...newData })),

      // 新增：设置背景并同步到主题存储
      setAsBackground: (item: BackgroundItem) => {
        const backgroundUrl = item.preview;
        const layers = [
          { type: "shape" as const, color: "#a2d9ce", opacity: 0.7, zIndex: 1 },
          { type: "line" as const, color: "#1abc9c", opacity: 0.9, zIndex: 2 },
          { type: "shape" as const, color: "#76d7ea", opacity: 0.5, zIndex: 3 },
        ];

        // 更新背景存储
        set({
          background: backgroundUrl,
          layers: layers,
          selectedBackground: item,
        });

        // 同步到主题存储
        const themeStore = useThemeStore.getState();
        themeStore.setBackground(backgroundUrl);
      },
    }),
    {
      name: "background-storage",
    }
  )
);

const BackgroundContext = createContext<
  ReturnType<typeof useBackgroundStore> | undefined
>(undefined);

// Provider组件
export const BackgroundProvider = ({ children }: { children: ReactNode }) => {
  const backgroundStore = useBackgroundStore();
  return (
    <BackgroundContext.Provider value={backgroundStore}>
      {children}
    </BackgroundContext.Provider>
  );
};

// 自定义Hook
export const useBackgroundContext = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("必须在BackgroundProvider中使用");
  }
  return context;
};
