/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";

const TableStyle: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h2 css={styles.title}>📋 表格样式</h2>
        <p css={styles.subtitle}>自定义你们的表格外观和风格</p>
      </div>

      <div css={styles.content}>
        <div css={styles.card}>
          <div css={styles.cardIcon}>🎨</div>
          <h3 css={styles.cardTitle}>主题设置</h3>
          <p css={styles.cardDesc}>选择表格的颜色主题和样式</p>
          <button css={styles.button} onClick={() => alert("功能开发中...")}>
            设置主题
          </button>
        </div>

        <div css={styles.card}>
          <div css={styles.cardIcon}>📊</div>
          <h3 css={styles.cardTitle}>查看表格</h3>
          <p css={styles.cardDesc}>查看和编辑你们的一周总结表</p>
          <button
            css={styles.button}
            onClick={() => navigate("/couple/table/my-tables")}
          >
            前往表格
          </button>
        </div>

        <div css={styles.card}>
          <div css={styles.cardIcon}>⚙️</div>
          <h3 css={styles.cardTitle}>高级设置</h3>
          <p css={styles.cardDesc}>更多表格自定义选项</p>
          <button css={styles.button} onClick={() => alert("功能开发中...")}>
            高级设置
          </button>
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
  header: css`
    text-align: center;
    margin-bottom: 40px;
  `,
  title: css`
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,
  subtitle: css`
    font-size: 16px;
    color: #666;
    margin: 0;
  `,
  content: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  `,
  card: css`
    background: white;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  `,
  cardIcon: css`
    font-size: 48px;
    margin-bottom: 16px;
  `,
  cardTitle: css`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
  `,
  cardDesc: css`
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
    line-height: 1.6;
  `,
  button: css`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.9;
    }

    &:active {
      transform: scale(0.98);
    }
  `,
};

export default TableStyle;
