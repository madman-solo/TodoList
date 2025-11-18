import { useState, useEffect } from "react";
import { FaSort, FaDownload, FaSpinner } from "react-icons/fa";
import { useThemeStore } from "../../store";
import {
  backgroundAPI,
  type IconItem,
  type CarouselItem,
} from "../../services/api";

// 图标分类
const iconCategories = [
  { id: "all", name: "全部" },
  { id: "系统图标", name: "系统图标" },
  { id: "社交图标", name: "社交图标" },
  { id: "商务图标", name: "商务图标" },
  { id: "教育图标", name: "教育图标" },
  { id: "娱乐图标", name: "娱乐图标" },
];

const IconPage = () => {
  const { isDarkMode } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [icons, setIcons] = useState<IconItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

  // 获取轮播数据
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await backgroundAPI.getCarousel("icon");
        setCarouselItems(data);
      } catch (err) {
        console.error("获取轮播数据失败:", err);
      }
    };

    fetchCarousel();
  }, []);

  // 获取图标数据
  useEffect(() => {
    const fetchIcons = async () => {
      try {
        setLoading(true);
        const data = await backgroundAPI.getIcons(
          activeCategory !== "all" ? activeCategory : undefined
        );
        setIcons(data);
        setError("");
      } catch (err) {
        setError("加载图标失败，请稍后重试");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
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
    setIcons((prev) =>
      [...prev].sort((a, b) => {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleDownload = (icon: IconItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // 下载逻辑实现
    console.log(`下载图标: ${icon.name}, 格式: ${icon.format.join(", ")}`);
    // 实际项目中会调用下载API
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" size={30} />
        <p>加载图标中...</p>
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
        {iconCategories.map((category) => (
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

      {/* 内容模块 */}
      <div className="content-module grid-icons">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className="icon-card"
            style={{ position: "relative" }}
          >
            <img src={icon.preview} alt={icon.name} />
            <div className="icon-info">
              <span className="icon-name">{icon.name}</span>
              <span className="icon-count">{icon.count}个图标</span>
              <span className="icon-formats">{icon.format.join(", ")}</span>
            </div>
            <button
              className="download-btn"
              onClick={(e) => handleDownload(icon, e)}
            >
              <FaDownload size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconPage;
