import { useState, useEffect } from "react";
import {
  FaSort,
  FaSpinner,
  FaHeart,
  FaDownload,
  FaCheck,
} from "react-icons/fa";
import { useThemeStore } from "../../store";
import {
  backgroundAPI,
  type FontItem,
  type CarouselItem,
} from "../../services/api";
import { css } from "@emotion/react";

// 字体分类

const fontCategories = [
  { id: "all", name: "全部" },
  { id: "书法字体", name: "书法字体" },
  { id: "个性字体", name: "个性字体" },
  { id: "个人字体展", name: "个人字体展" },
  { id: "手写", name: "手写" },
];
const FontPage = () => {
  const { favoriteFonts, toggleFavoriteFont } = useThemeStore();
  const { isDarkMode } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  // const { backgroundData } = useBackgroundContext();
  // 判断字体是否已收藏
  const isFavorite = (id: number) => {
    return favoriteFonts.some((font) => font.id === id);
  };

  // 响应式下载提示组件
  const DownloadToast = ({
    visible,
    message,
  }: {
    visible: boolean;
    message: string;
  }) => (
    <div css={toastStyle(visible)}>
      <p>{message}</p>
    </div>
  );
  // 在组件中使用
  const [toast, setToast] = useState({ visible: false, message: "" });

  // 响应式提示框样式
  const toastStyle = (visible: boolean) => css`
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%)
      ${visible ? "translateY(0)" : "translateY(100px)"};
    opacity: ${visible ? 1 : 0};
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: ${window.innerWidth < 768 ? "8px 16px" : "12px 24px"};
    border-radius: 8px;
    z-index: 9999;
    font-size: ${window.innerWidth < 768 ? "14px" : "16px"};
    transition: all 0.3s ease;
    backdrop-filter: blur(4px);
  `;

  // 下载方法
  const downloadFont = async (font: FontItem) => {
    try {
      // 验证URL是否为字体文件
      const fontExts = ["ttf", "otf", "woff", "woff2"];
      const ext = font.url.split(".").pop()?.toLowerCase();
      if (!ext || !fontExts.includes(ext)) {
        throw new Error("无效的字体文件格式");
      }

      // 使用Blob避免跨域跳转
      const response = await fetch(font.url);
      if (!response.ok) throw new Error("文件获取失败");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${font.name}.${ext}`;
      link.click();
      URL.revokeObjectURL(url); // 释放资源

      // 显示提示
      setToast({ visible: true, message: `已下载: ${font.name}` });
      setTimeout(() => setToast({ ...toast, visible: false }), 3000);
    } catch (err) {
      setToast({
        visible: true,
        message: `下载失败: ${err instanceof Error ? err.message : "未知错误"}`,
      });
      setTimeout(() => setToast({ ...toast, visible: false }), 3000);
    }
  };

  // 获取轮播数据
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await backgroundAPI.getCarousel("font");
        setCarouselItems(data);
      } catch (err) {
        console.error("获取轮播数据失败:", err);
      }
    };

    fetchCarousel();
  }, []);

  // 获取字体数据
  useEffect(() => {
    const fetchFonts = async () => {
      try {
        setLoading(true);
        const data = await backgroundAPI.getFonts(
          activeCategory !== "all" ? activeCategory : undefined
        );
        setFonts(data);
        setError("");
      } catch (err) {
        setError("加载字体失败，请稍后重试");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, [activeCategory]);

  // 自动轮播
  useEffect(() => {
    if (carouselItems.length === 0) return;

    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // 排序功能
  useEffect(() => {
    setFonts((prev) =>
      [...prev].sort((a, b) => {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // 动态加载字体
  useEffect(() => {
    fonts.forEach((font) => {
      const link = document.createElement("link");
      link.href = font.url;
      link.rel = "stylesheet";
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    });
  }, [fonts]);

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" size={30} />
        <p>加载字体中...</p>
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
    <div className={`content-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 轮播模块 */}
      {carouselItems.length > 0 && (
        <div className="carousel-module">
          <div
            className="horizontal-carousel"
            style={{ transform: `translateX(-${activeCarousel * 100}%)` }}
          >
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className="carousel-slide"
                style={{
                  backgroundImage: `url("${item.image}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  // 为了文字清晰，可添加半透明遮罩层（通过伪元素或渐变实现）
                  backgroundColor: "rgba(0, 0, 0, 0.3)", // 深色遮罩，提升文字对比度
                  backgroundBlendMode: "overlay", // 混合背景图和遮罩色
                }}
              >
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* <BackgroundAnimation
        visible={true}
        background={backgroundData.background || ""}
        layers={backgroundData.layers}
        onComplete={() => {}}
      /> */}
      {/* 导航模块 */}
      <div className="nav-module">
        {fontCategories.map((category) => (
          <button
            key={category.id}
            className={`nav-btn ${
              activeCategory === category.id ? "active" : ""
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
        <button className="sort-btn" onClick={toggleSortOrder}>
          时间 <FaSort size={16} />
        </button>
      </div>

      {/* 字体展示模块 */}
      <div className="content-module horizontal-grid">
        {fonts.map((font) => (
          <div
            key={font.id}
            className="horizontal-card"
            style={{ fontFamily: font.name }}
          >
            <div className="font-actions">
              <button
                className={`font-action-btn ${
                  isFavorite(font.id) ? "active" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteFont(font);
                  // 添加到点赞列表
                  useThemeStore.getState().addToLiked({
                    id: font.id,
                    name: font.name,
                    preview: font.preview || `/previews/font-${font.id}.jpg`, // 使用字体预览图
                  });
                }}
              >
                {isFavorite(font.id) ? <FaCheck /> : <FaHeart />}
              </button>
              <button
                className="font-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFont(font); // 调用下载方法
                }}
              >
                <FaDownload />
              </button>
            </div>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Aa</div>
            <div>{font.name}</div>
            <div
              style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}
            >
              {font.previewText}
            </div>
            {font.isPremium && <span className="premium-badge">会员</span>}
          </div>
        ))}
        <DownloadToast visible={toast.visible} message={toast.message} />
      </div>
    </div>
  );
};

export default FontPage;
// function setToast(arg0: { visible: boolean; message: string; }) {
//   throw new Error("Function not implemented.");
// }
