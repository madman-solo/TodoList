import type { TableData } from "../components/ExcelTable";

// 存储版本号，用于数据结构变化时的兼容性处理
const STORAGE_VERSION = "1.0";

// 存储键前缀
const STORAGE_KEY_PREFIX = "couple_table_";

// 存储数据结构
interface StoredTableData {
  version: string;
  data: TableData;
  timestamp: number;
  userId?: string;
  coupleId?: string;
}

/**
 * 生成存储键
 * @param tableId 表格ID（如：weekly-evaluation）
 * @param userId 用户ID（可选）
 * @returns 完整的存储键
 */
const getStorageKey = (tableId: string, userId?: string): string => {
  return userId
    ? `${STORAGE_KEY_PREFIX}${tableId}_${userId}`
    : `${STORAGE_KEY_PREFIX}${tableId}`;
};

/**
 * 保存表格数据到localStorage
 * @param tableId 表格ID
 * @param data 表格数据
 * @param userId 用户ID（可选）
 * @param coupleId 情侣ID（可选）
 * @returns 是否保存成功
 */
export const saveTableData = (
  tableId: string,
  data: TableData,
  userId?: string,
  coupleId?: string
): boolean => {
  try {
    const storageKey = getStorageKey(tableId, userId);
    const storedData: StoredTableData = {
      version: STORAGE_VERSION,
      data,
      timestamp: Date.now(),
      userId,
      coupleId,
    };

    localStorage.setItem(storageKey, JSON.stringify(storedData));
    console.log(`[TableStorage] 保存成功: ${storageKey}`, storedData);
    return true;
  } catch (error) {
    console.error("[TableStorage] 保存失败:", error);
    return false;
  }
};

/**
 * 从localStorage读取表格数据
 * @param tableId 表格ID
 * @param userId 用户ID（可选）
 * @returns 表格数据，如果不存在或版本不匹配则返回null
 */
export const loadTableData = (
  tableId: string,
  userId?: string
): TableData | null => {
  try {
    const storageKey = getStorageKey(tableId, userId);
    const storedString = localStorage.getItem(storageKey);

    if (!storedString) {
      console.log(`[TableStorage] 未找到数据: ${storageKey}`);
      return null;
    }

    const storedData: StoredTableData = JSON.parse(storedString);

    // 检查版本兼容性
    if (storedData.version !== STORAGE_VERSION) {
      console.warn(
        `[TableStorage] 版本不匹配: 期望 ${STORAGE_VERSION}, 实际 ${storedData.version}`
      );
      // 可以在这里添加数据迁移逻辑
      return null;
    }

    console.log(`[TableStorage] 读取成功: ${storageKey}`, storedData);
    return storedData.data;
  } catch (error) {
    console.error("[TableStorage] 读取失败:", error);
    return null;
  }
};

/**
 * 清除表格数据
 * @param tableId 表格ID
 * @param userId 用户ID（可选）
 * @returns 是否清除成功
 */
export const clearTableData = (tableId: string, userId?: string): boolean => {
  try {
    const storageKey = getStorageKey(tableId, userId);
    localStorage.removeItem(storageKey);
    console.log(`[TableStorage] 清除成功: ${storageKey}`);
    return true;
  } catch (error) {
    console.error("[TableStorage] 清除失败:", error);
    return false;
  }
};

/**
 * 获取存储的元数据（不包含实际数据）
 * @param tableId 表格ID
 * @param userId 用户ID（可选）
 * @returns 元数据对象
 */
export const getTableMetadata = (
  tableId: string,
  userId?: string
): {
  exists: boolean;
  timestamp?: number;
  version?: string;
  userId?: string;
  coupleId?: string;
} => {
  try {
    const storageKey = getStorageKey(tableId, userId);
    const storedString = localStorage.getItem(storageKey);

    if (!storedString) {
      return { exists: false };
    }

    const storedData: StoredTableData = JSON.parse(storedString);
    return {
      exists: true,
      timestamp: storedData.timestamp,
      version: storedData.version,
      userId: storedData.userId,
      coupleId: storedData.coupleId,
    };
  } catch (error) {
    console.error("[TableStorage] 获取元数据失败:", error);
    return { exists: false };
  }
};

