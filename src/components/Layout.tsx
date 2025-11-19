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
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <nav className="main-nav">
        <Link to="/" style={{ color: "#333333" }}>
          首页
        </Link>
        <Link to="/view" style={{ color: "#333333" }}>
          视图
        </Link>
        <Link to="/background" style={{ color: "#333333" }}>
          背景
        </Link>
        <Link to="/couple" style={{ color: "#333333" }}>
          情侣模式
        </Link>
        <Link to="/profile" style={{ color: "#333333" }}>
          我的
        </Link>
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
