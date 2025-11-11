export interface ITodo {
  id: number;
  content: string;
  completed: boolean;
  position: { x: number; y: number } | null;
}
export interface IState {
  todoList: ITodo[]; //相当于状态里的todos?
}
