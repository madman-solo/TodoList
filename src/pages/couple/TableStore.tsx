/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { tableTemplates } from "../../utils/tableTemplates";
import { saveTable, setActiveTableId, getAllTables } from "../../utils/tableManager";
import ExcelTable from "../../components/ExcelTable";
import { useUserStore } from "../../store";
import { trackActivity } from "../../utils/activityTracker";

const TableStore: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const handleCardClick = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleUseTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const template = tableTemplates.find(t => t.id === templateId);
    if (!template) return;

    // 获取所有已存在的表格
    const allTables = getAllTables();

    // 计算同一模板已经被使用的次数
    const sameTemplateCount = allTables.filter(
      t => t.templateId === template.id
    ).length;

    // 生成带序号的表格名称
    const tableName = sameTemplateCount > 0
      ? `${template.name} #${sameTemplateCount + 1}`
      : template.name;

    // 创建新的表格记录
    const newTableId = `table_${Date.now()}`;
    saveTable({
      id: newTableId,
      name: tableName,
      templateId: template.id,
      data: template.data,
      createdAt: new Date().toISOString(),
    });

    // 设置为当前活跃表格
    setActiveTableId(newTableId);

    // 追踪活跃度
    if (user?.id) {
      trackActivity(String(user.id), "tables");
    }

    // 跳转到我的表格页面
    navigate("/couple/table/my-tables");
  };

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h2 css={styles.title}>🏪 表格商店</h2>
        <p css={styles.subtitle}>选择适合你们的表格模板，开始记录美好生活</p>
      </div>

      <div css={styles.grid}>
        {tableTemplates.map((template) => (
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

              {/* 真实的表格预览 */}
              <div css={styles.tablePreview}>
                <ExcelTable
                  initialData={template.data}
                  onChange={() => {}} // 预览模式，不允许编辑
                  minRows={template.data.rows.length}
                  minCols={template.data.headers.length}
                  readOnly={true}
                />
              </div>

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
  tablePreview: css`
    margin: 16px 0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    max-height: 300px;
    overflow-y: auto;
    background: #f9f9f9;

    /* 缩小表格预览的字体 */
    font-size: 12px;

    /* 禁用表格编辑功能 */
    pointer-events: none;
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
