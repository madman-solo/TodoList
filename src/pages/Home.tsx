import { useTodoStore } from "../store";
import TodoList from "../components/index.tsx";
import Input from "../components/TodoList/Input/index.tsx";
import MoodTracker from "../components/MoodTracker.tsx";
import { useThemeStore } from "../store";
import { useState } from "react";

const Home = () => {
  const { addTodo, todos } = useTodoStore();
  const { isDarkMode } = useThemeStore();
  const [isDragOver, setIsDragOver] = useState(false);

  // 处理拖拽进入待办区域
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  // 处理拖拽离开待办区域
  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // 处理放置心情到待办列表
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const moodEmoji = e.dataTransfer.getData("text/plain");
    if (moodEmoji) {
      addTodo(`${moodEmoji} 今日心情记录`);
    }
  };

  return (
    <div
      className={isDarkMode ? "dark-mode home-page" : "light-mode home-page"}
    >
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

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: isDragOver
              ? "2px dashed #fea93aff"
              : "2px dashed transparent",
            borderRadius: "8px",
            padding: "10px",
            transition: "all 0.3s",
            backgroundColor: isDragOver
              ? "rgba(254, 169, 58, 0.1)"
              : "transparent",
            minHeight: todos.length === 0 ? "200px" : "auto",
            display: "flex",
            alignItems: todos.length === 0 ? "center" : "flex-start",
            justifyContent: todos.length === 0 ? "center" : "flex-start",
          }}
        >
          {todos.length === 0 && isDragOver ? (
            <div
              style={{
                textAlign: "center",
                color: "#fea93aff",
                fontSize: "14px",
              }}
            >
              📌 松开鼠标添加心情到待办清单
            </div>
          ) : (
            <TodoList />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
