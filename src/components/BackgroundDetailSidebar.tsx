import { useState } from "react";
import { FaDownload, FaHeart, FaImage, FaSlidersH } from "react-icons/fa";

interface ThemeDetail {
  id: number;
  title: string;
  technique: string;
  colorScheme: string;
  layers: {
    name: string;
    description: string;
  }[];
  preview: string;
}

interface ThemeDetailSidebarProps {
  visible: boolean;
  theme: ThemeDetail | null;
  onClose: () => void;
  onSetAsBackground: () => void;
}

const BackgroundDetailSidebar = ({
  visible,
  theme,
  onClose,
  onSetAsBackground,
}: ThemeDetailSidebarProps) => {
  const [params, setParams] = useState({
    lineWidth: 2,
    saturation: 100,
    opacity: 100,
  });

  const handleParamChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  if (!visible || !theme) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        // width: "100%",
        width: `${window.innerWidth < 768 ? "85%" : "400px"}`,
        maxWidth: "400px",
        height: "100vh",
        background: "white",
        boxShadow: "-2px 0 10px rgba(0, 0, 0, 0.1)",
        zIndex: 100,
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        overflowY: "auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          border: "none",
          background: "transparent",
          fontSize: "1.5rem",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        ×
      </button>

      <h2
        style={{
          marginTop: 0,
        }}
      >
        {theme.title}
      </h2>

      {/* 技术原理区 */}
      <div
        style={{
          margin: "1.5rem 0",
        }}
      >
        <h3>技术原理</h3>
        <div
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <p>
            <strong>创作技法：</strong>
            {theme.technique}
          </p>
          <p>
            <strong>色彩方案：</strong>
            {theme.colorScheme}
          </p>
          <p>
            <strong>图层结构：</strong>
          </p>
          <ul>
            {theme.layers.map((layer, i) => (
              <li key={i}>
                {layer.name}：{layer.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 操作按钮区 */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          margin: "1.5rem 0",
        }}
      >
        <button
          style={{
            flex: "1",
            padding: "0.8rem",
            border: "none",
            borderRadius: "8px",
            background: "#6c5ce7",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
          onClick={onSetAsBackground}
        >
          <FaImage size={16} /> 设为背景
        </button>
        <button
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaHeart size={18} />
        </button>
        <button
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FaSlidersH size={18} />
        </button>
      </div>

      {/* 复刻工具区 */}
      <div>
        <h3>复刻工具</h3>

        <div
          style={{
            margin: "1rem 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "1rem 0",
            }}
          >
            <label>线条粗细: {params.lineWidth}px</label>
            <input
              type="range"
              min="1"
              max="10"
              value={params.lineWidth}
              onChange={(e) =>
                handleParamChange("lineWidth", Number(e.target.value))
              }
              style={{
                width: "150px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "1rem 0",
            }}
          >
            <label>色彩饱和度: {params.saturation}%</label>
            <input
              type="range"
              min="0"
              max="200"
              value={params.saturation}
              onChange={(e) =>
                handleParamChange("saturation", Number(e.target.value))
              }
              style={{
                width: "150px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "1rem 0",
            }}
          >
            <label>图层透明度: {params.opacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={params.opacity}
              onChange={(e) =>
                handleParamChange("opacity", Number(e.target.value))
              }
              style={{
                width: "150px",
              }}
            />
          </div>
        </div>

        <div
          style={{
            height: "150px",
            background: "#f0f0f0",
            borderRadius: "8px",
            margin: "1rem 0",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={theme.preview}
            alt="预览"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: `saturate(${params.saturation}%)`,
              opacity: `${params.opacity / 100}`,
            }}
          />
        </div>

        <button
          style={{
            width: "100%",
            padding: "0.8rem",
            border: "none",
            borderRadius: "8px",
            background: "#2ecc71",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          <FaDownload size={16} /> 导出组件
        </button>
      </div>
    </div>
  );
};

export default BackgroundDetailSidebar;
