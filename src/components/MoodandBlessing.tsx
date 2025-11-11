// src/components/MoodAndBlessing.tsx
import { useState, useRef, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

// 夏日主题莫兰迪色系
const colors = {
  primary: "#E9B872", // 暖黄
  secondary: "#B9D9EB", // 浅蓝
  accent: "#C38D9E", // 淡粉
  light: "#F8F1E9", // 米白
  dark: "#41463D", // 深棕
};

// 表情符号列表
const moodEmojis = [
  "☀️",
  "😊",
  "😍",
  "🥰",
  "😎",
  "🥳",
  "🤩",
  "😌",
  "😉",
  "🙂",
  "🙃",
  "😋",
  "😘",
  "🥲",
  "😢",
  "😤",
  "😡",
  "🤯",
  "🥱",
  "😴",
  "🤗",
  "🤔",
  "🫠",
  "🥵",
];

const MoodAndBlessing = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState("");
  const moodRef = useRef<HTMLDivElement>(null);

  // 监听滚动判断展开状态
  useEffect(() => {
    const handleScroll = () => {
      if (moodRef.current) {
        const scrollTop = moodRef.current.scrollTop;
        setIsExpanded(scrollTop > 20);
      }
    };

    const moodElement = moodRef.current;
    if (moodElement) {
      moodElement.addEventListener("scroll", handleScroll);
      return () => moodElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // 复制成功处理
  const handleCopy = (emoji: string) => {
    setCopied(emoji);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div
      className="summer-box"
      style={{
        background: colors.light,
        borderRadius: "12px",
        padding: "20px",
        margin: "20px 0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: `1px solid ${colors.primary}30`,
      }}
    >
      <div
        className="mood-section"
        style={{
          width: "50%",
          float: "left",
          paddingRight: "15px",
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            color: colors.dark,
            borderBottom: `2px solid ${colors.primary}`,
            paddingBottom: "8px",
            marginBottom: "15px",
          }}
        >
          今日心情
        </h3>

        <div
          ref={moodRef}
          className="mood-emojis"
          style={{
            height: isExpanded ? "200px" : "120px",
            overflow: "hidden",
            position: "relative",
            transition: "height 0.3s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              padding: "10px",
              background: `${colors.light}`,
            }}
          >
            {moodEmojis.map((emoji, index) => (
              <CopyToClipboard
                key={index}
                text={emoji}
                onCopy={() => handleCopy(emoji)}
              >
                <span
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                    backgroundColor:
                      copied === emoji ? `${colors.primary}20` : "transparent",
                    transform: copied === emoji ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {emoji}
                </span>
              </CopyToClipboard>
            ))}
          </div>

          {/* 箭头指示器 */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              position: "absolute",
              bottom: "5px",
              left: "50%",
              transform: `translateX(-50%) rotate(${
                isExpanded ? "180deg" : "0"
              })`,
              background: "none",
              border: "none",
              fontSize: "20px",
              color: colors.accent,
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
          >
            ▲
          </button>
        </div>
      </div>

      <div
        className="blessing-section"
        style={{
          width: "50%",
          float: "right",
          paddingLeft: "15px",
          boxSizing: "border-box",
        }}
      >
        <h3
          style={{
            color: colors.dark,
            borderBottom: `2px solid ${colors.accent}`,
            paddingBottom: "8px",
            marginBottom: "15px",
          }}
        >
          每日小确幸
        </h3>

        <div
          style={{
            minHeight: "120px",
            background: `${colors.secondary}20`,
            borderRadius: "8px",
            padding: "15px",
            color: colors.dark,
            fontSize: "15px",
            lineHeight: 1.6,
          }}
        >
          <p>记录今天发生的美好小事吧~</p>
          <textarea
            style={{
              width: "100%",
              height: "80px",
              marginTop: "10px",
              padding: "10px",
              borderRadius: "6px",
              border: `1px solid ${colors.secondary}`,
              background: "rgba(255,255,255,0.7)",
              resize: "none",
              fontFamily: "inherit",
              color: colors.dark,
            }}
            placeholder="比如：今天吃到了超甜的西瓜~"
          />
          <button
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              background: colors.accent,
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            保存
          </button>
        </div>
      </div>

      <div style={{ clear: "both" }}></div>
    </div>
  );
};

export default MoodAndBlessing;
