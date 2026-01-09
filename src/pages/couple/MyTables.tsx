/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import ExcelTable, { type TableData } from "../../components/ExcelTable";
import { useCoupleStore } from "../../store/coupleStore";
import { saveTableData, loadTableData } from "../../utils/tableStorage";
import socketService from "../../services/socketService";

const MyTables: React.FC = () => {
  const { coupleRelation, coupleId } = useCoupleStore();
  const [tableData, setTableData] = useState<TableData | null>(null);

  // 初始化表格数据
  useEffect(() => {
    const savedData = loadTableData("weekly-summary");
    if (savedData) {
      setTableData(savedData);
    } else {
      // 创建默认的一周双方总结表
      const partnerName = coupleRelation?.partner?.name || "对方";

      const headers = [
        "#",
        "周数",
        "我的总结",
        `${partnerName}的总结`,
        "改进之处",
      ];
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
      const newData = { headers, rows };
      setTableData(newData);
      saveTableData("weekly-summary", newData);
    }
  }, [coupleRelation]);

  // 保存数据到localStorage并同步
  const handleDataChange = (data: TableData) => {
    setTableData(data);
    saveTableData("weekly-summary", data);

    // WebSocket实时同步
    if (coupleId) {
      socketService.send({
        type: "table-update",
        data: { tableType: "weekly-summary", data },
      });
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
        <h2 css={styles.title}>📊 一周双方总结表</h2>
        <p css={styles.subtitle}>记录你们每周的总结和完成情况，共同进步！</p>
      </div>

      <div css={styles.tableWrapper}>
        <ExcelTable
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
          <span>所有修改都会自动保存</span>
        </div>
      </div>
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
};

export default MyTables;
