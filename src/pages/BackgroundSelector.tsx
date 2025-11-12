import { useThemeStore } from "../store";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { FaSearch, FaPlus, FaHome, FaArrowLeft } from "react-icons/fa";

const navItems = [
  { id: "recommend", name: "推荐" },
  { id: "theme", name: "主题" },
  { id: "font", name: "字体" },
  { id: "backgrounds", name: "背景" },
  { id: "icon", name: "图标" },
  { id: "daily", name: "每日精选" },
  { id: "my", name: "我的" },
];

const BackgroundSelector = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("recommend");
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理导航激活状态
  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "daily") {
      navigate("/daily"); // 跳转到每日精选独立页面
    } else {
      navigate(`/background/${id}`);
    }
  };

  // 点击更多按钮跳转到对应板块
  const handleMoreClick = (section: string) => {
    setActiveNav(section);
    navigate(`/background/${section}`);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 渲染板块内容
  const renderSection = (title: string, sectionId: string, count: number) => (
    <div className="content-section">
      <div className="section-header">
        <h3>{title}</h3>
        <button className="more-btn" onClick={() => handleMoreClick(sectionId)}>
          更多
        </button>
      </div>
      <div className="item-grid">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="grid-item"
            style={{
              backgroundColor:
                sectionId === "theme"
                  ? "#6c5ce7"
                  : sectionId === "font"
                  ? "#fd79a8"
                  : sectionId === "backgrounds"
                  ? "#00b894"
                  : "#f39c12",
              opacity: 0.8 + (i % 5) * 0.04,
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      className={`background-selector ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* 顶部导航栏 - 固定定位 */}
      <div className="background-header">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="搜索主题、字体、背景..."
            className="search-input"
          />
        </div>

        {/* 导航菜单 */}
        <nav className="background-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={
                activeNav === item.id ? "nav-item selected" : "nav-item"
              }
              onClick={() => handleNavClick(item.id)}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 中间内容区 - 可滚动 */}
      <div className="background-content" ref={contentRef}>
        {/* 默认显示推荐内容 */}
        {location.pathname === "/background" && (
          <>
            {renderSection("主题", "theme", 9)}
            {renderSection("字体", "font", 6)}
            {renderSection("背景", "backgrounds", 9)}
            {renderSection("图标", "icon", 12)}
          </>
        )}

        {/* 其他路由内容通过Outlet显示 */}
        {location.pathname !== "/background" && <Outlet />}
      </div>

      {/* 底部导航栏 - 固定定位 */}
      <div className="background-footer">
        <button className="footer-btn">
          <FaPlus size={20} />
        </button>
        <button
          className="footer-btn home-btn"
          onClick={() => navigate("/background")}
        >
          <FaHome size={20} />
        </button>
        <button className="footer-btn back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft size={20} />
        </button>
      </div>
    </div>
  );
};

export default BackgroundSelector;
