// // import React, { useEffect, type RefObject } from "react";
// // import {
// //   useDrag,
// //   useDrop,
// //   type DragSourceMonitor,
// //   type DropTargetMonitor,
// // } from "react-dnd";
// // import { useTodoStore } from "../../../store";
// // import type { ITodo } from "../../typings";

// // interface IProps {
// //   todo: ITodo; // // 明确接收的 todo 是 ITodo 类型
// //   index: number;
// // }

// // // 拖拽类型定义
// // type DragItem = {
// //   index: number;
// //   id: number;
// //   type: "TODO_ITEM"; //todo:1个问题
// //   clientOffset: { x: number; y: number } | null;
// // };

// // const Item = ({ todo, index }: IProps) => {
// //   const { id, content, completed } = todo;
// //   const ref = React.useRef<HTMLDivElement>(null);
// //   const { toggleTodo, removeTodo, updatePosition, initalPosition } =
// //     useTodoStore();

// //   // 组件挂载后，计算并更新初始位置
// //   useEffect(() => {
// //     if (ref.current && todo.position === null) {
// //       const rect = ref.current.getBoundingClientRect();
// //       // 调用 store 方法更新 position
// //       initalPosition(todo.id, { x: rect.left, y: rect.top });
// //     }
// //   }, [todo.id, updatePosition, todo.position, initalPosition]);

// //   // 拖拽源配置：将当前项的 index 传递给 react-dnd，标识“被拖拽项的位置”
// //   const [{ isDragging }, drag] = useDrag<
// //     DragItem,
// //     void,
// //     { isDragging: boolean }
// //   >({
// //     type: "TODO_ITEM",
// //     item: { index, id, type: "TODO_ITEM", clientOffset: { x: 0, y: 0 } },
// //     collect: (monitor: DragSourceMonitor) => ({
// //       isDragging: monitor.isDragging(),
// //     }),
// //   });

// //   // 放置目标配置
// //   const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
// //     accept: "TODO_ITEM",
// //     hover: (item: DragItem) => {
// //       if (!ref.current) return;

// //       const dragIndex = item.index; //被拖拽项的原始index
// //       const hoverIndex = index; //当前项的位置（目标位置）

// //       if (dragIndex === hoverIndex) return;

// //       const hoverBoundingRect = ref.current.getBoundingClientRect(); //获取目标项的边界位置
// //       // const hoverMiddleY =
// //       //   (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; //目标项的中点Y坐标
// //       // const hoverMiddleX =
// //       //   (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

// //       // // 获取鼠标相对于目标项的位置
// //       // const clientOffset = item.clientOffset;
// //       // if (!clientOffset) return;
// //       // const hoverClientX = clientOffset.x - hoverBoundingRect.left;
// //       // const hoverClientY = clientOffset.y - hoverBoundingRect.top;

// //       // 调用 updatePosition 时，可同时更新 position 的真实坐标
// //       updatePosition(hoverIndex, dragIndex, {
// //         x: hoverBoundingRect.left,
// //         y: hoverBoundingRect.top,
// //       });
// //       item.index = hoverIndex;
// //     },
// //     collect: (monitor: DropTargetMonitor) => ({
// //       isOver: monitor.isOver(),
// //     }),
// //   });
// //   // 合并 drag 和 drop 到 ref 上，并做类型断言
// //   const connectedRef = React.useMemo(() => {
// //     // attach both drop and drag to the same ref
// //     drop(ref);
// //     drag(ref);
// //     return ref as RefObject<HTMLDivElement>;
// //   }, [drag, drop, ref]);

// //   return (
// //     <div
// //       ref={connectedRef}
// //       className={`todo-item ${isDragging ? "dragging" : ""}`}
// //     >
// //       <input
// //         type="checkbox"
// //         className={completed ? "completed" : "active"}
// //         aria-label="完成待办项"
// //         checked={completed}
// //         onChange={() => toggleTodo(id)}
// //       />
// //       <span style={{ textDecoration: completed ? "line-through" : "" }}>
// //         {content}
// //       </span>
// //       <button onClick={() => removeTodo(id)}>删除</button>
// //     </div>
// //   );
// // };

// // export default Item;

// // components/TodoList/Item.tsx
// import { useState, useEffect, useRef } from "react";
// import { useDraggable } from "@dnd-kit/core"; // 统一使用 @dnd-kit
// import { CSS } from "@dnd-kit/utilities";
// import type { ITodo } from "../../typings"; // 使用你的 ITodo 类型

// // 定义接收的 props（包含必要的回调方法）
// interface ItemProps {
//   todo: ITodo;
//   index: number; // 保留 index 用于拖拽排序
//   onToggle: (id: number) => void; // 切换完成状态
//   onRemove: (id: number) => void; // 删除
//   onUpdate: (id: number, content: string) => void; // 编辑更新
//   onUpdatePosition: (
//     dragIndex: number,
//     hoverIndex: number,
//     position: { x: number; y: number }
//   ) => void; // 拖拽排序回调
//   initialPosition: (id: number, position: { x: number; y: number }) => void; // 初始位置设置
// }

