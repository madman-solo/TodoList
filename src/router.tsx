import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BackgroundSelector from "./pages/BackgroundSelector.tsx";
import CoupleMode from "./pages/CoupleMode.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register";
import Layout from "./components/Layout";
// 新增情侣模式子页面
import FutureList from "./pages/couple/FutureList.tsx";
import WishList from "./pages/couple/WishList.tsx";
import TableStyle from "./pages/couple/TableStyle.tsx";
import CoupleGames from "./pages/couple/CoupleGames.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "background", element: <BackgroundSelector /> },
      {
        path: "couple",
        element: <CoupleMode />,
        children: [
          // 新增子路由
          { index: true, element: <FutureList /> },
          { path: "table", element: <TableStyle /> },
          { path: "wish", element: <WishList /> },
          { path: "games", element: <CoupleGames /> },
        ],
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
