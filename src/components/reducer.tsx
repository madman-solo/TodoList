import type { IAction, IState, ITodo } from "./typings";
export function todoReducer(state: IState, action: IAction) {
  const { type, payload } = action;
  switch (type) {
    case "addTodo": {
      return {
        ...state,
        todoList: [...state.todoList, payload as ITodo],
      };
    }
    case "toggleTodo": {
      return {
        ...state,
        todoList: state.todoList.map((todo) => {
          return todo.id === payload
            ? {
                ...todo,
                completed: !todo.completed,
              }
            : {
                ...todo,
              };
        }),
      };
    }
    case "removeTodo": {
      return {
        ...state,
        todoList: state.todoList.filter((todo) => todo.id !== payload),
      };
    }
    default: {
      return state;
    }
  }
}
