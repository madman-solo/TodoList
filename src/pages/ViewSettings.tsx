/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useThemeStore } from "../store";

const ViewSettings = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div css={container(isDarkMode)}>
      <h2 css={pageTitle}>视图设置</h2>

      <div css={settingCard}>
        <h3 css={sectionTitle}>显示设置</h3>

        <div css={settingItem}>
          <span>夜间模式</span>
          <button css={toggleButton} onClick={toggleDarkMode}>
            {isDarkMode ? "关闭" : "开启"}
          </button>
        </div>

        <div css={settingItem}>
          <span>紧凑布局</span>
          <label css={switchLabel}>
            <input type="checkbox" css={switchInput} />
            <span css={switchSlider}></span>
          </label>
        </div>

        <div css={settingItem}>
          <span>显示完成任务</span>
          <label css={switchLabel}>
            <input type="checkbox" css={switchInput} defaultChecked />
            <span css={switchSlider}></span>
          </label>
        </div>
      </div>
    </div>
  );
};

// 样式
const container = (isDarkMode: boolean) => css`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  color: ${isDarkMode ? "#f5f5f5" : "#333"};
`;

const pageTitle = css`
  text-align: center;
  margin-bottom: 2rem;
  font-family: "Playfair Display", serif;
  color: #6c5ce7;
`;

const settingCard = css`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const sectionTitle = css`
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1.2rem;
`;

const settingItem = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const toggleButton = css`
  padding: 0.5rem 1rem;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5a49d1;
  }
`;

const switchLabel = css`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const switchInput = css`
  opacity: 0;
  width: 0;
  height: 0;
`;

const switchSlider = css`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  ${switchInput}:checked + & {
    background-color: #6c5ce7;
  }

  ${switchInput}:checked + &:before {
    transform: translateX(26px);
  }
`;

export default ViewSettings;
