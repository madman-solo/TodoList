// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Home from "./pages/Home.tsx";
// import BackgroundSelector from "./pages/BackgroundSelector.tsx";
// import CoupleMode from "./pages/CoupleMode.tsx";
// import Login from "./pages/Login.tsx";
// import Register from "./pages/Register";
// import Layout from "./components/Layout";
// // 新增情侣模式子页面
// import FutureList from "./pages/couple/FutureList.tsx";
// import WishList from "./pages/couple/WishList.tsx";
// import TableStyle from "./pages/couple/TableStyle.tsx";
// import CoupleGames from "./pages/couple/CoupleGames.tsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       { index: true, element: <Home /> },
//       { path: "background", element: <BackgroundSelector /> },
//       {
//         path: "couple",
//         element: <CoupleMode />,
//         children: [
//           // 新增子路由
//           { index: true, element: <FutureList /> },
//           { path: "table", element: <TableStyle /> },
//           { path: "wish", element: <WishList /> },
//           { path: "games", element: <CoupleGames /> },
//         ],
//       },
//       { path: "login", element: <Login /> },
//       { path: "register", element: <Register /> },
//     ],
//   },
// ]);

// export default function AppRouter() {
//   return <RouterProvider router={router} />;
// }

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BackgroundSelector from "./pages/BackgroundSelector.tsx";
import CoupleMode from "./pages/CoupleMode.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Profile from "./pages/Profile.tsx"; // 新增我的页面
import ViewSettings from "./pages/ViewSettings.tsx"; // 新增视图页面
// 情侣模式子页面
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
      { path: "view", element: <ViewSettings /> }, // 新增视图路由
      {
        path: "profile", // 新增我的路由
        element: <Profile />,
        children: [
          { path: "login", element: <Login /> }, // 登录作为子路由
          { path: "register", element: <Register /> }, // 注册作为子路由
        ],
      },
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
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
