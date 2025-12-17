// 基础API配置
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// 请求工具函数
const request = async <T>(
  endpoint: string,
  options: RequestInit & {
    params?: Record<string, string | number | boolean>;
    requiresAuth?: boolean;
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

  // 添加认证头
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    Object.entries(options.headers).forEach(([key, value]) => {
      if (typeof value === "string") {
        headers[key] = value;
      }
    });
  }

  if (options.requiresAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
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

// 用户认证API
export const authAPI = {
  // 用户登录
  login: (credentials: LoginCredentials) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // 用户注册
  register: (userData: RegisterData) =>
    request<LoginResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
};

// 认证相关类型定义
export interface LoginCredentials {
  // id: number;
  name: string;
  // email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  // email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    password: string;
    // email: string;
  };
}

export interface User {
  id: number;
  name: string;
  password: string;
  // email: string;
}

// 数据同步API
interface SyncData {
  myBackgrounds: BackgroundItem[];
  myFonts: FontItem[];
  myThemes: ThemeItem[];
  likedItems: IconItem[];
  favoriteFonts: FontItem[];
  isDarkMode: boolean;
  background: string;
  font: string;
}
export const syncAPI = {
  // 同步用户数据到云端
  syncToCloud: (data: SyncData) =>
    request<{ success: boolean }>("/sync/upload", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    }),

  // 从云端获取用户数据
  syncFromCloud: () =>
    request<SyncData>("/sync/download", {
      method: "GET",
      requiresAuth: true,
    }),

  // 备份用户数据
  backupData: () =>
    request<{ backupId: string }>("/sync/backup", {
      method: "POST",
      requiresAuth: true,
    }),

  // 恢复用户数据
  restoreData: (backupId: string) =>
    request<SyncData>(`/sync/restore/${backupId}`, {
      method: "POST",
      requiresAuth: true,
    }),
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
  name: string;
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
  name: string;
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
