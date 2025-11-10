export interface ITodo {
  id: number;
  content: string;
  completed: boolean;
}
export interface IState {
  todoList: ITodo[];
}
export interface IAction {
  type: ACTION_TYPE;
  payload: ITodo | number;
}
export type ACTION_TYPE = "addTodo" | "toggleTodo" | "removeTodo";
