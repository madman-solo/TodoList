// import { useThemeStore } from "../store";
// import { useNavigate } from "react-router-dom";

// const backgrounds = [
//   { id: "default", name: "默认" },
//   { id: "nature", name: "自然风景" },
//   { id: "city", name: "城市夜景" },
//   { id: "abstract", name: "抽象图案" },
//   { id: "minimal", name: "极简风格" },
// ];

// const BackgroundSelector = () => {
//   const { background, setBackground, isDarkMode } = useThemeStore();
//   const navigate = useNavigate();

//   return (
//     <div
//       className={`background-selector ${
//         isDarkMode ? "dark-mode" : "light-mode"
//       }`}
//     >
//       {/* 顶部导航栏 */}
//       <nav className="background-nav">
//         {backgrounds.map((bg) => (
//           <button
//             key={bg.id}
//             className={bg.id === background ? "selected" : ""}
//             onClick={() => setBackground(bg.id)}
//           >
//             {bg.name}
//           </button>
//         ))}
//         <button onClick={() => navigate("/")} className="home-btn">
//           返回首页
//         </button>
//       </nav>

//       {/* 背景预览区 */}
//       <div className="background-preview">
//         <h2>背景预览</h2>
//         <div
//           className="preview-area"
//           style={{
//             backgroundImage: `url(/backgrounds/${background}.jpg)`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             height: "70vh",
//             borderRadius: "8px",
//             margin: "20px",
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default BackgroundSelector;

import { useThemeStore } from "../store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const backgrounds = [
  { id: "default", name: "默认", category: "推荐" },
  { id: "nature", name: "自然风景", category: "主题" },
  { id: "city", name: "城市夜景", category: "主题" },
  { id: "abstract", name: "抽象图案", category: "主题" },
  { id: "minimal", name: "极简风格", category: "主题" },
];

const fonts = [
  { id: "poppins", name: "Poppins" },
  { id: "playfair", name: "Playfair Display" },
  { id: "sans", name: "系统无衬线" },
];

const BackgroundSelector = () => {
  const { background, setBackground, isDarkMode, setFont } = useThemeStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("推荐");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      className={`background-selector ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* 顶部搜索和导航 */}
      <div className="background-header">
        <input
          type="text"
          placeholder="搜索背景、主题或字体..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="background-search"
        />

        <nav className="background-tabs">
          {["推荐", "主题", "字体", "背景", "图标"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "tab-active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* 中间浏览内容 */}
      <div className="background-content">
        {activeTab === "字体" ? (
          <div className="font-options">
            {fonts.map((font) => (
              <div
                key={font.id}
                className="font-option"
                onClick={() => setFont(font.id)}
              >
                <h3
                  style={{
                    fontFamily:
                      font.id === "poppins"
                        ? "Poppins"
                        : font.id === "playfair"
                        ? "Playfair Display"
                        : "sans-serif",
                  }}
                >
                  {font.name}
                </h3>
                <p
                  className="font-preview"
                  style={{
                    fontFamily:
                      font.id === "poppins"
                        ? "Poppins"
                        : font.id === "playfair"
                        ? "Playfair Display"
                        : "sans-serif",
                  }}
                >
                  这是字体预览效果
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="background-options">
            {backgrounds
              .filter((bg) => bg.category === activeTab || activeTab === "推荐")
              .filter((bg) => bg.name.includes(searchTerm))
              .map((bg) => (
                <div
                  key={bg.id}
                  className={`background-option ${
                    bg.id === background ? "selected" : ""
                  }`}
                  style={{
                    backgroundImage: `url(/backgrounds/${bg.id}.jpg)`,
                  }}
                  onClick={() => setBackground(bg.id)}
                >
                  <span className="background-name">{bg.name}</span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 底部导航 */}
      <nav className="background-bottom-nav">
        <button onClick={() => navigate("/")} className="bottom-nav-item">
          首页
        </button>
        <button className="bottom-nav-item">每日精选</button>
        <button
          onClick={() => navigate("/profile")}
          className="bottom-nav-item"
        >
          我的
        </button>
      </nav>
    </div>
  );
};

export default BackgroundSelector;
