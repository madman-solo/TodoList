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
  payload: ITodo | number | ITodo[]; // 新增：支持数组类型（用于排序）;
}
export type ACTION_TYPE =
  | "addTodo"
  | "toggleTodo"
  | "removeTodo"
  | "reorderTodo";
