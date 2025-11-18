// import { useThemeStore } from "../store";
// import { useNavigate, Outlet, useLocation } from "react-router-dom";
// import { useState, useRef } from "react";
// import { FaSearch, FaPlus, FaHome, FaArrowLeft } from "react-icons/fa";

// const navItems = [
//   { id: "recommend", name: "推荐" },
//   { id: "theme", name: "主题" },
//   { id: "font", name: "字体" },
//   { id: "backgrounds", name: "背景" },
//   { id: "icon", name: "图标" },
//   { id: "daily", name: "每日精选" },
//   { id: "my", name: "我的" },
// ];

// const BackgroundSelector = () => {
//   const [searchQuery] = useState("");
//   // const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   setSearchQuery(e.target.value);
//   // };//这里后期添加搜索功能

//   const handleSearch = () => {
//     // 这里只是示例，实际项目中会调用API
//     console.log("搜索内容:", searchQuery);
//     // 可以添加搜索逻辑，比如过滤内容或导航到搜索结果页
//   };
//   const { isDarkMode } = useThemeStore();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeNav, setActiveNav] = useState("recommend");
//   const contentRef = useRef<HTMLDivElement>(null);

//   // 处理导航激活状态
//   const handleNavClick = (id: string) => {
//     setActiveNav(id);
//     if (id === "daily") {
//       navigate("/daily"); // 跳转到每日精选独立页面
//     } else if (id === "recommend") {
//       navigate(""); //跳转到当前路由的路径
//     } else {
//       navigate(`/background/${id}`);
//     } //注意条件语句的写法
//   };

//   // 点击更多按钮跳转到对应板块
//   const handleMoreClick = (section: string) => {
//     setActiveNav(section);
//     navigate(`/background/${section}`);
//     // 滚动到顶部
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // 渲染板块内容
//   const renderSection = (title: string, sectionId: string, count: number) => (
//     <div className="content-section">
//       <div className="section-header">
//         <h3>{title}</h3>
//         <button className="more-btn" onClick={() => handleMoreClick(sectionId)}>
//           更多
//         </button>
//       </div>
//       <div className="item-grid">
//         {[...Array(count)].map((_, i) => (
//           <div
//             key={i}
//             className="grid-item"
//             style={{
//               backgroundColor:
//                 sectionId === "theme"
//                   ? "#6c5ce7"
//                   : sectionId === "font"
//                   ? "#fd79a8"
//                   : sectionId === "backgrounds"
//                   ? "#00b894"
//                   : "#f39c12",
//               opacity: 0.8 + (i % 5) * 0.04,
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div
//       className={`background-selector ${
//         isDarkMode ? "dark-mode" : "light-mode"
//       }`}
//     >
//       {/* 顶部导航栏 - 固定定位 */}
//       <div className="background-header">
//         <div className="search-bar">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="搜索主题、字体、背景..."
//             className="search-input"
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSearch();
//               }
//             }}
//           />
//           <button className="search-btn" onClick={handleSearch}>
//             搜索
//           </button>
//         </div>

//         {/* 导航菜单 */}
//         <nav className="background-nav">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               className={
//                 activeNav === item.id ? "nav-item selected" : "nav-item"
//               }
//               onClick={() => handleNavClick(item.id)}
//             >
//               {item.name}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* 中间内容区 - 可滚动 */}
//       <div className="background-content" ref={contentRef}>
//         {/* 默认显示推荐内容 */}
//         {location.pathname === "/background" && (
//           <>
//             {renderSection("主题", "theme", 9)}
//             {renderSection("字体", "font", 6)}
//             {renderSection("背景", "backgrounds", 9)}
//             {renderSection("图标", "icon", 12)}
//           </>
//         )}

//         {/* 其他路由内容通过Outlet显示 */}
//         {location.pathname !== "/background" && <Outlet />}
//       </div>

//       {/* 底部导航栏 - 固定定位 */}
//       <div className="background-footer">
//         <button className="footer-btn">
//           <FaPlus size={20} />
//         </button>
//         <button
//           className="footer-btn home-btn"
//           onClick={() => navigate("/background")}
//         >
//           <FaHome size={20} />
//         </button>
//         <button className="footer-btn back-btn" onClick={() => navigate("/")}>
//           <FaArrowLeft size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BackgroundSelector;

import { useThemeStore } from "../store";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaHome,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import {
  backgroundAPI,
  type ThemeItem,
  type FontItem,
  type BackgroundItem,
  type IconItem,
} from "../services/api";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState({
    themes: [] as ThemeItem[],
    fonts: [] as FontItem[],
    backgrounds: [] as BackgroundItem[],
    icons: [] as IconItem[],
  });

  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("recommend");
  const contentRef = useRef<HTMLDivElement>(null);

  // 从API加载推荐内容
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await backgroundAPI.getRecommendations();
        setRecommendations(data);
        console.log("字体数据:", recommendations.fonts);
        setError("");
      } catch (err) {
        setError("加载推荐内容失败，请稍后重试");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (location.pathname === "/background") {
      fetchRecommendations();
    }
  }, [location.pathname]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    // 搜索逻辑实现
    navigate(`/background/search?query=${searchQuery}`);
  };

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    if (id === "daily") {
      navigate("/daily");
    } else if (id === "recommend") {
      navigate("");
    } else {
      navigate(`/background/${id}`);
    }
  };

  const handleMoreClick = (section: string) => {
    setActiveNav(section);
    navigate(`/background/${section}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 渲染板块内容
  const renderSection = (
    title: string,
    sectionId: string,
    items: (ThemeItem | FontItem | BackgroundItem | IconItem)[]
  ) => (
    <div className="content-section">
      <div className="section-header">
        <h3>{title}</h3>
        <button className="more-btn" onClick={() => handleMoreClick(sectionId)}>
          更多
        </button>
      </div>
      <div className="item-grid">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid-item"
            style={{
              backgroundImage: `url(${item.preview})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => navigate(`/background/${sectionId}/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" size={30} />
        <p>加载推荐内容中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>重试</button>
      </div>
    );
  }

  return (
    <div
      className={`background-selector ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* 顶部导航栏 */}
      <div className="background-header">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="搜索主题、字体、背景..."
            className="search-input"
            value={searchQuery}
            onChange={handleSearchInput}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            搜索
          </button>
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

      {/* 中间内容区 */}
      <div className="background-content" ref={contentRef}>
        {/* 默认显示推荐内容 */}
        {location.pathname === "/background" && (
          <>
            {renderSection("主题", "theme", recommendations.themes.slice(0, 9))}
            {renderSection("字体", "font", recommendations.fonts.slice(0, 6))}
            {renderSection(
              "背景",
              "backgrounds",
              recommendations.backgrounds.slice(0, 9)
            )}
            {renderSection("图标", "icon", recommendations.icons.slice(0, 12))}
          </>
        )}

        {/* 其他路由内容通过Outlet显示 */}
        {location.pathname !== "/background" && <Outlet />}
      </div>

      {/* 底部导航栏 */}
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
