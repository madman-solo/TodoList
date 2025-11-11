import React, { useRef } from "react";

interface InputProps {
  onAdd: (content: string) => void; // 通过 props 接收添加方法
}

const Input = ({ onAdd }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = () => {
    if (inputRef.current?.value.trim()) {
      onAdd(inputRef.current.value.trim()); // 调用父组件传递的 onAdd 方法
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
