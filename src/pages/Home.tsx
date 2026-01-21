import { useTodoStore, useEmojiStore } from "../store";
import TodoList from "../components/index.tsx";
import Input from "../components/TodoList/Input/index.tsx";
import MoodTracker from "../components/MoodTracker.tsx";
import { useThemeStore } from "../store";

const Home = () => {
  const { addTodo } = useTodoStore();
  const { isDarkMode } = useThemeStore();
  const { droppedEmojis, addEmoji, removeEmoji } = useEmojiStore();

  // 处理拖拽放置
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData("text/plain");
    if (emoji) {
      const newEmoji = {
        id: Date.now().toString(),
        emoji,
        x: e.pageX,
        y: e.pageY,
      };
      addEmoji(newEmoji);
    }
  };

  // 允许拖拽
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={isDarkMode ? "dark-mode home-page" : "light-mode home-page"}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ position: "relative", minHeight: "100vh" }}
    >
      {/* 渲染放置的表情包 */}
      {droppedEmojis.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            fontSize: "32px",
            cursor: "pointer",
            zIndex: 1000,
            transform: "translate(-50%, -50%)",
            animation: "emojiDrop 0.5s ease-out",
            userSelect: "none",
          }}
          onClick={() => {
            removeEmoji(item.id);
          }}
        >
          {item.emoji}
        </div>
      ))}

      <div className="home-page">
        {/* 左侧固定添加区域 */}
        <div className="add-section">
          <Input onAdd={addTodo} />
          {/* 新增的心情和小确幸区域 */}
          <MoodTracker />
        </div>

        {/* 右侧待办区域 */}
        <div className="page-header">
          <h6>我的待办清单</h6>
          <p className="header-subtitle">记录每一个重要时刻</p>
        </div>

        <div>
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default Home;
