import { useTodoStore } from "../store";
import TodoList from "../components/index.tsx";

const Home = () => {
  useTodoStore();

  return (
    <div className="home-page">
      <TodoList />
    </div>
  );
};

export default Home;
