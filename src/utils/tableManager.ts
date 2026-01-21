// 多表格管理工具
import type { TableData } from "../components/ExcelTable";

export interface TableRecord {
  id: string;
  name: string;
  templateId: string;
  data: TableData;
  createdAt: string;
  updatedAt: string;
}

// 获取所有表格记录
export const getAllTables = (): TableRecord[] => {
  const tablesJson = localStorage.getItem("user-tables");
  if (!tablesJson) return [];
  try {
    return JSON.parse(tablesJson);
  } catch {
    return [];
  }
};

// 保存表格记录
export const saveTable = (record: Omit<TableRecord, "updatedAt">): void => {
  const tables = getAllTables();
  const existingIndex = tables.findIndex(t => t.id === record.id);

  const updatedRecord = {
    ...record,
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    tables[existingIndex] = updatedRecord;
  } else {
    tables.push(updatedRecord);
  }

  localStorage.setItem("user-tables", JSON.stringify(tables));
};

// 获取单个表格
export const getTableById = (id: string): TableRecord | null => {
  const tables = getAllTables();
  return tables.find(t => t.id === id) || null;
};

// 删除表格
export const deleteTable = (id: string): void => {
  const tables = getAllTables();
  const filtered = tables.filter(t => t.id !== id);
  localStorage.setItem("user-tables", JSON.stringify(filtered));
};

// 获取当前活跃表格ID
export const getActiveTableId = (): string | null => {
  return localStorage.getItem("active-table-id");
};

// 设置当前活跃表格ID
export const setActiveTableId = (id: string): void => {
  localStorage.setItem("active-table-id", id);
};

