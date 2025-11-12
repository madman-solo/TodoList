export interface ITodo {
  id: number;
  content: string;
  completed: boolean;
  position: { x: number; y: number } | null;
}
