// // src/components/Layout.tsx
// import { Outlet, Link } from "react-router-dom";
// import { useThemeStore } from "../store";
// import { useUserStore } from "../store";
// import type { FC } from "react";

// const Layout: FC = () => {
//   const { isDarkMode, toggleDarkMode, background } = useThemeStore();
//   const { user, isAuthenticated, logout } = useUserStore();

//   return (
//     <div
//       className={isDarkMode ? "dark-mode" : "light-mode"}
//       style={{
//         backgroundImage: `url(/backgrounds/${background}.jpg)`,
//         backgroundSize: "cover",
//         backgroundAttachment: "fixed",
//         minHeight: "100vh",
//       }}
//     >
//       <nav className="main-nav">
//         <Link to="/background">切换背景</Link>
//         <button onClick={toggleDarkMode}>
//           {isDarkMode ? "日间模式" : "夜间模式"}
//         </button>
//         <Link to="/couple">情侣模式</Link>
//         {isAuthenticated ? (
//           <>
//             <span>欢迎, {user?.name}</span>
//             <button onClick={() => logout()}>退出</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">登录</Link>
//             <Link to="/register">注册</Link>
//           </>
//         )}
//       </nav>
//       <main>
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default Layout;

import { Outlet, Link } from "react-router-dom";
import { useThemeStore } from "../store";
// import { useUserStore } from "../store";
import type { FC } from "react";

const Layout: FC = () => {
  const { isDarkMode, toggleDarkMode, background } = useThemeStore();
  // const { user, isAuthenticated } = useUserStore();

  return (
    <div
      className={isDarkMode ? "dark-mode" : "light-mode"}
      style={{
        backgroundImage: `url(/backgrounds/${background}.jpg)`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <nav className="main-nav">
        <Link to="/">首页</Link>
        <Link to="/view">视图</Link>
        <Link to="/background">背景</Link>
        <Link to="/couple">情侣模式</Link>
        <Link to="/profile">我的</Link>
        <button onClick={toggleDarkMode} className="theme-toggle">
          {isDarkMode ? "日间模式" : "夜间模式"}
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
