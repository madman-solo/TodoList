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
      {/* 左侧 - 淡蓝色 */}
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

      {/* 右侧 - 芭比粉 */}
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
  gap: 20px;
  padding: 20px;
  height: 80vh;
`;

const wishBoxLeft = css`
  flex: 1;
  background: #e0f7fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const wishBoxRight = css`
  flex: 1;
  background: #ffe6f2;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const inputSection = css`
  margin-bottom: 20px;
`;

const inputContainer = css`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const inputStyle = css`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const leftButton = css`
  padding: 8px 16px;
  background: #26a69a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const rightButton = css`
  padding: 8px 16px;
  background: #ff69b4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const wishesList = css`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 10px;
`;

const wishItem = css`
  background: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export default WishList;
