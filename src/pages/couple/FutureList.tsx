/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { css } from "@emotion/react";

const FutureList = () => {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");
  const [positions, setPositions] = useState<
    Record<number, { x: number; y: number }>
  >({});

  const handleAddItem = () => {
    if (newItem.trim()) {
      const newItems = [...items, newItem.trim()];
      setItems(newItems);
      setNewItem("");

      // 为新添加的项目生成随机位置
      const lastIndex = newItems.length - 1;
      setPositions((prev) => ({
        ...prev,
        [lastIndex]: {
          x: Math.random() * 60 + 20, // 20-80% 范围内
          y: Math.random() * 60 + 20,
        },
      }));
    }
  };

  // 初始化位置
  useEffect(() => {
    if (items.length && Object.keys(positions).length === 0) {
      const initialPositions: Record<number, { x: number; y: number }> = {};
      items.forEach((_, index) => {
        initialPositions[index] = {
          x: Math.random() * 60 + 20,
          y: Math.random() * 60 + 20,
        };
      });
      setPositions(initialPositions);
    }
  }, [items]);

  return (
    <div css={container}>
      {/* 中央爱心容器 */}
      <div css={heartContainer}>
        {/* 大爱心背景 */}
        <div css={bigHeart}></div>

        {/* 添加输入框 */}
        <div css={inputContainer}>
          {/* 修正：使用原生 input 而非可能引入的 Input 组件 */}
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
        <div key={index} css={itemCard(positions[index])}>
          {item}
        </div>
      ))}
    </div>
  );
};

// 样式定义（保持不变，但确保类型正确）
const container = css`
  position: relative;
  height: 80vh;
  overflow: hidden;
`;

const heartContainer = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const bigHeart = css`
  width: 300px;
  height: 270px;
  background: #ffccd5;
  position: relative;
  transform: rotate(-45deg);
  box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);

  &::before,
  &::after {
    content: "";
    width: 300px;
    height: 300px;
    background: #ffccd5;
    border-radius: 50%;
    position: absolute;
  }

  &::before {
    top: -150px;
    left: 0;
  }

  &::after {
    top: 0;
    left: 150px;
  }
`;

const inputContainer = css`
  position: relative;
  z-index: 10;
  display: flex;
  gap: 10px;
  width: 80%;
  transform: rotate(45deg); /* 抵消父容器的旋转 */
`;

const inputStyle = css`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const addButton = css`
  padding: 10px 20px;
  background: #ff4d6d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #ff758f;
  }
`;

const itemCard = (pos: { x: number; y: number }) => css`
  position: absolute;
  top: ${pos.y}%;
  left: ${pos.x}%;
  background: white;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  transform: translate(-50%, -50%) rotate(${Math.random() * 10 - 5}deg);
  max-width: 200px;
  animation: popIn 0.5s;

  @keyframes popIn {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    80% {
      transform: translate(-50%, -50%) scale(1.1);
    }
    100% {
      transform: translate(-50%, -50%) rotate(${Math.random() * 10 - 5}deg);
    }
  }
`;

export default FutureList;
