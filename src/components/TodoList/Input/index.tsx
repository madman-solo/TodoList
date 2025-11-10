import React from "react";
import type { ITodo } from "../../typings";

interface InputProps {
  addTodo: (todo: ITodo) => void;
  todoList: ITodo[];
}

const Input = ({ addTodo, todoList }: InputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const addItem = (): void => {
    const val: string = inputRef.current!.value.trim();
    if (val.length) {
      const isExist = todoList.find((item) => item.content === val);
      // 报错！！！
      if (isExist) {
        alert("todo item already exists");
        return;
      }
      addTodo({
        id: new Date().getTime(),
        content: val,
        completed: false,
      });
    }
  };
  return (
    <div className="todo-input">
      <input type="text" placeholder="add todo..." ref={inputRef} />
      <button onClick={addItem}>添加</button>
    </div>
  );
};
export default Input;
