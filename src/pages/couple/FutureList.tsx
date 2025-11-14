/** @jsxImportSource @emotion/react */
// import { useState, useEffect } from "react";
// import { css } from "@emotion/react";

// const FutureList = () => {
//   const [items, setItems] = useState<string[]>([]);
//   const [newItem, setNewItem] = useState("");
//   const [positions, setPositions] = useState<
//     Record<number, { x: number; y: number }>
//   >({});

//   const handleAddItem = () => {
//     if (newItem.trim()) {
//       const newItems = [...items, newItem.trim()];
//       setItems(newItems);
//       setNewItem("");

//       // 为新添加的项目生成随机位置
//       const lastIndex = newItems.length - 1;
//       setPositions((prev) => ({
//         ...prev,
//         [lastIndex]: {
//           x: Math.random() * 60 + 20, // 20-80% 范围内
//           y: Math.random() * 60 + 20,
//         },
//       }));
//     }
//   };

//   // 初始化位置
//   useEffect(() => {
//     if (items.length && Object.keys(positions).length === 0) {
//       const initialPositions: Record<number, { x: number; y: number }> = {};
//       items.forEach((_, index) => {
//         initialPositions[index] = {
//           x: Math.random() * 60 + 20,
//           y: Math.random() * 60 + 20,
//         };
//       });
//       setPositions(initialPositions);
//     }
//   }, [items]);

//   return (
//     <div css={container}>
//       {/* 中央爱心容器 */}
//       <div css={heartContainer}>
//         {/* 大爱心背景 */}
//         <div css={bigHeart}></div>

//         {/* 添加输入框 */}
//         <div css={inputContainer}>
//           {/* 修正：使用原生 input 而非可能引入的 Input 组件 */}
//           <input
//             type="text"
//             value={newItem}
//             onChange={(e) => setNewItem(e.target.value)}
//             placeholder="添加未来想一起做的事..."
//             css={inputStyle}
//             onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
//           />
//           <button onClick={handleAddItem} css={addButton}>
//             添加
//           </button>
//         </div>
//       </div>

//       {/* 随机分布的小卡片 */}
//       {items.map((item, index) => (
//         <div key={index} css={itemCard(positions[index])}>
//           {item}
//         </div>
//       ))}
//     </div>
//   );
// };

// // 样式定义（保持不变，但确保类型正确）
// const container = css`
//   position: relative;
//   height: 80vh;
//   overflow: hidden;
// `;

// const heartContainer = css`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const bigHeart = css`
//   width: 300px;
//   height: 270px;
//   background: #ffccd5;
//   position: relative;
//   transform: rotate(-45deg);
//   box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);

//   &::before,
//   &::after {
//     content: "";
//     width: 300px;
//     height: 300px;
//     background: #ffccd5;
//     border-radius: 50%;
//     position: absolute;
//   }

//   &::before {
//     top: -150px;
//     left: 0;
//   }

//   &::after {
//     top: 0;
//     left: 150px;
//   }
// `;

// const inputContainer = css`
//   position: relative;
//   z-index: 10;
//   display: flex;
//   gap: 10px;
//   width: 80%;
//   transform: rotate(45deg); /* 抵消父容器的旋转 */
// `;

// const inputStyle = css`
//   flex: 1;
//   padding: 10px;
//   border: none;
//   border-radius: 4px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
// `;

// const addButton = css`
//   padding: 10px 20px;
//   background: #ff4d6d;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   transition: background 0.3s;

//   &:hover {
//     background: #ff758f;
//   }
// `;

// const itemCard = (pos: { x: number; y: number }) => css`
//   position: absolute;
//   top: ${pos.y}%;
//   left: ${pos.x}%;
//   background: white;
//   padding: 10px 15px;
//   border-radius: 8px;
//   box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
//   transform: translate(-50%, -50%) rotate(${Math.random() * 10 - 5}deg);
//   max-width: 200px;
//   animation: popIn 0.5s;

//   @keyframes popIn {
//     0% {
//       transform: translate(-50%, -50%) scale(0);
//     }
//     80% {
//       transform: translate(-50%, -50%) scale(1.1);
//     }
//     100% {
//       transform: translate(-50%, -50%) rotate(${Math.random() * 10 - 5}deg);
//     }
//   }
// `;

// export default FutureList;

// src/pages/couple/FutureList.tsx (修改)
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

// 样式修改 - 重点修改爱心和输入框样式
// const heartContainer = css`
//   position: relative;
//   width: 100%;
//   min-height: 400px; /* 基础高度，会自动扩展 */
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: 2rem 0;
//   padding: 2rem;
// `;

// // 正红色规则爱心样式
// const redHeart = css`
//   position: relative;
//   width: 200px;
//   height: 180px;
//   background-color: #e74c3c; /* 正红色 */
//   transform: rotate(-45deg);
//   box-shadow: 0 0 20px rgba(231, 76, 60, 0.5);
//   z-index: 1;

//   &::before,
//   &::after {
//     content: "";
//     position: absolute;
//     width: 200px;
//     height: 200px;
//     background-color: #e74c3c;
//     border-radius: 50%;
//   }

//   &::before {
//     top: -100px;
//     left: 0;
//   }

//   &::after {
//     top: 0;
//     right: -100px;
//   }

//   /* 响应式爱心大小 */
//   @media (max-width: 768px) {
//     width: 150px;
//     height: 135px;

//     &::before,
//     &::after {
//       width: 150px;
//       height: 150px;
//     }

//     &::before {
//       top: -75px;
//     }

//     &::after {
//       right: -75px;
//     }
//   }
// `;
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
  background-color: #e74c3c; /* 正红色 */
  transform: rotate(-45deg) scale(1);
  box-shadow: 0 0 30px rgba(231, 76, 60, 0.7);
  z-index: 1;
  animation: heartbeat 1.5s infinite ease-in-out; /* 跳动动画 */

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    background-color: #e74c3c;
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
    height: 160px;

    &::before,
    &::after {
      width: 180px;
      height: 180px;
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
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #c0392b;
  }
`;

const itemCard = () => css`
  position: absolute;
  background: white;
  border-radius: 8px;
  padding: 0.8rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  width: 120px;
  min-height: 60px;
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
