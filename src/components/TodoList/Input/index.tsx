// import React from "react";
// import type { ITodo } from "../../typings";

// interface InputProps {
//   addTodo: (todo: ITodo) => void;
//   todoList: ITodo[];
// }

// const Input = ({ addTodo, todoList }: InputProps) => {
//   const inputRef = React.useRef<HTMLInputElement>(null);
//   const addItem = (): void => {
//     const val: string = inputRef.current!.value.trim();
//     if (val.length) {
//       const isExist = todoList.find((item) => item.content === val);
//       // 报错！！！
//       if (isExist) {
//         alert("todo item already exists");
//         return;
//       }
//       addTodo({
//         id: new Date().getTime(),
//         content: val,
//         completed: false,
//       });
//     }
//   };
//   return (
//     <div className="todo-input">
//       <input type="text" placeholder="add todo..." ref={inputRef} />
//       <button onClick={addItem}>添加</button>
//     </div>
//   );
// };
// export default Input;

import React, { useRef } from "react";
import { useTodoStore } from "../../../store";

const Input = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTodo } = useTodoStore();

  const handleAddTodo = () => {
    if (inputRef.current?.value.trim()) {
      addTodo(inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  };

  return (
    <div className="todo-input">
      <input
        ref={inputRef}
        type="text"
        placeholder="添加新待办..."
        onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
      />
      <button onClick={handleAddTodo}>添加</button>
    </div>
  );
};

export default Input;
