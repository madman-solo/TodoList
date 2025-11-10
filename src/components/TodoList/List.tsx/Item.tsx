import React from "react";
import type { ITodo } from "../../typings";

interface IProps {
  todo: ITodo;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}

const Item = (props: IProps) => {
  const { todo, toggleTodo, removeTodo } = props;
  const { id, content, completed } = todo;
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        className={completed ? "completed" : "active"}
        aria-label="完成待办项"
        onChange={() => toggleTodo(id)}
      />
      <span style={{ textDecoration: completed ? "line-through" : "" }}>
        {content}
      </span>
      <button onClick={() => removeTodo(id)}>删除</button>
    </div>
  );
};
export default Item;
