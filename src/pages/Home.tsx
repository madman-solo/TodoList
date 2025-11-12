import { useTodoStore } from "../store";
import TodoList from "../components/index.tsx";
import Input from "../components/TodoList/Input/index.tsx";
import MoodTracker from "../components/MoodTracker.tsx";
import { useThemeStore } from "../store";
const Home = () => {
  const { addTodo } = useTodoStore();
  const { isDarkMode } = useThemeStore();
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

        <TodoList />
      </div>
    </div>
  );
};

export default Home;
