/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { css } from "@emotion/react";

// 默认本地表情包
const DEFAULT_LOCAL_EMOJIS = ["😊", "😂", "😍", "😎", "🥰", "😭"];

const MoodTracker = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [blessings, setBlessings] = useState<string[]>([]);
  const [newBlessing, setNewBlessing] = useState("");
  const [emojiSource, setEmojiSource] = useState<"local" | "api">("local");
  const [emojis, setEmojis] = useState<string[]>(DEFAULT_LOCAL_EMOJIS);
  const [isLoadingEmojis, setIsLoadingEmojis] = useState(false);

  // 从在线API获取表情包
  const fetchOnlineEmojis = async () => {
    setIsLoadingEmojis(true);
    try {
      // 使用emoji-api.com的免费API
      const response = await fetch(
        "https://emoji-api.com/emojis?access_key=demo_key"
      );
      const data = await response.json();

      // 随机选择6个表情
      const randomEmojis = data
        .sort(() => Math.random() - 0.5)
        .slice(0, 6)
        .map((emoji: { character: string }) => emoji.character);

      setEmojis(randomEmojis);
    } catch (error) {
      console.error("获取在线表情包失败:", error);
      // 失败时使用备用表情
      setEmojis(["🌟", "🎉", "💖", "🌈", "✨", "🎈"]);
    } finally {
      setIsLoadingEmojis(false);
    }
  };

  // 切换表情包来源
  const handleSourceChange = (source: "local" | "api") => {
    setEmojiSource(source);
    if (source === "api") {
      fetchOnlineEmojis();
    } else {
      setEmojis(DEFAULT_LOCAL_EMOJIS);
    }
  };

  // 选择表情
  const handleEmojiSelect = (emoji: string) => {
    setMood(emoji);
  };

  // 处理表情拖拽开始
  const handleEmojiDragStart = (e: React.DragEvent, emoji: string) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", emoji);
  };

  const handleAddBlessing = () => {
    if (newBlessing.trim()) {
      setBlessings([...blessings, newBlessing.trim()]);
      setNewBlessing("");
    }
  };

  return (
    <div css={containerStyle}>
      <div css={moodSection}>
        <div css={moodHeaderStyle}>
          <h3>今日心情</h3>
          <div css={sourceToggleStyle}>
            <button
              css={sourceButton(emojiSource === "local")}
              onClick={() => handleSourceChange("local")}
            >
              本地表情
            </button>
            <button
              css={sourceButton(emojiSource === "api")}
              onClick={() => handleSourceChange("api")}
            >
              在线表情
            </button>
          </div>
        </div>

        {isLoadingEmojis ? (
          <div css={loadingStyle}>加载中...</div>
        ) : (
          <div css={emojiGridStyle}>
            {emojis.map((emoji, index) => (
              <button
                key={index}
                css={emojiButton(mood === emoji)}
                onClick={() => handleEmojiSelect(emoji)}
                draggable={true}
                onDragStart={(e) => handleEmojiDragStart(e, emoji)}
                style={{ cursor: "grab" }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {mood && (
          <div css={selectedMoodStyle}>
            <span>当前心情：</span>
            <span css={selectedEmojiStyle}>{mood}</span>
          </div>
        )}
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
  padding: 15px;
  gap: 15px;
  display: flex;
  flex-direction: column;
`;

const moodSection = css`
  padding: 10px;
  border-radius: 8px;
  background: #f5f5f5;
`;

const moodHeaderStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  h3 {
    font-size: 14px;
    margin: 0;
  }
`;

const sourceToggleStyle = css`
  display: flex;
  gap: 8px;
  background: white;
  padding: 4px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const sourceButton = (isActive: boolean) => css`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: ${isActive ? "#fea93aff" : "transparent"};
  color: ${isActive ? "white" : "#666"};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;

  &:hover {
    background: ${isActive ? "#fea93aff" : "#f0f0f0"};
  }
`;

const emojiGridStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
`;

const emojiButton = (isActive: boolean) => css`
  background: ${isActive ? "#fef3c7" : "white"};
  border: 2px solid ${isActive ? "#fea93aff" : "#e5e7eb"};
  border-radius: 6px;
  width: 40px;
  height: 40px;
  aspect-ratio: 1;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${isActive
    ? "0 3px 5px rgba(254, 169, 58, 0.3)"
    : "0 1px 2px rgba(0, 0, 0, 0.1)"};
  transform: ${isActive ? "scale(1.05)" : "scale(1)"};

  &:hover {
    transform: scale(1.08);
    border-color: #fea93aff;
    box-shadow: 0 3px 5px rgba(254, 169, 58, 0.2);
  }
`;

const loadingStyle = css`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const selectedMoodStyle = css`
  margin-top: 8px;
  padding: 6px 10px;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
`;

const selectedEmojiStyle = css`
  font-size: 14px;
`;

const blessingsSection = css`
  padding: 12px;
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
