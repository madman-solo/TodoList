import { useState, useEffect } from "react";
import { FaSort, FaSpinner } from "react-icons/fa";
import { useThemeStore } from "../../store";
import {
  backgroundAPI,
  type BackgroundItem,
  type CarouselItem,
} from "../../services/api";

const BackgroundContent = () => {
  const { isDarkMode, setBackground } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

  // 获取轮播数据
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await backgroundAPI.getCarousel("background");
        setCarouselItems(data);
      } catch (err) {
        console.error("获取轮播数据失败:", err);
      }
    };

    fetchCarousel();
  }, []);

  // 获取背景数据
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        setLoading(true);
        const data = await backgroundAPI.getBackgrounds(
          activeCategory !== "all" ? activeCategory : undefined
        );
        setBackgrounds(data);
        setError("");
      } catch (err) {
        setError("加载背景失败，请稍后重试");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackgrounds();
  }, [activeCategory]);

  // 自动轮播效果
  useEffect(() => {
    if (carouselItems.length === 0) return;

    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  // 排序功能
  useEffect(() => {
    setBackgrounds((prev) =>
      [...prev].sort((a, b) => {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleBackgroundSelect = (item: BackgroundItem) => {
    setSelectedItem(item.id);
    setBackground(item.preview); // 设置背景
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" size={30} />
        <p>加载背景中...</p>
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

      {/* 导航模块 */}
      <div className="nav-module">
        <button
          className={`nav-btn ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          全部
        </button>
        <button
          className={`nav-btn ${activeCategory === "真人" ? "active" : ""}`}
          onClick={() => setActiveCategory("真人")}
        >
          真人
        </button>
        <button
          className={`nav-btn ${activeCategory === "动漫" ? "active" : ""}`}
          onClick={() => setActiveCategory("动漫")}
        >
          动漫
        </button>
        <button
          className={`nav-btn ${activeCategory === "插画" ? "active" : ""}`}
          onClick={() => setActiveCategory("插画")}
        >
          插画
        </button>
        <button className="sort-btn" onClick={toggleSortOrder}>
          时间 <FaSort size={16} />
        </button>
      </div>

      {/* 内容模块 */}
      <div className="content-module vertical-grid">
        {backgrounds.map((item) => (
          <div
            key={item.id}
            className="vertical-card"
            style={{ position: "relative" }}
            onClick={() => handleBackgroundSelect(item)}
          >
            <img src={item.preview} alt={item.title} />
            <span>{item.title}</span>
            <div className="resolution-badge">{item.resolution}</div>
            {selectedItem === item.id && (
              <div className="selected-indicator">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundContent;
