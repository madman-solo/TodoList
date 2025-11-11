/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const TableStyle = () => {
  // 表格类型选项
  const tableTypes = [
    { id: "daily", name: "日常打卡" },
    { id: "dates", name: "约会记录" },
    { id: "gifts", name: "礼物清单" },
    { id: "memories", name: "美好回忆" },
  ];

  return (
    <div css={container}>
      <h2>表格样式</h2>
      <div css={tableSelector}>
        {tableTypes.map((type) => (
          <button key={type.id} css={tableButton}>
            {type.name}
          </button>
        ))}
      </div>

      <div css={tablePlaceholder}>
        <p>表格内容将在后续通过API加载</p>
        <p>敬请期待...</p>
      </div>
    </div>
  );
};

// 样式
const container = css`
  padding: 20px;
`;

const tableSelector = css`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

const tableButton = css`
  padding: 8px 16px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #e0e0e0;
  }
`;

const tablePlaceholder = css`
  padding: 40px;
  text-align: center;
  background: #f9f9f9;
  border-radius: 8px;
  color: #666;
`;

export default TableStyle;
