/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";

interface TableTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

const TableStore: React.FC = () => {
  // 选中的模板ID状态
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  // 表格模板数据
  const templates: TableTemplate[] = [
    {
      id: "weekly-summary",
      name: "一周双方总结表",
      description: "记录每周双方的想法",
      icon: "📊",
      category: "日常",
    },
    {
      id: "monthly-plan",
      name: "月度计划表",
      description: "规划每月的目标和计划",
      icon: "📅",
      category: "计划",
    },
    {
      id: "budget-tracker",
      name: "预算跟踪表",
      description: "记录和管理双方的收支情况",
      icon: "💰",
      category: "财务",
    },
    {
      id: "travel-plan",
      name: "旅行计划表",
      description: "规划旅行行程和预算",
      icon: "✈️",
      category: "旅行",
    },
    {
      id: "fitness-log",
      name: "健身打卡表",
      description: "记录每日运动和健身情况",
      icon: "💪",
      category: "健康",
    },
    {
      id: "reading-list",
      name: "阅读清单",
      description: "记录想读和已读的书籍",
      icon: "📚",
      category: "学习",
    },
  ];

  const handleCardClick = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleUseTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡到卡片点击
    // TODO: 实现模板使用功能
    alert(`即将使用模板: ${templateId}\n此功能正在开发中...`);
  };

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h2 css={styles.title}>🏪 表格商店</h2>
        <p css={styles.subtitle}>选择适合你们的表格模板，开始记录美好生活</p>
      </div>

      <div css={styles.grid}>
        {templates.map((template) => (
          <div
            key={template.id}
            css={[
              styles.card,
              selectedTemplateId === template.id && styles.cardSelected,
            ]}
            onClick={() => handleCardClick(template.id)}
          >
            <div css={styles.cardIcon}>{template.icon}</div>
            <div css={styles.cardContent}>
              <h3 css={styles.cardTitle}>{template.name}</h3>
              <p css={styles.cardDescription}>{template.description}</p>
              <div css={styles.cardFooter}>
                <span css={styles.category}>{template.category}</span>
                <button
                  css={styles.useButton}
                  onClick={(e) => handleUseTemplate(template.id, e)}
                >
                  使用模板
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div css={styles.comingSoon}>
        <div css={styles.comingSoonIcon}>🚀</div>
        <h3>更多模板即将上线</h3>
        <p>我们正在开发更多实用的表格模板，敬请期待！</p>
      </div>
    </div>
  );
};

const styles = {
  container: css`
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
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
  grid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-bottom: 40px;
  `,
  card: css`
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    border: 2px solid transparent;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  `,
  cardSelected: css`
    border: 2px solid #667eea;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.05) 0%,
      rgba(118, 75, 162, 0.05) 100%
    );
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
    transform: translateY(-4px);
  `,
  cardIcon: css`
    font-size: 48px;
    text-align: center;
    margin-bottom: 16px;
  `,
  cardContent: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
  `,
  cardTitle: css`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0;
  `,
  cardDescription: css`
    font-size: 14px;
    color: #666;
    line-height: 1.6;
    margin: 0;
  `,
  cardFooter: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
  `,
  category: css`
    font-size: 12px;
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 500;
  `,
  useButton: css`
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: scale(0.98);
    }
  `,
  comingSoon: css`
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    h3 {
      font-size: 24px;
      color: #333;
      margin: 16px 0 8px;
    }

    p {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
  `,
  comingSoonIcon: css`
    font-size: 64px;
  `,
};

export default TableStore;
