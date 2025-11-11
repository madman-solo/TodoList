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
ItemProps) => {
  const { id, content, completed } = todo;
  const ref = useRef<HTMLDivElement>(null);

  // 长按状态管理
  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 长按检测
  const startPress = () => {
    pressTimer.current = setTimeout(() => {
      setIsLongPress(true);
    }, 500); // 500ms长按触发
  };

  const endPress = () => {
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

  // 合并长按和点击事件
  const combinedListeners = {
    onMouseDown: (e: React.MouseEvent) => {
      startPress();
      listeners?.onMouseDown?.(e);
    },
    onMouseUp: (e: React.MouseEvent) => {
      endPress();
      listeners?.onMouseUp?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      endPress();
      listeners?.onMouseLeave?.(e);
    },
    onTouchStart: (e: React.TouchEvent) => {
      startPress();
      listeners?.onTouchStart?.(e);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      endPress();
      listeners?.onTouchEnd?.(e);
    },
  };

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
      }${isLongPress ? "long-press" : ""}`}
      {...attributes}
      {...attributes}
      {...combinedListeners}
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
