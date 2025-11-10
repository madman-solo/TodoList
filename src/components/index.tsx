import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Input from "./TodoList/Input";
import List from "./TodoList/List.tsx";
// import "../../index.css";

const TodoList = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="todo-container">
        <Input />
        <List />
      </div>
    </DndProvider>
  );
};

export default TodoList;
