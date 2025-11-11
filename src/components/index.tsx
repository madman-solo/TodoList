import { useTodoStore } from "../store";
import Input from "./TodoList/Input"; // 导入 Input 组件
import List from "./TodoList/List.tsx/index.tsx"; // 导入 List 组件
import type { ITodo } from "../components/typings/index"; // 导入 ITodo 类型
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const TodoList = () => {
  // 从 store 获取所有需要的数据和方法
  const { todos, addTodo, toggleTodo, removeTodo, updateTodo, updatePosition } =
    useTodoStore();
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="todo-container">
        <Input onAdd={addTodo} /> {/* 假设 addTodo 是 store 中的添加方法 */}
        <List
          todos={todos as ITodo[]}
          onToggle={toggleTodo}
          onRemove={removeTodo}
          onUpdate={updateTodo}
          onUpdatePosition={updatePosition}
        />
      </div>
    </DndProvider>
  );
};

export default TodoList;
