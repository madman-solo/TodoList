/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { useCoupleStore } from "../store/coupleStore";

// 表格数据类型定义
interface WeeklyThought {
  day: string; // 星期几
  myThought: string; // 我的想法
  taThought: string; // TA的想法
}

interface WeeklyThoughtsTableProps {
  onDataChange?: (data: WeeklyThought[]) => void;
}

const WeeklyThoughtsTable: React.FC<WeeklyThoughtsTableProps> = ({
  onDataChange,
}) => {
  const { coupleRelation } = useCoupleStore();
  const [thoughts, setThoughts] = useState<WeeklyThought[]>([]);
  const [editingCell, setEditingCell] = useState<{
    day: string;
    field: "myThought" | "taThought";
  } | null>(null);

  // 初始化表格数据
  useEffect(() => {
    const savedData = localStorage.getItem("weekly-thoughts");
    if (savedData) {
      setThoughts(JSON.parse(savedData));
    } else {
      // 初始化一周数据
      const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
      const initialData = weekDays.map((day) => ({
        day,
        myThought: "",
        taThought: "",
      }));
      setThoughts(initialData);
    }
  }, []);

  // 保存数据到 localStorage
  useEffect(() => {
    if (thoughts.length > 0) {
      localStorage.setItem("weekly-thoughts", JSON.stringify(thoughts));
      onDataChange?.(thoughts);
    }
  }, [thoughts, onDataChange]);

  // 处理单元格编辑
  const handleCellEdit = (
    day: string,
    field: "myThought" | "taThought",
    value: string
  ) => {
    setThoughts((prev) =>
      prev.map((item) =>
        item.day === day ? { ...item, [field]: value } : item
      )
    );
  };

  // 清空本周内容
  const handleClearWeek = () => {
    if (window.confirm("确定要清空本周所有内容吗？")) {
      setThoughts((prev) =>
        prev.map((item) => ({ ...item, myThought: "", taThought: "" }))
      );
    }
  };

  // 导出本周内容
  const handleExport = () => {
    const content = thoughts
      .map(
        (item) =>
          `${item.day}:\n我的想法: ${item.myThought || "无"}\nTA的想法: ${item.taThought || "无"}\n`
      )
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `每周想法_${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const myName = "我";
  const partnerName = coupleRelation?.partner?.name || "TA";

  return (
    <div css={styles.container}>
      {/* 操作按钮区 */}
      <div css={styles.actions}>
        <button css={styles.actionBtn} onClick={handleClearWeek}>
          <span>🗑️</span>
          <span>清空本周</span>
        </button>
        <button css={styles.actionBtn} onClick={handleExport}>
          <span>📤</span>
          <span>导出内容</span>
        </button>
      </div>

      {/* 表格主体 */}
      <div css={styles.tableWrapper}>
        <table css={styles.table}>
          <thead>
            <tr>
              <th css={styles.headerCell}>星期</th>
              <th css={[styles.headerCell, styles.myThoughtHeader]}>
                {myName}的想法
              </th>
              <th css={[styles.headerCell, styles.taThoughtHeader]}>
                {partnerName}的想法
              </th>
            </tr>
          </thead>
          <tbody>
            {thoughts.map((item) => (
              <tr key={item.day} css={styles.row}>
                <td css={styles.dayCell}>{item.day}</td>
                <td
                  css={[styles.cell, styles.myThoughtCell]}
                  onClick={() =>
                    setEditingCell({ day: item.day, field: "myThought" })
                  }
                >
                  {editingCell?.day === item.day &&
                  editingCell?.field === "myThought" ? (
                    <input
                      css={styles.input}
                      type="text"
                      value={item.myThought}
                      onChange={(e) =>
                        handleCellEdit(item.day, "myThought", e.target.value)
                      }
                      onBlur={() => setEditingCell(null)}
                      autoFocus
                      placeholder="点击输入想法..."
                    />
                  ) : (
                    <span css={styles.cellContent}>
                      {item.myThought || "点击输入..."}
                    </span>
                  )}
                </td>
                <td css={[styles.cell, styles.taThoughtCell]}>
                  <span css={styles.cellContent}>
                    {item.taThought || "暂无内容"}
                  </span>
                  <span css={styles.lockIcon}>🔒</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 提示信息 */}
      <div css={styles.tips}>
        <div css={styles.tipItem}>
          <span css={styles.tipIcon}>💡</span>
          <span>点击「我的想法」单元格即可编辑</span>
        </div>
        <div css={styles.tipItem}>
          <span css={styles.tipIcon}>🔒</span>
          <span>「TA的想法」仅查看，模拟情侣数据隔离</span>
        </div>
        <div css={styles.tipItem}>
          <span css={styles.tipIcon}>💾</span>
          <span>所有修改自动保存到本地</span>
        </div>
      </div>
    </div>
  );
};

// 样式定义（支持 dark/light 模式）
const styles = {
  container: css`
