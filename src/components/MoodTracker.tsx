/** @jsxImportSource @emotion/react */
import { useState } from "react";
import {
  FaSmile,
  FaMeh,
  FaFrown,
  FaStar,
  // FaSun,
  // FaHeart,
} from "react-icons/fa";
import { css } from "@emotion/react";

const MoodTracker = () => {
  const [mood, setMood] = useState<"happy" | "neutral" | "sad" | null>(null);
  const [blessings, setBlessings] = useState<string[]>([]);
  const [newBlessing, setNewBlessing] = useState("");

  const handleAddBlessing = () => {
    if (newBlessing.trim()) {
      setBlessings([...blessings, newBlessing.trim()]);
      setNewBlessing("");
    }
  };

  return (
    <div css={containerStyle}>
      <div css={moodSection}>
        <h3>今日心情</h3>
        <div css={moodIcons}>
          <button
            css={moodButton(mood === "happy")}
            onClick={() => setMood("happy")}
          >
            <FaSmile size={24} />
          </button>
          <button
            css={moodButton(mood === "neutral")}
            onClick={() => setMood("neutral")}
          >
            <FaMeh size={24} />
          </button>
          <button
            css={moodButton(mood === "sad")}
            onClick={() => setMood("sad")}
          >
            <FaFrown size={24} />
          </button>
        </div>
      </div>

      <div css={blessingsSection}>
        <h3>小确幸</h3>
        <div css={inputContainer}>
          <input
            type="text"
            value={newBlessing}
            onChange={(e) => setNewBlessing(e.target.value)}
            placeholder="记录今天的小确幸..."
            css={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && handleAddBlessing()}
          />
          <button onClick={handleAddBlessing} css={addButton}>
            添加
          </button>
        </div>
        <div css={blessingsList}>
          {blessings.map((item, index) => (
            <div key={index} css={blessingItem}>
              <FaStar size={16} css={starIcon} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 样式定义
const containerStyle = css`
  padding: 20px;
  gap: 20px;
  display: flex;
  flex-direction: column;
`;

const moodSection = css`
  padding: 15px;
  border-radius: 8px;
  background: #f5f5f5;
`;

const moodIcons = css`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const moodButton = (isActive: boolean) => css`
  background: ${isActive ? "#e0f2fe" : "transparent"};
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }
`;

const blessingsSection = css`
  padding: 15px;
  border-radius: 8px;
  background: #f5f5f5;
`;

const inputContainer = css`
  display: flex;
  gap: 10px;
  margin: 10px 0;
`;

const inputStyle = css`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const addButton = css`
  padding: 8px 16px;
  background: #fea93aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const blessingsList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
`;

const blessingItem = css`
  background: white;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const starIcon = css`
  color: #f59e0b;
`;

export default MoodTracker;
