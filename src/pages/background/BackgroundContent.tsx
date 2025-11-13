import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";

// 轮播数据
const carouselItems = [
  { id: 1, title: "自然风光", desc: "壮丽山河与自然景观" },
  { id: 2, title: "城市夜景", desc: "繁华都市的夜景风光" },
  { id: 3, title: "抽象艺术", desc: "充满创意的抽象设计" },
];

// 背景数据
const backgroundItems = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `背景 ${i + 1}`,
  image: `/backgrounds/bg${(i % 5) + 1}.jpg`,
}));

const BackgroundContent = () => {
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedItems, setSortedItems] = useState(backgroundItems);

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 排序功能
  useEffect(() => {
    setSortedItems(
      [...backgroundItems].sort((a, b) => {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="background-content-page">
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
        <button className="nav-btn">分类</button>
        <button className="nav-btn">AI背景</button>
        <button className="sort-btn" onClick={toggleSortOrder}>
          时间 <FaSort size={16} />
        </button>
      </div>

      {/* 内容模块 */}
      <div className="content-module vertical-grid">
        {sortedItems.map((item) => (
          <div key={item.id} className="vertical-card">
            <img src={item.image} alt={item.title} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundContent;
