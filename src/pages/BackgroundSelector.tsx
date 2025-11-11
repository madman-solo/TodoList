import { useThemeStore } from "../store";
import { useNavigate } from "react-router-dom";

const backgrounds = [
  { id: "default", name: "默认" },
  { id: "nature", name: "自然风景" },
  { id: "city", name: "城市夜景" },
  { id: "abstract", name: "抽象图案" },
  { id: "minimal", name: "极简风格" },
];

const BackgroundSelector = () => {
  const { background, setBackground, isDarkMode } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div
      className={`background-selector ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
    >
      {/* 顶部导航栏 */}
      <nav className="background-nav">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            className={bg.id === background ? "selected" : ""}
            onClick={() => setBackground(bg.id)}
          >
            {bg.name}
          </button>
        ))}
        <button onClick={() => navigate("/")} className="home-btn">
          返回首页
        </button>
      </nav>

      {/* 背景预览区 */}
      <div className="background-preview">
        <h2>背景预览</h2>
        <div
          className="preview-area"
          style={{
            backgroundImage: `url(/backgrounds/${background}.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "70vh",
            borderRadius: "8px",
            margin: "20px",
          }}
        />
      </div>
    </div>
  );
};

export default BackgroundSelector;
