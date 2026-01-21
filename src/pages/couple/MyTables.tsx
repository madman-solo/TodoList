/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import ExcelTable, { type TableData } from "../../components/ExcelTable";
import { useCoupleStore } from "../../store/coupleStore";
import { saveTableData, loadTableData } from "../../utils/tableStorage";
import socketService from "../../services/socketService";
import { useUserStore } from "../../store";
import { trackActivity } from "../../utils/activityTracker";
import {
  getAllTables,
  saveTable,
  getActiveTableId,
  setActiveTableId,
  deleteTable,
  type TableRecord
} from "../../utils/tableManager";

const MyTables: React.FC = () => {
  const { coupleRelation, coupleId } = useCoupleStore();
  const { user } = useUserStore();
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [allTables, setAllTables] = useState<TableRecord[]>([]);
  const [activeTableId, setActiveTableIdState] = useState<string | null>(null);
  const [currentTableName, setCurrentTableName] = useState<string>("一周双方总结表");

  // 初始化表格数据
  useEffect(() => {
    // 加载所有表格记录
    const tables = getAllTables();
    setAllTables(tables);

    // 获取当前活跃表格ID
    const currentActiveId = getActiveTableId();
    setActiveTableIdState(currentActiveId);

    // 如果有活跃表格，加载它
    if (currentActiveId && tables.length > 0) {
      const activeTable = tables.find(t => t.id === currentActiveId);
      if (activeTable) {
        setTableData(activeTable.data);
        setCurrentTableName(activeTable.name);
        return;
      }
    }

    // 否则加载默认表格
    const savedData = loadTableData("weekly-summary");
    const partnerName = coupleRelation?.partner?.name || "对方";
    const newHeaders = ["周数", "我的总结", `${partnerName}的总结`, "改进之处"];

    if (savedData) {
      // 检测旧表头并自动更新
      const needsUpdate =
        savedData.headers[1] === "我的任务" ||
        savedData.headers[2]?.includes("任务");

      if (needsUpdate) {
        console.log("[MyTables] 检测到旧表头，自动更新为新表头");
        // 保留行数据，只更新表头
        const updatedData = {
          headers: newHeaders,
          rows: savedData.rows,
        };
        setTableData(updatedData);
        saveTableData("weekly-summary", updatedData);

        // 如果没有历史记录，将这个表格保存到历史
        if (tables.length === 0) {
          const defaultTableId = "table_default_weekly";
          saveTable({
            id: defaultTableId,
            name: "一周双方总结表",
            templateId: "weekly-summary",
            data: updatedData,
            createdAt: new Date().toISOString(),
          });
          setActiveTableId(defaultTableId);
          setActiveTableIdState(defaultTableId);
          setAllTables([...tables, {
            id: defaultTableId,
            name: "一周双方总结表",
            templateId: "weekly-summary",
            data: updatedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }]);
        }
      } else {
        // 表头正确，直接使用
        setTableData(savedData);

        // 如果没有历史记录，将这个表格保存到历史
        if (tables.length === 0) {
          const defaultTableId = "table_default_weekly";
          saveTable({
            id: defaultTableId,
            name: "一周双方总结表",
            templateId: "weekly-summary",
            data: savedData,
            createdAt: new Date().toISOString(),
          });
          setActiveTableId(defaultTableId);
          setActiveTableIdState(defaultTableId);
          setAllTables([...tables, {
            id: defaultTableId,
            name: "一周双方总结表",
            templateId: "weekly-summary",
            data: savedData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }]);
        }
      }
    } else {
      // 创建默认的一周双方总结表
      const today = new Date();
      const rows = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
        const weekDay = [
          "周日",
          "周一",
          "周二",
          "周三",
          "周四",
          "周五",
          "周六",
        ][date.getDay()];
        rows.push([`${dateStr} ${weekDay}`, "", "", ""]);
      }
      const newData = { headers: newHeaders, rows };
      setTableData(newData);
      saveTableData("weekly-summary", newData);

      // 将默认表格保存到历史记录
      const defaultTableId = "table_default_weekly";
      saveTable({
        id: defaultTableId,
        name: "一周双方总结表",
        templateId: "weekly-summary",
        data: newData,
        createdAt: new Date().toISOString(),
      });
      setActiveTableId(defaultTableId);
      setActiveTableIdState(defaultTableId);
      setAllTables([{
        id: defaultTableId,
        name: "一周双方总结表",
        templateId: "weekly-summary",
        data: newData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]);
    }
  }, [coupleRelation]);

  // 数据变化时只更新状态，不自动保存
  const handleDataChange = (data: TableData) => {
    setTableData(data);
  };

  // 手动保存数据
  const handleSaveData = () => {
    if (!tableData) return;

    // 如果有活跃表格，更新它
    if (activeTableId) {
      const tables = getAllTables();
      const activeTable = tables.find(t => t.id === activeTableId);
      if (activeTable) {
        saveTable({
          ...activeTable,
          data: tableData,
          createdAt: activeTable.createdAt,
        });
        // 更新allTables状态
        setAllTables(getAllTables());
      }
    } else {
      // 否则使用旧的存储方式
      saveTableData("weekly-summary", tableData);
    }

    // 追踪活跃度
    if (user?.id) {
      trackActivity(String(user.id), "tables");
    }

    // WebSocket实时同步
    if (coupleId) {
      socketService.send({
        type: "table-update",
        data: { tableType: "weekly-summary", data: tableData },
      });
    }

    // 显示保存成功提示
    alert("保存成功！");
  };

  // 切换表格
  const handleSwitchTable = (tableId: string) => {
    // 从localStorage重新加载最新数据，而不是使用状态中的旧数据
    const tables = getAllTables();
    const table = tables.find(t => t.id === tableId);
    if (table) {
      setTableData(table.data);
      setActiveTableIdState(tableId);
      setActiveTableId(tableId);
      setCurrentTableName(table.name);
      // 同步更新allTables状态
      setAllTables(tables);
    }
  };

  // 删除表格
  const handleDeleteTable = (tableId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发切换表格

    // 确认删除
    const table = allTables.find(t => t.id === tableId);
    if (!table) return;

    const confirmDelete = window.confirm(`确定要删除表格"${table.name}"吗？此操作不可恢复。`);
    if (!confirmDelete) return;

    // 执行删除
    deleteTable(tableId);

    // 更新状态
    const updatedTables = getAllTables();
    setAllTables(updatedTables);

    // 如果删除的是当前活跃表格，需要切换到其他表格
    if (activeTableId === tableId) {
      if (updatedTables.length > 0) {
        // 切换到第一个表格
        const firstTable = updatedTables[0];
        setTableData(firstTable.data);
        setActiveTableIdState(firstTable.id);
        setActiveTableId(firstTable.id);
        setCurrentTableName(firstTable.name);
      } else {
        // 没有表格了，创建默认表格
        const partnerName = coupleRelation?.partner?.name || "对方";
        const newHeaders = ["周数", "我的总结", `${partnerName}的总结`, "改进之处"];
        const today = new Date();
        const rows = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
          const weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()];
          rows.push([`${dateStr} ${weekDay}`, "", "", ""]);
        }
        const newData = { headers: newHeaders, rows };
        setTableData(newData);
        setActiveTableIdState(null);
        setActiveTableId("");
        setCurrentTableName("一周双方总结表");
      }
    }
  };

  // 监听WebSocket消息
  useEffect(() => {
    const handleMessage = (message: { type: string; data: unknown }) => {
      if (message.type === "table-update") {
        const messageData = message.data as {
          tableType?: string;
          data?: TableData;
        };
        if (messageData.tableType === "weekly-summary" && messageData.data) {
          setTableData(messageData.data);
          saveTableData("weekly-summary", messageData.data);
        }
      }
    };

    const unsubscribe = socketService.subscribe(handleMessage);
    return () => {
      unsubscribe();
    };
  }, []);

  if (!tableData) {
    return (
      <div css={styles.loading}>
        <div css={styles.spinner}></div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h2 css={styles.title}>{currentTableName}</h2>
        <p css={styles.subtitle}>记录你们每周的总结和完成情况，共同进步！</p>
      </div>

      <div css={styles.tableWrapper}>
        <div css={styles.tableHeader}>
          <button css={styles.saveButton} onClick={handleSaveData}>
            💾 保存
          </button>
        </div>
        <ExcelTable
          key={activeTableId || 'default'}
          initialData={tableData}
          onChange={handleDataChange}
          minRows={7}
          minCols={4}
        />
      </div>

      <div css={styles.tips}>
        <div css={styles.tipItem}>
          <span css={styles.tipIcon}>💡</span>
          <span>双击单元格即可编辑内容</span>
        </div>
        <div css={styles.tipItem}>
          <span css={styles.tipIcon}>🔄</span>
          <span>数据会实时同步给对方</span>
        </div>
        <div css={styles.tipItem}>
          <span css={styles.tipIcon}>💾</span>
          <span>点击保存按钮保存修改</span>
        </div>
      </div>

      {/* 表格历史记录 */}
      {allTables.length > 0 && (
        <div css={styles.historySection}>
          <h4 css={styles.historyTitle}>📋 表格历史</h4>
          <div css={styles.historyList}>
            {allTables.map((table) => (
              <div
                key={table.id}
                css={[
                  styles.historyItem,
                  activeTableId === table.id && styles.historyItemActive
                ]}
              >
                <button
                  css={styles.historyItemButton}
                  onClick={() => handleSwitchTable(table.id)}
                >
                  <span css={styles.historyIcon}>{table.name.includes('📊') ? '📊' : '📝'}</span>
                  <span css={styles.historyName}>{table.name}</span>
                </button>
                <button
                  css={styles.deleteButton}
                  onClick={(e) => handleDeleteTable(table.id, e)}
                  title="删除表格"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: css`
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
  `,
  loading: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 20px;
    color: #666;
    font-size: 18px;
  `,
  spinner: css`
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #ff6b9d;
    border-radius: 50%;
    animation: spin 1s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,
  header: css`
    text-align: center;
    margin-bottom: 30px;
  `,
  title: css`
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,
  subtitle: css`
    font-size: 16px;
    color: #666;
    margin: 0;
  `,
  tableWrapper: css`
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  `,
  tableHeader: css`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
  `,
  saveButton: css`
    padding: 10px 24px;
    font-size: 15px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 107, 157, 0.4);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(255, 107, 157, 0.3);
    }
  `,
  tips: css`
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 30px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  `,
  tipItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #555;
  `,
  tipIcon: css`
    font-size: 20px;
  `,
  historySection: css`
    margin-top: 20px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  `,
  historyTitle: css`
    font-size: 14px;
    font-weight: 600;
    color: #666;
    margin: 0 0 12px 0;
  `,
  historyList: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `,
  historyItem: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    font-size: 13px;
    color: #555;
    transition: all 0.2s ease;
    overflow: hidden;

    &:hover {
      background: #e8e8e8;
      border-color: #d0d0d0;
    }
  `,
  historyItemActive: css`
    background: #ff6b9d;
    color: white;
    border-color: #ff6b9d;

    &:hover {
      background: #ff5a8c;
      border-color: #ff5a8c;
    }
  `,
  historyItemButton: css`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    flex: 1;
    font-size: inherit;
    text-align: left;
  `,
  deleteButton: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    margin-right: 4px;
    background: transparent;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.2s ease;
    border-radius: 4px;

    &:hover {
      background: rgba(255, 0, 0, 0.1);
      color: #ff4444;
    }

    &:active {
      transform: scale(0.9);
    }
  `,
  historyIcon: css`
    font-size: 16px;
  `,
  historyName: css`
    font-weight: 500;
  `,
};

export default MyTables;
