/** @jsxImportSource @emotion/react */ // 顶部添加这行，指定 JSX 转换
import { useNavigate } from "react-router-dom";
import { FaTrash, FaDownload } from "react-icons/fa";
import { useThemeStore } from "../store";
import { css } from "@emotion/react";

// 定义基础Item接口
interface BaseItem {
  id: number;
  name: string;
  preview: string;
}

// 组件 props 泛型化
interface MyItemsTemplateProps<T extends BaseItem> {
  title: string;
  items: T[];
  onDelete?: (id: number) => void;
  showDownload?: boolean;
  onDownload?: (item: T) => void;
}

const MyItemsTemplate = <T extends BaseItem>({
  title,
  items,
  onDelete,
  showDownload = false,
  onDownload,
}: MyItemsTemplateProps<T>) => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div css={containerStyle(isDarkMode)}>
        <div css={headerStyle}>
          <h2>{title}</h2>
          <button css={backButtonStyle} onClick={() => navigate(-1)}>
            返回
          </button>
        </div>
        <div css={emptyStyle(isDarkMode)}>
          <p>暂无相关内容</p>
        </div>
      </div>
    );
  }

  return (
    <div css={containerStyle(isDarkMode)}>
      <div css={headerStyle}>
        <h2>{title}</h2>
        <div css={headerActionsStyle}>
          <span css={countStyle(isDarkMode)}>{items.length} 项内容</span>
          <button css={backButtonStyle} onClick={() => navigate(-1)}>
            返回
          </button>
        </div>
      </div>

      <div css={gridStyle}>
        {items.map((item) => (
          <div key={item.id} css={cardStyle(isDarkMode)}>
            <div
              css={previewStyle}
              style={{ backgroundImage: `url(${item.preview})` }}
            />
            <div css={infoStyle}>
              <h3>{item.name}</h3>
              <div css={actionsStyle}>
                {showDownload && onDownload && (
                  <button
                    css={actionButtonStyle("download")}
                    onClick={() => onDownload(item)}
                    aria-label="下载"
                  >
                    <FaDownload size={16} />
                  </button>
                )}
                {onDelete && (
                  <button
                    css={actionButtonStyle("delete")}
                    onClick={() => onDelete(item.id)}
                    aria-label="删除"
                  >
                    <FaTrash size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 样式定义（完全保留你的原有代码）
const containerStyle = (isDarkMode: boolean) => css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  background-color: ${isDarkMode ? "#1a1a1a" : "#f9f9f9"};
  color: ${isDarkMode ? "#fff" : "#333"};
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const headerActionsStyle = css`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const countStyle = (isDarkMode: boolean) => css`
  color: ${isDarkMode ? "#aaa" : "#666"};
  font-size: 0.9rem;
`;

const backButtonStyle = css`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
`;

const cardStyle = (isDarkMode: boolean) => css`
  background: ${isDarkMode ? "#2d2d2d" : "white"};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const previewStyle = css`
  width: 100%;
  height: 150px;
  background-size: cover;
  background-position: center;
`;

const infoStyle = css`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const actionsStyle = css`
  display: flex;
  gap: 0.5rem;
`;

const actionButtonStyle = (type: "download" | "delete") => css`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  color: ${type === "download" ? "#28a745" : "#dc3545"};

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const emptyStyle = (isDarkMode: boolean) => css`
  text-align: center;
  padding: 4rem 0;
  color: ${isDarkMode ? "#aaa" : "#666"};
  font-size: 1.1rem;
`;

export default MyItemsTemplate;
