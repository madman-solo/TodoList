// src/components/Layout.tsx
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useThemeStore } from "../store";
import { useUserStore } from "../store";
import type { FC } from "react";

const Layout: FC = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user, isAuthenticated, logout } = useUserStore();
  // const navigate = useNavigate();

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <nav className="main-nav">
        <Link to="/background">切换背景</Link>
        <button onClick={toggleDarkMode}>
          {isDarkMode ? "日间模式" : "夜间模式"}
        </button>
        <Link to="/couple">情侣模式</Link>
        {isAuthenticated ? (
          <>
            <span>欢迎, {user?.name}</span>
            <button onClick={() => logout()}>退出</button>
          </>
        ) : (
          <>
            <Link to="/login">登录</Link>
            <Link to="/register">注册</Link>
          </>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
