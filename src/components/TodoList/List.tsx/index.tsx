import React from "react";
import type { ITodo } from "../../typings";

import Item from "./Item.tsx";

interface IProps {
  todoList: ITodo[];
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
}
const List = (props: IProps) => {
  const { todoList, toggleTodo, removeTodo } = props;
  return (
    <div className="todo-list">
      {todoList &&
        todoList.map((todo: ITodo) => {
          return (
            <Item
              todo={todo}
              toggleTodo={toggleTodo}
              removeTodo={removeTodo}
              key={todo.id}
            />
          );
        })}
    </div>
  );
};
export default List;