// const Item = ({
//   todo,
//   index,
//   onToggle,
//   onRemove,
//   onUpdate,
//   // onUpdatePosition,
//   initialPosition,
// }: ItemProps) => {
//   const { id, content, completed, position } = todo;
//   const ref = useRef<HTMLDivElement>(null); // 用于获取 DOM 位置

//   // 1. 初始位置计算（保留你的逻辑）
//   useEffect(() => {
//     if (ref.current && position === null) {
//       const rect = ref.current.getBoundingClientRect();
//       initialPosition(id, { x: rect.left, y: rect.top }); // 调用父组件传入的初始位置方法
//     }
//   }, [id, position, initialPosition]);

//   // 2. @dnd-kit 拖拽配置（替代 react-dnd 的 useDrag/useDrop）
//   const {
//     attributes,
//     listeners,
//     setNodeRef, // 绑定 DOM 节点，用于拖拽追踪
//     transform, // 拖拽时的位置变换数据
//     isDragging, // 是否正在拖拽（@dnd-kit 内置状态）
//   } = useDraggable({
//     id: id.toString(), // 唯一标识（与拖拽上下文关联）
//     data: {
//       type: "TODO_ITEM", // 拖拽类型（与 List 中的 DndContext 匹配）
//       index, // 传递当前项索引，用于排序
//       id, // 传递当前项 ID
//     },
//   });

//   // 3. 编辑状态（从 @dnd-kit 版本继承）
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(content);

//   // 4. 拖拽时的样式（结合位置和变换）
//   const style = {
//     transform: CSS.Transform.toString(transform), // 拖拽时的实时位置变换
//     position: "absolute" as const,
//     left: position ? `${position.x}px` : "0", // 初始位置（从 todo.position 获取）
//     top: position ? `${position.y}px` : "0",
//   };

//   return (
//     <div
//       ref={(node) => {
//         setNodeRef(node); // 绑定 @dnd-kit 的节点引用
//         if (node) ref.current = node; // 同时绑定自定义 ref 用于位置计算
//       }}
//       style={style}
//       className={`todo-item ${completed ? "completed" : ""} ${
//         isDragging ? "dragging" : ""
//       }`}
//       {...attributes} // 绑定拖拽相关属性（如 data-dnd-id）
//     >
//       {/* 复选框（状态切换） */}
//       <input
//         type="checkbox"
//         checked={completed}
//         onChange={() => onToggle(id)}
//         className={completed ? "completed" : "active"}
//         aria-label="完成待办项"
//       />

//       {/* 内容显示/编辑 */}
//       {isEditing ? (
//         <>
//           <input
//             type="text"
//             value={editContent}
//             onChange={(e) => setEditContent(e.target.value)}
//             autoFocus
//           />
//           <button
//             onClick={() => {
//               onUpdate(id, editContent);
//               setIsEditing(false);
//             }}
//           >
//             确定
//           </button>
//         </>
//       ) : (
//         <span style={{ textDecoration: completed ? "line-through" : "" }}>
//           {content}
//         </span>
//       )}

//       {/* 删除按钮 */}
//       <button onClick={() => onRemove(id)}>删除</button>

//       {/* 编辑按钮 */}
//       <button onClick={() => setIsEditing(true)} className="edit-btn">
//         ✎
//       </button>

//       {/* 拖拽手柄（绑定拖拽事件） */}
//       <div {...listeners} className="drag-handle">
//         ☰
//       </div>
//     </div>
//   );
// };

// export default Item;

import { useState, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { ITodo } from "../../typings";

interface ItemProps {
  todo: ITodo;
  index: number;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
  onUpdatePosition: (dragIndex: number, hoverIndex: number) => void;
  initialPosition: (id: number, position: { x: number; y: number }) => void;
}

const Item = ({
  todo,
  index,
  onToggle,
  onRemove,
  onUpdate,
}: // onUpdatePosition,
// initialPosition,
ItemProps) => {
  const { id, content, completed } = todo;
  const ref = useRef<HTMLDivElement>(null);

  // 长按状态管理
  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 长按处理
  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
    }, 500); // 500ms后触发长按状态
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    setIsLongPress(false);
  };

  // 拖拽配置
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id.toString(),
      data: {
        type: "TODO_ITEM",
        index,
        id,
      },
      disabled: !isLongPress, // 只有长按后才能拖拽
    });

  // 编辑状态管理
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  // 拖拽样式
  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        if (node) ref.current = node;
      }}
      style={style}
      className={`todo-item ${completed ? "completed" : ""} ${
        isDragging ? "dragging" : ""
      }`}
      {...attributes}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className={completed ? "completed" : "active"}
        aria-label="完成待办项"
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            autoFocus
            onBlur={() => {
              onUpdate(id, editContent);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onUpdate(id, editContent);
                setIsEditing(false);
              }
            }}
          />
        </>
      ) : (
        <span style={{ textDecoration: completed ? "line-through" : "" }}>
          {content}
        </span>
      )}

      <button onClick={() => onRemove(id)}>删除</button>
      <button
        onClick={() => setIsEditing(true)}
        className="edit-btn"
        aria-label="编辑"
      >
        ✎
      </button>

      <div {...listeners} className="drag-handle" aria-label="拖拽">
        ☰
      </div>
    </div>
  );
};

export default Item;
