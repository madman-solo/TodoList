import { useTodoStore } from "../store";
import TodoList from "../components/index.tsx";

const Home = () => {
  useTodoStore();

  return (
    <div className="home-page">
      {/* 上部添加区域 */}
      <div className="todo-upper-section">
        <h1>夏日待办清单</h1>
        <TodoList />
      </div>
    </div>
  );
};

export default Home;
