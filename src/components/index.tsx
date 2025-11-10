import React, { useCallback, useEffect } from "react";
import Input from "./TodoList/Input";
import List from "./TodoList/List.tsx";
import { type ITodo, type IState } from "./typings";
import { todoReducer } from "./reducer.tsx";

const TodoList = () => {
  function init(initTodoList: ITodo[]): IState {
    return {
      todoList: initTodoList,
    };
  }
  const [state, dispatch] = React.useReducer(
    todoReducer,
    JSON.parse(localStorage.getItem("todolist") || "[]"),
    init
  );
  const addTodo = useCallback((todo: ITodo) => {
    dispatch({
      type: "addTodo",
      payload: todo,
    });
  }, []);
  const toggleTodo = useCallback((id: number) => {
    dispatch({
      type: "toggleTodo",
      payload: id,
    });
  }, []);
  const removeTodo = useCallback((id: number): void => {
    dispatch({
      type: "removeTodo",
      payload: id,
    });
  }, []);
  const InputComponent = Input as React.ComponentType<{
    addTodo: (todo: ITodo) => void;
    todoList: ITodo[];
  }>;
  useEffect(() => {
    localStorage.setItem("todolist", JSON.stringify(state.todoList));
  }, [state.todoList]);
  return (
    <div className="todo-container">
      <InputComponent addTodo={addTodo} todoList={state.todoList} />
      <List
        todoList={state.todoList}
        toggleTodo={toggleTodo}
        removeTodo={removeTodo}
      />
    </div>
  );
};
export default TodoList;
