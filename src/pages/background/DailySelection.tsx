import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaThumbsUp,
  FaComment,
  FaPlus,
  FaHome,
  FaArrowLeft,
} from "react-icons/fa";
import { useThemeStore } from "../../store";

const dailyItems = [
  {
    id: 1,
    title: "极简主义主题",
    type: "theme",
    image: "/backgrounds/minimal.jpg",
  },
  {
    id: 2,
    title: "治愈系字体",
    type: "font",
    image: "/backgrounds/nature.jpg",
  },
  {
    id: 3,
    title: "城市夜景背景",
    type: "background",
    image: "/backgrounds/city.jpg",
  },
  {
    id: 4,
    title: "创意图标集",
    type: "icon",
    image: "/backgrounds/abstract.jpg",
  },
];

const DailySelection = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [liked, setLiked] = useState(false);
  const [startX, setStartX] = useState(0); // 记录触摸起始位置
  const carouselRef = useRef<HTMLDivElement>(null);

  // 处理触摸开始（React 合成事件）
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // 记录初始触摸位置
    setStartX(e.touches[0].clientX);
  };

  // 处理触摸结束（React 合成事件）
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    // 滑动距离超过 50px 才触发切换
    if (diffX > 50 && activeIndex < dailyItems.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (diffX < -50 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  // 自动滚动到当前激活项
  useEffect(() => {
    if (carouselRef.current) {
      const scrollPosition =
        activeIndex * (carouselRef.current.offsetWidth * 0.8);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div className={`daily-selection ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="daily-content">
        <h2>每日精选</h2>

        {/* 轮播区域 - 使用 React 合成事件 */}
        <div
          className="carousel-container"
          ref={carouselRef}
          onTouchStart={handleTouchStart} // React 合成事件，类型匹配
          onTouchEnd={handleTouchEnd} // React 合成事件，类型匹配
        >
          {dailyItems.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-item ${
                index === activeIndex ? "active" : ""
              }`}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="item-info">
                <h3>{item.title}</h3>
                <p>{item.type}</p>
              </div>

              <div className="item-actions">
                <button
                  className={favorited ? "action-btn active" : "action-btn"}
                  onClick={() => setFavorited(!favorited)}
                >
                  <FaHeart size={20} />
                </button>
                <button
                  className={liked ? "action-btn active" : "action-btn"}
                  onClick={() => setLiked(!liked)}
                >
                  <FaThumbsUp size={20} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/daily/comments")}
                >
                  <FaComment size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="daily-footer">
        <button className="footer-btn" onClick={() => navigate("/daily/new")}>
          <FaPlus size={22} />
        </button>
        <button
          className="footer-btn home-btn active"
          onClick={() => navigate("/daily")}
        >
          <FaHome size={22} />
        </button>
        <button
          className="footer-btn back-btn"
          onClick={() => navigate("/background")}
        >
          <FaArrowLeft size={22} />
        </button>
      </div>
    </div>
  );
};

export default DailySelection;
