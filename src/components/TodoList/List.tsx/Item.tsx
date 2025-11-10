// import React from "react";
// import type { ITodo } from "../../typings";

// interface IProps {
//   todo: ITodo;
//   toggleTodo: (id: number) => void;
//   removeTodo: (id: number) => void;
// }

// const Item = (props: IProps) => {
//   const { todo, toggleTodo, removeTodo } = props;
//   const { id, content, completed } = todo;
//   return (
//     <div className="todo-item">
//       <input
//         type="checkbox"
//         className={completed ? "completed" : "active"}
//         aria-label="完成待办项"
//         onChange={() => toggleTodo(id)}
//       />
//       <span style={{ textDecoration: completed ? "line-through" : "" }}>
//         {content}
//       </span>
//       <button onClick={() => removeTodo(id)}>删除</button>
//     </div>
//   );
// };
// export default Item;

import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useTodoStore } from "../../../store";
import type { ITodo } from "../../typings";

interface IProps {
  todo: ITodo;
  index: number;
}

// 拖拽类型定义
type DragItem = {
  index: number;
  id: number;
  type: "TODO_ITEM";
};

const Item = ({ todo, index }: IProps) => {
  const { id, content, completed } = todo;
  const ref = React.useRef<HTMLDivElement>(null);
  const { toggleTodo, removeTodo, reorderTodos } = useTodoStore();

  // 拖拽源配置
  const [, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: "TODO_ITEM",
    item: { index, id, type: "TODO_ITEM" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 放置目标配置
  const [, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "TODO_ITEM",
    hover: (item) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = item.clientOffset;

      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      reorderTodos(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const connectedRef = drag(drop(ref));
  const { isDragging } = useDrag<DragItem, void, { isDragging: boolean }>({
    type: "TODO_ITEM",
    item: { index, id, type: "TODO_ITEM" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={connectedRef}
      className={`todo-item ${isDragging ? "dragging" : ""}`}
    >
      <input
        type="checkbox"
        className={completed ? "completed" : "active"}
        aria-label="完成待办项"
        checked={completed}
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
