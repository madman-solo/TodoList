// import { useTodoStore } from "../store";
// import TodoList from "../components/index.tsx";

// const Home = () => {
//   useTodoStore();

//   return (
//     <div className="home-page">
//       {/* 上部添加区域 */}
//       <div className="todo-upper-section">
//         <h1>夏日待办清单</h1>
//         <TodoList />
//       </div>
//     </div>
//   );
// };

// export default Home;

import { useTodoStore } from "../store";
import TodoList from "../components/index.tsx";
import Input from "../components/TodoList/Input/index.tsx";

const Home = () => {
  const { addTodo } = useTodoStore();

  return (
    <div className="home-page">
      <div className="app-container">
        {/* 左侧固定添加区域 */}
        <div className="add-section">
          <h2>添加夏日待办</h2>
          <Input onAdd={addTodo} />
        </div>

        {/* 右侧待办区域 */}
        <div className="todo-section">
          <h2>夏日待办清单</h2>
          <TodoList />
        </div>
      </div>
    </div>
  );
};

export default Home;
