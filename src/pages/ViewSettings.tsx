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
  min-height: 100vh;
  overflow-x: hidden;
  max-width: 100vw;
  background: linear-gradient(
    135deg,
    #f4c2c2 0%,
    #f7d4d4 15%,
    #fae6e6 30%,
    #fef0f0 45%,
    #fae6e6 60%,
    #f7d4d4 75%,
    #f4c2c2 90%,
    #f0b8b8 100%
  );
  animation: catEyeShimmer 8s ease-in-out infinite;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 192, 203, 0.4) 45%,
      rgba(255, 218, 224, 0.6) 50%,
      rgba(255, 192, 203, 0.4) 55%,
      transparent 100%
    );
    animation: catEyeGloss 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 182, 193, 0.7) 50%,
      transparent 100%
    );
    box-shadow: 0 0 20px rgba(255, 182, 193, 0.7),
      0 0 40px rgba(255, 192, 203, 0.5), 0 0 60px rgba(255, 182, 193, 0.4);
    animation: catEyeLine 8s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes catEyeShimmer {
    0%,
    100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes catEyeGloss {
    0% {
      transform: translateX(-100%);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes catEyeLine {
    0%,
    100% {
      top: 30%;
      opacity: 0.6;
    }
    50% {
      top: 70%;
      opacity: 1;
    }
  }
`;

const pageTitle = css`
  text-align: center;
  margin-bottom: 2rem;
  font-family: "Playfair Display";
  color: #7f72cfff;
`;

const settingCard = css`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
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
