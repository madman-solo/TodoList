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
import ProtectedRoute from "./components/ProtectedRoute";
import CoupleRouteGuard from "./components/CoupleRouteGuard";
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
import MyThemes from "./pages/intermy/MyThemes.tsx";
import MyFonts from "./pages/intermy/MyFonts.tsx";
import MyLikes from "./pages/intermy/MyLikes.tsx";
import MyBackgrounds from "./pages/intermy/MyBackgrounds.tsx";
import MyCollections from "./pages/intermy/MyCollections.tsx";
import { BackgroundProvider } from "./components/BacgroundContext.tsx";

const router = createBrowserRouter([
  // 公开路由（不需要登录）
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  // 受保护的路由（需要登录）
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
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
          { path: "my/themes", element: <MyThemes /> },
          { path: "my/fonts", element: <MyFonts /> },
          { path: "my/likes", element: <MyLikes /> },
          { path: "my/backgrounds", element: <MyBackgrounds /> },
          { path: "my/collections", element: <MyCollections /> },
        ],
      },
      { path: "daily", element: <DailySelection /> }, // 每日精选
      { path: "daily/comments", element: <CommentPage /> }, // 评论页面
      {
        path: "couple",
        element: (
          <CoupleRouteGuard>
            <CoupleMode />
          </CoupleRouteGuard>
        ),
        children: [
          { index: true, element: <FutureList /> },
          { path: "table", element: <TableStyle /> },
          { path: "games", element: <CoupleGames /> },
        ],
      },
      {
        path: "wish",
        element: (
          <CoupleRouteGuard>
            <WishList />
          </CoupleRouteGuard>
        ),
      },
      {
        path: "memories",
        element: (
          <CoupleRouteGuard>
            <MemoriesAlbum />
          </CoupleRouteGuard>
        ),
      },
      { path: "memories/create", element: <CreateMemory /> },
      { path: "memories/folders", element: <SelectFolder /> },
      { path: "focus", element: <FocusPage /> },
      { path: "notifications", element: <NotificationsPage /> },
      { path: "diary", element: <DiaryPage /> },
      { path: "diary/create", element: <CreateDiaryPage /> },
      { path: "birthday", element: <BirthdayPage /> },
      { path: "birthday/create", element: <CreateBirthdayPage /> },
      { path: "anniversary", element: <AnniversaryPage /> },
      { path: "schedule", element: <SchedulePage /> },
      { path: "settings", element: <PreferenceSettings /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    // {/* 全局提供背景数据 */}

    <BackgroundProvider>
      <RouterProvider router={router} />
    </BackgroundProvider>
  );
}