/**
 * 合并本地数据和服务器数据
 * 策略：基于时间戳，选择最新的数据
 * @param localData 本地数据
 * @param serverData 服务器数据
 * @param localTimestamp 本地时间戳
 * @param serverTimestamp 服务器时间戳
 * @returns 合并后的数据
 */
export const mergeTableData = (
  localData: TableData | null,
  serverData: TableData | null,
  localTimestamp?: number,
  serverTimestamp?: number
): TableData | null => {
  // 如果只有一方有数据，直接返回
  if (!localData && !serverData) return null;
  if (!localData) return serverData;
  if (!serverData) return localData;

  // 如果都有数据，比较时间戳
  if (localTimestamp && serverTimestamp) {
    console.log(
      `[TableStorage] 合并数据 - 本地时间: ${new Date(
        localTimestamp
      ).toLocaleString()}, 服务器时间: ${new Date(
        serverTimestamp
      ).toLocaleString()}`
    );

    // 返回最新的数据
    return localTimestamp > serverTimestamp ? localData : serverData;
  }

  // 如果没有时间戳，默认使用服务器数据
  console.log("[TableStorage] 无时间戳信息，使用服务器数据");
  return serverData;
};

/**
 * 检测数据冲突
 * @param localData 本地数据
 * @param serverData 服务器数据
 * @returns 是否存在冲突
 */
export const detectConflict = (
  localData: TableData | null,
  serverData: TableData | null
): boolean => {
  if (!localData || !serverData) return false;

  // 简单的冲突检测：比较数据是否完全相同
  const localStr = JSON.stringify(localData);
  const serverStr = JSON.stringify(serverData);

  return localStr !== serverStr;
};

/**
 * 获取所有存储的表格列表
 * @returns 表格ID列表
 */
export const getAllStoredTables = (): string[] => {
  try {
    const tables: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        // 提取表格ID
        const tableId = key.replace(STORAGE_KEY_PREFIX, "").split("_")[0];
        if (!tables.includes(tableId)) {
          tables.push(tableId);
        }
      }
    }
    return tables;
  } catch (error) {
    console.error("[TableStorage] 获取表格列表失败:", error);
    return [];
  }
};

/**
 * 清除所有表格数据
 * @returns 清除的数量
 */
export const clearAllTableData = (): number => {
  try {
    let count = 0;
    const keysToRemove: string[] = [];

    // 收集所有需要删除的键
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    // 删除
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      count++;
    });

    console.log(`[TableStorage] 清除所有数据: ${count} 个表格`);
    return count;
  } catch (error) {
    console.error("[TableStorage] 清除所有数据失败:", error);
    return 0;
  }
};

/**
 * 导出表格数据为JSON文件
 * @param tableId 表格ID
 * @param userId 用户ID（可选）
 */
export const exportTableToJSON = (tableId: string, userId?: string): void => {
  try {
    const data = loadTableData(tableId, userId);
    if (!data) {
      alert("没有可导出的数据");
      return;
    }

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${tableId}_${new Date().toISOString().split("T")[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    console.log(`[TableStorage] 导出成功: ${tableId}`);
  } catch (error) {
    console.error("[TableStorage] 导出失败:", error);
    alert("导出失败，请查看控制台");
  }
};

/**
 * 从JSON文件导入表格数据
 * @param file JSON文件
 * @param tableId 表格ID
 * @param userId 用户ID（可选）
 * @param coupleId 情侣ID（可选）
 * @returns Promise<boolean> 是否导入成功
 */
export const importTableFromJSON = (
  file: File,
  tableId: string,
  userId?: string,
  coupleId?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data: TableData = JSON.parse(content);

          // 验证数据结构
          if (!data.headers || !data.rows) {
            alert("无效的数据格式");
            resolve(false);
            return;
          }

          // 保存数据
          const success = saveTableData(tableId, data, userId, coupleId);
          if (success) {
            console.log(`[TableStorage] 导入成功: ${tableId}`);
          }
          resolve(success);
        } catch (error) {
          console.error("[TableStorage] 解析JSON失败:", error);
          alert("文件格式错误");
          resolve(false);
        }
      };

      reader.onerror = () => {
        console.error("[TableStorage] 读取文件失败");
        alert("读取文件失败");
        resolve(false);
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("[TableStorage] 导入失败:", error);
      resolve(false);
    }
  });
};
