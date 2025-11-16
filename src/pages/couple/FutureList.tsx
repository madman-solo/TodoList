/** @jsxImportSource @emotion/react */

import { useState, useEffect } from "react";
import { css } from "@emotion/react";

const FutureList = () => {
  // 从localStorage加载数据，实现持久化
  const [items, setItems] = useState<string[]>(() => {
    const saved = localStorage.getItem("couple_future_items");
    return saved ? JSON.parse(saved) : [];
  });

  const [newItem, setNewItem] = useState("");
  const [positions, setPositions] = useState<
    Record<number, { x: number; y: number }>
  >(() => {
    const saved = localStorage.getItem("couple_future_positions");
    return saved ? JSON.parse(saved) : {};
  });

  // 数据变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem("couple_future_items", JSON.stringify(items));
    localStorage.setItem("couple_future_positions", JSON.stringify(positions));
  }, [items, positions]);

  // 生成不重叠的位置
  const generateUniquePosition = () => {
    const container = document.getElementById("heart-container");
    if (!container) return { x: 50, y: 50 };

    const containerRect = container.getBoundingClientRect();
    const cardSize = 120; // 卡片尺寸
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const candidate = {
        x: Math.random() * (containerRect.width - cardSize) + 20,
        y: Math.random() * (containerRect.height - cardSize) + 20,
      };

      // 检查是否与现有卡片重叠
      const isOverlapping = Object.values(positions).some((pos) => {
        return !(
          candidate.x + cardSize < pos.x ||
          candidate.x > pos.x + cardSize ||
          candidate.y + cardSize < pos.y ||
          candidate.y > pos.y + cardSize
        );
      });

      if (!isOverlapping) {
        return {
          x: (candidate.x / containerRect.width) * 100, // 转换为百分比
          y: (candidate.y / containerRect.height) * 100,
        };
      }

      attempts++;
    }

    // 如果多次尝试仍重叠，则返回一个默认位置（会导致轻微重叠）
    return {
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
    };
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newItems = [...items, newItem.trim()];
      setItems(newItems);
      setNewItem("");

      // 为新添加的项目生成唯一位置
      const lastIndex = newItems.length - 1;
      const newPos = generateUniquePosition();
      setPositions((prev) => ({ ...prev, [lastIndex]: newPos }));

      // 自动扩展容器高度
      expandContainerIfNeeded();
    }
  };

  // 检查并扩展容器高度
  const expandContainerIfNeeded = () => {
    const container = document.getElementById("heart-container");
    if (!container) return;

    // 当项目数量超过12个时开始扩展容器高度
    if (items.length > 12) {
      const extraHeight = Math.ceil((items.length - 12) / 4) * 100;
      container.style.minHeight = `${400 + extraHeight}px`;
    }
  };

  // 初始化位置和容器高度
  useEffect(() => {
    if (items.length && Object.keys(positions).length === 0) {
      const initialPositions: Record<number, { x: number; y: number }> = {};
      items.forEach((_, index) => {
        initialPositions[index] = generateUniquePosition();
      });
      setPositions(initialPositions);
    }
    expandContainerIfNeeded();
  }, [items]);

  return (
    <div css={container}>
      {/* 中央爱心容器 */}
      <div css={heartContainer} id="heart-container">
        {/* 跳动的正红色爱心 */}
        <div css={redHeart}></div>

        {/* 输入框置于爱心尖底 */}
        <div css={inputContainer}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="添加未来想一起做的事..."
            css={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          />
          <button onClick={handleAddItem} css={addButton}>
            添加
          </button>
        </div>
      </div>
      {/* 随机分布的小卡片 */}
      {items.map((item, index) => (
        <div
          key={index}
          css={itemCard}
          style={{
            top: `${positions[index]?.y}%`,
            left: `${positions[index]?.x}%`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

// 样式修改：爱心跳动、形状优化、输入框位置调整
const heartContainer = css`
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* 让内容靠下，为爱心尖底留空间 */
  margin: 2rem 0;
  padding: 2rem;
`;

// 跳动的正红色爱心（通过CSS动画实现）
const redHeart = css`
  position: relative;
  width: 240px;
  height: 240px;
  background-color: #cd1500ff; /* 正红色 */
  transform: rotate(-45deg) scale(1);
  box-shadow: 0 0 30px rgba(244, 88, 71, 0.7);
  z-index: 1;
  animation: heartbeat 1.5s infinite ease-in-out; /* 跳动动画 */

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    background-color: #cd1500ff;
    border-radius: 50%;
  }

  &::before {
    top: -120px;
    left: 0;
  }

  &::after {
    top: 0;
    right: -120px;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
    transform: rotate(-45deg);
    position: relative;
    background-color: #cd1500ff; /* 正红色 */

    &::before,
    &::after {
      content: ""; /* 必须添加，伪元素才会显示 */
      position: absolute; /* 绝对定位 */
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background-color: #cd1500ff; /* 正红色 */
    }

    &::before {
      top: -90px;
    }

    &::after {
      right: -90px;
    }
  }
`;

// 爱心跳动动画
const keyframes = css`
  @keyframes heartbeat {
    0% {
      transform: rotate(-45deg) scale(1);
    }
    14% {
      transform: rotate(-45deg) scale(1.02);
    }
    28% {
      transform: rotate(-45deg) scale(1);
    }
    42% {
      transform: rotate(-45deg) scale(1.04);
    }
    70% {
      transform: rotate(-45deg) scale(1);
    }
  }
`;
// // 斜放的输入框容器
// const inputContainer = css`
//   position: absolute;
//   z-index: 2;
//   transform: rotate(-15deg) translate(120px, 20px); /* 斜放效果 */
//   display: flex;
//   gap: 0.5rem;
//   width: 80%;
//   max-width: 300px;

//   /* 移动端调整角度和位置 */
//   @media (max-width: 768px) {
//     transform: rotate(-10deg) translate(80px, 10px);
//     width: 70%;
//   }
// `;
// 输入框置于爱心尖底
const inputContainer = css`
  ${keyframes} /* 引入动画 */
  position: absolute;
  z-index: 2;
  bottom: 20px; /* 调整距离爱心尖底的位置 */
  left: 50%;
  transform: translateX(-50%) rotate(-5deg); /* 轻微斜放，与爱心风格呼应 */
  display: flex;
  gap: 0.5rem;
  width: 80%;
  max-width: 320px;

  /* 移动端调整 */
  @media (max-width: 768px) {
    width: 70%;
    bottom: 15px;
  }
`;
const inputStyle = css`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
`;

const addButton = css`
  padding: 0 1rem;
  background: #cd1500ff;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #d56154ff;
  }
`;

const itemCard = () => css`
  position: absolute;
  background: #000000ff;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  width: 100px;
  min-height: 30px;
  transform: rotate(${(Math.random() - 0.5) * 10}deg); /* 修复类型不匹配问题 */
  transition: all 0.3s;
  z-index: 2;

  &:hover {
    transform: rotate(${(Math.random() - 0.5) * 10}deg) scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100px;
    padding: 0.6rem;
    font-size: 0.85rem;
  }
`;

const container = css`
  position: relative;
  width: 100%;
  padding: 2rem 1rem;
  min-height: 100vh;
`;

export default FutureList;
