import { useEffect, useCallback } from "react";
import { useUserStore, useThemeStore } from "../store";
import {
  syncAPI,
  type BackgroundItem,
  type FontItem,
  type ThemeItem,
  type IconItem,
} from "../services/api";

// 定义要同步的数据结构
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

export const useDataSync = () => {
  const { isAuthenticated, user } = useUserStore();
  const themeStore = useThemeStore();

  // 从云端同步数据到本地
  const syncFromCloud = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const cloudData = await syncAPI.syncFromCloud();

      // 更新本地状态
      themeStore.setState({
        myBackgrounds: cloudData.myBackgrounds || [],
        myFonts: cloudData.myFonts || [],
        myThemes: cloudData.myThemes || [],
        likedItems: (cloudData.likedItems ||
          []) as unknown as typeof themeStore.likedItems,
        favoriteFonts: cloudData.favoriteFonts || [],
        isDarkMode: cloudData.isDarkMode || false,
        background: cloudData.background || "default",
        font: cloudData.font || "poppins",
      });

      console.log("数据同步完成");
    } catch (error) {
      console.error("从云端同步数据失败:", error);
    }
  }, [isAuthenticated, user, themeStore]);

  // 将本地数据同步到云端
  const syncToCloud = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      // 准备要同步的数据
      const syncData: SyncData = {
        myBackgrounds: themeStore.myBackgrounds,
        myFonts: themeStore.myFonts,
        myThemes: themeStore.myThemes,
        likedItems: themeStore.likedItems as unknown as IconItem[],
        favoriteFonts: themeStore.favoriteFonts,
        isDarkMode: themeStore.isDarkMode,
        background: themeStore.background,
        font: themeStore.font,
      };

      await syncAPI.syncToCloud(syncData);
      console.log("数据已同步到云端");
    } catch (error) {
      console.error("同步数据到云端失败:", error);
    }
  }, [isAuthenticated, user, themeStore]);

  // 数据备份
  const backupData = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const result = await syncAPI.backupData();
      console.log("数据备份成功，备份ID:", result.backupId);
      return result.backupId;
    } catch (error) {
      console.error("数据备份失败:", error);
    }
  }, [isAuthenticated, user]);

  // 数据恢复
  const restoreData = useCallback(
    async (backupId: string) => {
      if (!isAuthenticated || !user) return;

      try {
        const restoredData = await syncAPI.restoreData(backupId);

        // 更新本地状态
        themeStore.setState({
          myBackgrounds: restoredData.myBackgrounds || [],
          myFonts: restoredData.myFonts || [],
          myThemes: restoredData.myThemes || [],
          likedItems: (restoredData.likedItems ||
            []) as unknown as typeof themeStore.likedItems,
          favoriteFonts: restoredData.favoriteFonts || [],
          isDarkMode: restoredData.isDarkMode || false,
          background: restoredData.background || "default",
          font: restoredData.font || "poppins",
        });

        console.log("数据恢复成功");
      } catch (error) {
        console.error("数据恢复失败:", error);
      }
    },
    [isAuthenticated, user, themeStore]
  );

  // 自动同步（当用户登录时）
  useEffect(() => {
    if (isAuthenticated && user) {
      syncFromCloud();
    }
  }, [isAuthenticated, user, syncFromCloud]);

  // 监听本地数据变化并自动同步到云端
  useEffect(() => {
    if (isAuthenticated && user) {
      const syncTimer = setTimeout(() => {
        syncToCloud();
      }, 5000); // 5秒延迟同步，避免频繁请求

      return () => clearTimeout(syncTimer);
    }
  }, [
    themeStore.myBackgrounds,
    themeStore.myFonts,
    themeStore.myThemes,
    themeStore.likedItems,
    themeStore.favoriteFonts,
    themeStore.isDarkMode,
    themeStore.background,
    themeStore.font,
    isAuthenticated,
    user,
    syncToCloud,
  ]);

  return {
    syncFromCloud,
    syncToCloud,
    backupData,
    restoreData,
  };
};
