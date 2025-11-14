/** @jsxImportSource @emotion/react */

import { useState } from "react";
import { css } from "@emotion/react";

const WishList = () => {
  // 左侧清单状态
  const [leftInput, setLeftInput] = useState("");
  const [leftWishes, setLeftWishes] = useState<string[]>([]);

  // 右侧清单状态
  const [rightInput, setRightInput] = useState("");
  const [rightWishes, setRightWishes] = useState<string[]>([]);

  const addLeftWish = () => {
    if (leftInput.trim()) {
      setLeftWishes([...leftWishes, leftInput.trim()]);
      setLeftInput("");
    }
  };

  const addRightWish = () => {
    if (rightInput.trim()) {
      setRightWishes([...rightWishes, rightInput.trim()]);
      setRightInput("");
    }
  };

  return (
    <div css={container}>
      {/* 上方 - 我的心愿（淡蓝色） */}
      <div css={wishBoxLeft}>
        <div css={inputSection}>
          <h3>我的心愿</h3>
          <div css={inputContainer}>
            <input
              type="text"
              value={leftInput}
              onChange={(e) => setLeftInput(e.target.value)}
              placeholder="添加心愿..."
              css={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && addLeftWish()}
            />
            <button onClick={addLeftWish} css={leftButton}>
              添加
            </button>
          </div>
        </div>

        <div css={wishesList}>
          {leftWishes.map((wish, index) => (
            <div key={index} css={wishItem}>
              {wish}
            </div>
          ))}
        </div>
      </div>

      {/* 下方 - TA的心愿（芭比粉） */}
      <div css={wishBoxRight}>
        <div css={inputSection}>
          <h3>TA的心愿</h3>
          <div css={inputContainer}>
            <input
              type="text"
              value={rightInput}
              onChange={(e) => setRightInput(e.target.value)}
              placeholder="添加心愿..."
              css={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && addRightWish()}
            />
            <button onClick={addRightWish} css={rightButton}>
              添加
            </button>
          </div>
        </div>

        <div css={wishesList}>
          {rightWishes.map((wish, index) => (
            <div key={index} css={wishItem}>
              {wish}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 样式
const container = css`
  display: flex;
  flex-direction: column; /* 修改为纵向布局 */
  gap: 20px;
  padding: 20px;
  height: calc(100vh - 140px); /* 调整高度适应布局 */
  max-width: 800px; /* 限制最大宽度，提升大屏体验 */
  margin: 0 auto; /* 居中显示 */
`;

const wishBoxLeft = css`
  flex: 1; /* 平均分配高度 */
  background: #e0f7fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* 添加阴影增强层次感 */
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px); /* 悬停效果 */
  }
`;

const wishBoxRight = css`
  flex: 1; /* 平均分配高度 */
  background: #ffe6f2;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const inputSection = css`
  margin-bottom: 20px;
  h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-family: "Playfair Display", serif; /* 使用项目中已有的字体 */
  }
`;

const inputContainer = css`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const inputStyle = css`
  flex: 1;
  padding: 10px 14px; /* 稍微加大内边距提升手感 */
  border: none;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  transition: box-shadow 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(38, 166, 154, 0.3); /* 聚焦效果 */
  }
`;

const leftButton = css`
  padding: 10px 18px;
  background: #26a69a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #229688;
    transform: translateY(-2px);
  }
`;

const rightButton = css`
  padding: 10px 18px;
  background: #ff69b4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #ff52a2;
    transform: translateY(-2px);
  }
`;

const wishesList = css`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 10px;

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

const wishItem = css`
  background: white;
  padding: 14px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    transform: translateX(3px);
  }
`;

export default WishList;
