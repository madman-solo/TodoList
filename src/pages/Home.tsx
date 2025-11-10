// src/pages/Home.tsx
import { useRef, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTodoStore } from "../store";

const Home = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const { todos, addTodo, removeTodo, updateTodo, toggleTodo, updatePosition } =
    useTodoStore();

  const handleAddTodo = () => {
    if (inputRef.current?.value.trim()) {
      addTodo(inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      updatePosition(Number(active.id), {
        x: over.rect.left - over.rect.width / 2,
        y: over.rect.top - over.rect.height / 2,
      });
    }

    setActiveId(null);
  };

  interface TodoItemProps {
    id: number;
    content: string;
    completed: boolean;
    position: { x: number; y: number };
  }

  const TodoItem = ({ id, content, completed, position }: TodoItemProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: id.toString(),
      data: { type: "todo", id },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      position: "absolute" as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`todo-item ${completed ? "completed" : ""}`}
        {...attributes}
      >
        <input
          type="checkbox"
          checked={completed}
          onChange={() => toggleTodo(id)}
        />
        {isEditing ? (
          <>
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
            />
            <button
              onClick={() => {
                updateTodo(id, editContent);
                setIsEditing(false);
              }}
            >
              确定
            </button>
          </>
        ) : (
          <span>{content}</span>
        )}
        <button onClick={() => removeTodo(id)} className="delete-btn">
          ×
        </button>
        <button onClick={() => setIsEditing(true)} className="edit-btn">
          ✎
        </button>
        <div {...listeners} className="drag-handle">
          ☰
        </div>
      </div>
    );
  };

  const DroppableArea = () => {
    const { setNodeRef } = useDroppable({
      id: "todo-container",
    });

    return (
      <div ref={setNodeRef} className="todo-container">
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} />
        ))}
      </div>
    );
  };

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

  return (
    <div className="home-page">
      <div className="todo-input-section">
        <input
          ref={inputRef}
          type="text"
          placeholder="添加新事项..."
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
        />
        <button onClick={handleAddTodo}>添加</button>
      </div>

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
    </div>
  );
};

export default Home;
