// 基础API配置
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// 请求工具函数
const request = async <T>(
  endpoint: string,
  options: RequestInit & {
    params?: Record<string, string | number | boolean>;
  } = {}
): Promise<T> => {
  let url = `${API_BASE_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`请求${endpoint}失败:`, error);
    throw error;
  }
};

// 背景相关API
export const backgroundAPI = {
  // 获取推荐内容
  getRecommendations: () =>
    request<{
      themes: ThemeItem[];
      fonts: FontItem[];
      backgrounds: BackgroundItem[];
      icons: IconItem[];
    }>("/recommendations"),

  // 获取主题列表
  getThemes: (category?: string) =>
    request<ThemeItem[]>("/themes", {
      method: "GET",
      params: { category: category || "all" },
    }),

  // 获取字体列表
  getFonts: (category?: string) =>
    request<FontItem[]>("/fonts", {
      method: "GET",
      params: { category: category || "all" },
    }),

  // 获取背景列表
  getBackgrounds: (category?: string) =>
    request<BackgroundItem[]>("/backgrounds", {
      method: "GET",
      params: { category: category || "all" },
    }),

  // 获取图标列表
  getIcons: (category?: string) =>
    request<IconItem[]>("/icons", {
      method: "GET",
      // headers: {
      //   Category: category || "all",
      // },
      params: { category: category || "all" },
    }),

  // 获取轮播内容
  getCarousel: (type: "theme" | "font" | "background" | "icon" | "recommend") =>
    request<CarouselItem[]>(`/carousel/${type}`),

  // 获取每日精选内容：
  getDailyCarousel: () => request<DailyItem[]>(`/dailyCarousel`),
};

// 数据类型定义
export interface DailyItem {
  id: number;
  title: string;
  type: string;
  image?: string;
}
export interface CarouselItem {
  id: number;
  title: string;
  desc: string;
  image?: string;
}

export interface ThemeItem {
  id: number;
  title: string;
  preview: string;
  category: string;
  downloadCount: number;
  isNew: boolean;
}

export interface FontItem {
  id: number;
  name: string;
  previewText: string;
  preview: string;
  category: string;
  url: string;
  isPremium: boolean;
}

export interface BackgroundItem {
  id: number;
  title: string;
  preview: string;
  category: string;
  resolution: string;
  size: number;
}

export interface IconItem {
  id: number;
  name: string;
  preview: string;
  category: string;
  format: string[];
  count: number;
}
