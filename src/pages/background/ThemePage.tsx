import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { FaSort } from "react-icons/fa";

// 轮播数据
const carouselItems = [
  { id: 1, title: "极简主义主题包", desc: "简约而不简单的设计风格" },
  { id: 2, title: "暗黑模式主题", desc: "保护眼睛的深色主题" },
  { id: 3, title: "春日主题", desc: "充满生机与活力的设计" },
];

// 内容数据
const contentItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `主题 ${i + 1}`,
  preview: `/themes/theme${(i % 4) + 1}.jpg`,
}));

const ThemePage = () => {
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedItems, setSortedItems] = useState(contentItems);
  // const navigate = useNavigate();

  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 排序功能
  useEffect(() => {
    setSortedItems(
      [...contentItems].sort((a, b) => {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="theme-page">
      {/* 轮播模块 */}
      <div className="carousel-module">
        <div className="horizontal-carousel">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-slide ${
                index === activeCarousel ? "active" : ""
              }`}
              style={{ transform: `translateX(-${activeCarousel * 100}%)` }}
            >
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 导航模块 */}
      <div className="nav-module">
        <button className="nav-btn">排行榜</button>
        <button className="nav-btn">小编推荐</button>
        <button className="sort-btn" onClick={toggleSortOrder}>
          时间 <FaSort size={16} />
        </button>
      </div>

      {/* 内容模块 */}
      <div className="content-module vertical-grid">
        {sortedItems.map((item) => (
          <div key={item.id} className="vertical-card">
            <img src={item.preview} alt={item.title} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePage;
