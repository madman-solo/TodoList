import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BackgroundSelector from "./pages/BackgroundSelector.tsx";
import DailySelection from "./pages/DailySelection.tsx"; // 新增
import CommentPage from "./pages/CommentPage.tsx"; // 新增
import MyPage from "./pages/MyPage.tsx"; // 新增
import CoupleMode from "./pages/CoupleMode.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import FutureList from "./pages/couple/FutureList.tsx";
import WishList from "./pages/couple/WishList.tsx";
import TableStyle from "./pages/couple/TableStyle.tsx";
import CoupleGames from "./pages/couple/CoupleGames.tsx";
import Profile from "./pages/Profile.tsx";
import ViewSettings from "./pages/ViewSettings.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "view", element: <ViewSettings /> }, // 新增视图路由
      {
        path: "background",
        element: <BackgroundSelector />,
        children: [
          { index: true, element: <div>推荐内容</div> }, // 默认显示推荐
          { path: "theme", element: <div>主题内容</div> },
          { path: "font", element: <div>字体内容</div> },
          { path: "backgrounds", element: <div>背景内容</div> },
          { path: "icon", element: <div>图标内容</div> },
          { path: "my", element: <MyPage /> }, // 我的页面
        ],
      },
      { path: "daily", element: <DailySelection /> }, // 每日精选
      { path: "daily/comments", element: <CommentPage /> }, // 评论页面
      {
        path: "couple",
        element: <CoupleMode />,
        children: [
          { index: true, element: <FutureList /> },
          { path: "table", element: <TableStyle /> },
          { path: "wish", element: <WishList /> },
          { path: "games", element: <CoupleGames /> },
        ],
      },
      {
        path: "profile", // 新增我的路由
        element: <Profile />,
        children: [
          { path: "login", element: <Login /> }, // 登录作为子路由
          { path: "register", element: <Register /> }, // 注册作为子路由
        ],
      },
      { path: "login", element: <Login /> }, //todo:为什么路由可以重复引用？
      { path: "register", element: <Register /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
