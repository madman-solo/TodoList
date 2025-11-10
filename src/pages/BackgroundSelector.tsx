// src/pages/BackgroundSelector.tsx
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
  const { background, setBackground } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="background-selector">
      <h2>选择背景</h2>
      <div className="background-options">
        {backgrounds.map((bg) => (
          <div
            key={bg.id}
            className={`background-option ${
              bg.id === background ? "selected" : ""
            }`}
            style={{ backgroundImage: `url(/backgrounds/${bg.id}.jpg)` }}
            onClick={() => setBackground(bg.id)}
          >
            <span>{bg.name}</span>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/")}>返回首页</button>
    </div>
  );
};

export default BackgroundSelector;
