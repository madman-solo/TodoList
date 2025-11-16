import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BackgroundSelector from "./pages/BackgroundSelector.tsx";
import DailySelection from "./pages/background/DailySelection.tsx"; // 新增
import CommentPage from "./pages/background/CommentPage.tsx"; // 新增
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
import PreferenceSettings from "./pages/outermy/PreferenceSettings.tsx";
import BirthdayPage from "./pages/outermy/BirthdayPage.tsx";
import DiaryPage from "./pages/outermy/DiaryPage.tsx";
import NotificationsPage from "./pages/outermy/NotificationsPage.tsx";
import FocusPage from "./pages/outermy/FocusPage.tsx";
import AnniversaryPage from "./pages/outermy/AnniversaryPage.tsx";
import SchedulePage from "./pages/outermy/SchedulePage.tsx";
import CreateDiaryPage from "./pages/outermy/CreateDiaryPage.tsx";
import BackgroundContent from "./pages/background/BackgroundContent.tsx";
import ThemePage from "./pages/background/ThemePage.tsx";
import FontPage from "./pages/background/FontPage.tsx";
import IconPage from "./pages/background/IconPage.tsx";
import CreateBirthdayPage from "./pages/outermy/CreateBirthdayPage.tsx";
import MemoriesAlbum from "./pages/couple/MemoriesAlbum.tsx";
import CreateMemory from "./pages/couple/CreateMemory.tsx";
import SelectFolder from "./pages/couple/SelectFolder.tsx";

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
          { index: true, element: <BackgroundSelector /> },
          { path: "theme", element: <ThemePage /> },
          { path: "font", element: <FontPage /> },
          { path: "backgrounds", element: <BackgroundContent /> },
          { path: "icon", element: <IconPage /> },
          { path: "my", element: <MyPage /> },
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
          { path: "memories", element: <MemoriesAlbum /> },
          { path: "memories/create", element: <CreateMemory /> },
          { path: "memories/folders", element: <SelectFolder /> },
        ],
      },
      { path: "login", element: <Login /> }, // 登录作为子路由
      { path: "register", element: <Register /> }, // 注册作为子路由
      // todo:我的页面中的登录和注册不能跳转到新页面，需要作为子路由处理，不满足我的需求
      { path: "focus", element: <FocusPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "diary", element: <DiaryPage /> },
      { path: "birthday", element: <BirthdayPage /> },
      { path: "anniversary", element: <AnniversaryPage /> },
      { path: "schedule", element: <SchedulePage /> },
      { path: "settings", element: <PreferenceSettings /> },
      { path: "create", element: <CreateDiaryPage /> },
      {
        path: "profile", // 新增我的路由
        element: <Profile />,
      },
      { path: "diary", element: <DiaryPage /> },
      { path: "birthday", element: <BirthdayPage /> },
      { path: "diary/create", element: <CreateDiaryPage /> },
      { path: "birthday/create", element: <CreateBirthdayPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
