// // src/pages/couple/CardGenerator.tsx (新增文件)
/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useState, useRef } from "react";
import { FaTrash, FaPalette } from "react-icons/fa";
// 明确声明组件属性类型
interface Card {
  id: string;
  top: number;
  left: number;
  text: string;
}
interface CardGeneratorProps {
  cards: Card[]; // 与 store 中的 Card 类型一致
  setCards: (cards: Card[]) => void; // 与 store 中的 setCards 方法类型一致
  cardColor: string; // 颜色字符串
  setCardColor: (color: string) => void; // 与 store 中的 setCardColor 方法类型一致
}

const CardGenerator = ({
  cards,
  setCards,
  cardColor,
  setCardColor,
}: CardGeneratorProps) => {
  // const [cards, setCards] = useState<
  //   Array<{ id: string; top: number; left: number; text: string }>
  // >([]);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [activeTools, setActiveTools] = useState({
    delete: false,
    color: false,
  });
  // const [cardColor, setCardColor] = useState("#ffccd5");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 生成不重叠的卡片位置
  const generateUniquePosition = (width: number, height: number) => {
    const container = containerRef.current;
    if (!container) return { top: 0, left: 0 };

    const containerRect = container.getBoundingClientRect();
    const maxAttempts = 50;
    let attempts = 0;
    let position: { top: number; left: number } | null = null;

    while (attempts < maxAttempts && !position) {
      const candidate = {
        top: Math.random() * (containerRect.height - height - 40),
        left: Math.random() * (containerRect.width - width - 40),
      };

      // 检查与现有卡片是否重叠
      const isOverlapping = cards.some((card) => {
        const existingLeft = card.left;
        const existingTop = card.top;
        return !(
          candidate.left + width < existingLeft ||
          candidate.left > existingLeft + width ||
          candidate.top + height < existingTop ||
          candidate.top > existingTop + height
        );
      });

      if (!isOverlapping) {
        position = candidate;
      }
      attempts++;
    }

    return (
      position || {
        top: Math.random() * (containerRect.height - height - 40),
        left: Math.random() * (containerRect.width - width - 40),
      }
    );
  };

  // 添加新卡片
  const addCard = () => {
    const cardWidth = 120;
    const cardHeight = 150;
    const position = generateUniquePosition(cardWidth, cardHeight);

    setCards([
      ...cards,
      {
        id: Date.now().toString(),
        ...position,
        text: `卡片 ${cards.length + 1}`,
      },
    ]);

    // 激活工具按钮
    setActiveTools({ delete: true, color: true });
  };

  // 删除卡片
  const deleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
    if (cards.length <= 1) {
      setActiveTools({ delete: false, color: false });
    }
  };

  // 更改所有卡片颜色
  const changeCardColor = (color: string) => {
    setCardColor(color);
    setShowColorPicker(false);
  };

  return (
    <div css={container} ref={containerRef}>
      {/* 控制按钮 */}
      <div css={controls}>
        <button css={addButton} onClick={addCard}>
          添加卡片
        </button>
        <button
          css={toolButton(activeTools.delete, "delete")}
          onClick={() => setShowDeleteButtons(!showDeleteButtons)}
        >
          <FaTrash size={18} />
        </button>
        <button
          css={toolButton(activeTools.color, "color")}
          onClick={() => setShowColorPicker(!showColorPicker)}
        >
          <FaPalette size={18} />
        </button>
      </div>

      {/* 颜色选择器 */}
      {showColorPicker && (
        <div css={colorPicker}>
          {[
            "#ffccd5",
            "#ffd1dc",
            "#c5cae9",
            "#b2ebf2",
            "#c8e6c9",
            "#fff9c4",
          ].map((color) => (
            <div
              key={color}
              css={colorOption}
              style={{ backgroundColor: color }}
              onClick={() => changeCardColor(color)}
            />
          ))}
        </div>
      )}

      {/* 卡片容器 */}
      <div css={cardsContainer}>
        {cards.map((card) => (
          <div
            key={card.id}
            css={cardStyle(cardColor)}
            style={{ top: `${card.top}px`, left: `${card.left}px` }}
          >
            {showDeleteButtons && (
              <button
                css={deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCard(card.id);
                }}
              >
                <FaTrash size={14} />
              </button>
            )}
            <p>{card.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// 样式
const container = css`
  position: relative;
  width: 100%;
  min-height: 400px;
  margin: 2rem 0;
`;

const controls = css`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
  z-index: 10;
  position: relative;
`;

const addButton = css`
  padding: 0.8rem 1.5rem;
  background: #f9e076;
  color: #2d0e47;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: var(--transition);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(249, 224, 118, 0.3);
  }
`;

const toolButton = (isActive: boolean, type: string) => css`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: ${isActive
    ? type === "delete"
      ? "#e74c3c"
      : "#3498db"
    : "rgba(255, 255, 255, 0.1)"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
  }
`;

const colorPicker = css`
  position: absolute;
  top: 60px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 20;
`;

const colorOption = css`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const cardsContainer = css`
  position: relative;
  width: 100%;
  min-height: 400px;
  overflow: hidden;
`;

const cardStyle = (bgColor: string) => css`
  position: absolute;
  width: 120px;
  height: 150px;
  background: ${bgColor};
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transform-origin: center;
  transition: all 0.3s;
  cursor: move;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: #2d0e47;

  &:hover {
    transform: scale(1.05) rotate(1deg);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const deleteButton = css`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

export default CardGenerator;
