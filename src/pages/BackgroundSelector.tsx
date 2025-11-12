// import { useThemeStore } from "../store";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// const backgrounds = [
//   { id: "default", name: "默认", category: "推荐" },
//   { id: "nature", name: "自然风景", category: "主题" },
//   { id: "city", name: "城市夜景", category: "主题" },
//   { id: "abstract", name: "抽象图案", category: "主题" },
//   { id: "minimal", name: "极简风格", category: "主题" },
// ];

// const fonts = [
//   { id: "poppins", name: "Poppins" },
//   { id: "playfair", name: "Playfair Display" },
//   { id: "sans", name: "系统无衬线" },
// ];
// // const [activeNav, setActiveNav] = useState("recommend"); // 默认推荐选中
// const BackgroundSelector = () => {
//   const { background, setBackground, isDarkMode, setFont } = useThemeStore();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("推荐");
//   const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <div
//       className={`background-selector ${
//         isDarkMode ? "dark-mode" : "light-mode"
//       }`}
//     >
//       {/* 顶部搜索和导航 */}
//       <div className="background-header">
//         <input
//           type="text"
//           placeholder="搜索背景、主题或字体..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="background-search"
//         />

//         <nav className="background-tabs">
//           {["推荐", "主题", "字体", "背景", "图标"].map((tab) => (
//             <button
//               key={tab}
//               className={activeTab === tab ? "tab-active" : ""}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* 中间浏览内容 */}
//       <div className="background-content">
//         {activeTab === "字体" ? (
//           <div className="font-options">
//             {fonts.map((font) => (
//               <div
//                 key={font.id}
//                 className="font-option"
//                 onClick={() => setFont(font.id)}
//               >
//                 <h3
//                   style={{
//                     fontFamily:
//                       font.id === "poppins"
//                         ? "Poppins"
//                         : font.id === "playfair"
//                         ? "Playfair Display"
//                         : "sans-serif",
//                   }}
//                 >
//                   {font.name}
//                 </h3>
//                 <p
//                   className="font-preview"
//                   style={{
//                     fontFamily:
//                       font.id === "poppins"
//                         ? "Poppins"
//                         : font.id === "playfair"
//                         ? "Playfair Display"
//                         : "sans-serif",
//                   }}
//                 >
//                   这是字体预览效果
//                 </p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="background-options">
//             {backgrounds
//               .filter((bg) => bg.category === activeTab || activeTab === "推荐")
//               .filter((bg) => bg.name.includes(searchTerm))
//               .map((bg) => (
//                 <div
//                   key={bg.id}
//                   className={`background-option ${
//                     bg.id === background ? "selected" : ""
//                   }`}
//                   style={{
//                     backgroundImage: `url(/backgrounds/${bg.id}.jpg)`,
//                   }}
//                   onClick={() => setBackground(bg.id)}
//                 >
//                   <span className="background-name">{bg.name}</span>
//                 </div>
//               ))}
//           </div>
//         )}
//       </div>

//       {/* 底部导航 */}
//       <nav className="background-bottom-nav">
//         <button onClick={() => navigate("/")} className="bottom-nav-item">
//           首页
//         </button>
//         <button className="bottom-nav-item">每日精选</button>
//         <button
//           onClick={() => navigate("/profile")}
//           className="bottom-nav-item"
//         >
//           我的
//         </button>
//       </nav>
//     </div>
//   );
// };

// export default BackgroundSelector;

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
