import React, { useCallback, useRef } from "react";
import type { ITodo } from "../../typings";
import { useDrop, useDrag } from "react-dnd";

interface IProps {
  todoList: ITodo[];
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  reorderTodos: (fromIndex: number, toIndex: number) => void;
}

const List = (props: IProps) => {
  const { todoList, toggleTodo, removeTodo, reorderTodos } = props;

  // 容器接收拖拽：绑定到列表容器
  const [, drop] = useDrop({
    accept: "TODO_ITEM",
    // 拖拽结束时触发排序
    drop: (
      item: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hoverIndex: any;
        index: number;
      },
      monitor
    ) => {
      const dragIndex = item.index;
      // 获取当前鼠标悬停的目标索引（通过自定义数据传递）
      const hoverIndex = item.hoverIndex;
      if (dragIndex !== hoverIndex && hoverIndex !== undefined) {
        reorderTodos(dragIndex, hoverIndex);
      }
    },
  });

  // 可拖拽的 Todo 项组件（内部组件，处理单个项的拖拽）
  const TodoItem = ({
    todo,
    index,
    toggleTodo,
    removeTodo,
  }: {
    todo: ITodo;
    index: number;
    toggleTodo: (id: number) => void;
    removeTodo: (id: number) => void;
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    // 拖拽源配置：定义当前拖拽项的信息
    const [{ isDragging }, drag] = useDrag({
      type: "TODO_ITEM",
      item: {
        type: "TODO_ITEM",
        id: todo.id,
        index, // 拖拽项的初始索引
        hoverIndex: index, // 用于记录悬停目标的索引
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(), // 拖拽时的视觉反馈
      }),
    });

    // 让当前项同时具备"被拖拽"和"接收拖拽"的能力
    const [, drop] = useDrop({
      accept: "TODO_ITEM",
      // 当其他项拖拽到当前项上方时，更新目标索引
      hover: (item: { index: number; hoverIndex: number }) => {
        // 避免自己拖自己
        if (item.index === index) return;
        // 更新目标索引为当前项的索引
        item.hoverIndex = index;
      },
    });

    // 组合拖拽和接收的 ref
    const combinedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        ref.current = node;
        drag(node);
        drop(node);
      },
      [drag, drop]
    );

    return (
      <div
        ref={combinedRef} // 绑定组合后的 ref
        className="todo-item"
        style={{
          opacity: isDragging ? 0.5 : 1,
          padding: "12px",
          margin: "8px 0", // 避免卡片覆盖
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "white",
          cursor: "grab",
        }}
      >
        <input
          type="checkbox"
          checked={todo.completed}
          className={todo.completed ? "completed" : "active"}
          aria-label="完成待办项"
          onChange={() => toggleTodo(todo.id)}
        />
        <span
          style={{
            textDecoration: todo.completed ? "line-through" : "",
            margin: "0 12px",
          }}
        >
          {todo.content}
        </span>
        <button
          onClick={() => removeTodo(todo.id)}
          style={{ marginLeft: "auto" }}
        >
          删除
        </button>
      </div>
    );
  };
  const containerRef = useRef<HTMLDivElement>(null); // 用于获取 DOM 引用（可选）
  // 回调 ref：先绑定 DOM 引用，再执行 drop 函数
  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node; // 保存 DOM 引用（如果需要）
      drop(node); // 将元素标记为拖拽目标
    },
    [drop]
  );
  return (
    // 绑定容器的 drop ref，确保能接收拖拽事件
    <div className="todo-list" ref={handleRef}>
      {todoList.map((todo: ITodo, index: number) => (
        // 使用带拖拽逻辑的 TodoItem 组件，而非 Item
        <TodoItem
          key={todo.id} // 必须用唯一 key
          todo={todo}
          index={index} // 传递当前项的索引（关键：用于排序）
          toggleTodo={toggleTodo}
          removeTodo={removeTodo}
        />
      ))}
    </div>
  );
};

export default List;
