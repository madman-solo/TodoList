// import { useTodoStore } from "../../../store";
// import Item from "./Item.tsx";
// import type { ITodo } from "../../typings/index.tsx";

// const List = () => {
//   const { todos } = useTodoStore();

//   if (!todos.length) {
//     return <div className="todo-list-empty">暂无待办项</div>;
//   }

//   return (
//     <div className="todo-list">
//       {todos.map((todo: ITodo, index) => (
//         // 这里传入的index是为了标识每个待办项的位置，以便在拖拽时进行位置交换
//         <Item key={todo.id} todo={todo} index={index} />
//       ))}
//     </div>
//   );
// };

// export default List;

// components/TodoList/List.tsx
import { useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  // useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";
import Item from "./Item"; // 导入 Item 组件
import type { ITodo } from "../../typings/index"; // 导入 ITodo 类型

// 定义 List 接收的 props
interface ListProps {
  todos: ITodo[]; // 待办项列表
  onToggle: (id: number) => void; // 切换完成状态方法
  onRemove: (id: number) => void; // 删除方法
  onUpdate: (id: number, content: string) => void; // 更新内容方法
  onUpdatePosition: (
    activeIndex: number,
    overIndex: number,
    position?: { x: number; y: number }
  ) => void; // 拖拽排序方法
  initialPosition: (id: number, position: { x: number; y: number }) => void; // 初始位置设置
}

const List = ({
  todos,
  onToggle,
  onRemove,
  onUpdate,
  onUpdatePosition,
  initialPosition,
}: ListProps) => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeIndex = active.data.current?.index; // 从拖拽数据中获取 activeIndex
    const overIndex = over.data.current?.index; // 获取 overIndex

    if (activeIndex !== undefined && overIndex !== undefined) {
      // 不再尝试从 over 上访问 DOM 节点，直接传递索引进行位置更新
      onUpdatePosition(activeIndex, overIndex);
    }

    setActiveId(null);
  };

  // 放置区域组件
  const DroppableArea = () => {
    const { setNodeRef } = useDroppable({ id: "todo-container" });

    return (
      <div ref={setNodeRef} className="todo-container">
        {todos.map((todo) => (
          <Item
            index={todo.id}
            todo={todo}
            onToggle={onToggle}
            onRemove={onRemove}
            onUpdate={onUpdate}
            onUpdatePosition={onUpdatePosition}
            initialPosition={initialPosition}
          />
        ))}
      </div>
    );
  };

  // 拖拽覆盖层组件
  const DragOverlayItem = () => {
    if (!activeId) return null;
    const todo = todos.find((t) => t.id === activeId);
    if (!todo) return null;

    return (
      <div
        className={`todo-item drag-overlay ${
          todo.completed ? "completed" : ""
        }`}
      >
        <span>{todo.content}</span>
      </div>
    );
  };

  // 空状态处理
  if (!todos.length) {
    return <div className="todo-list-empty">暂无待办项</div>;
  }

  return (
    <DndContext
      onDragStart={(event) => setActiveId(Number(event.active.id))}
      onDragEnd={handleDragEnd}
    >
      <div className="todo-drag-area">
        <DroppableArea />
      </div>
      <DragOverlay>
        <DragOverlayItem />
      </DragOverlay>
    </DndContext>
  );
};

export default List;
