import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";

// 轮播数据
const carouselItems = [
  { id: 1, title: "Material 图标", desc: "遵循Material Design的图标集" },
  { id: 2, title: "线性图标", desc: "简约的线性风格图标" },
  { id: 3, title: "填充图标", desc: "富有质感的填充式图标" },
];

// 图标数据
const iconItems = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `图标 ${i + 1}`,
  category: ["基础", "社交", "工具", "系统"][i % 4],
}));

const IconPage = () => {
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedIcons, setSortedIcons] = useState(iconItems);

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 排序功能
  useEffect(() => {
    setSortedIcons(
      [...iconItems].sort((a, b) => {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="icon-page">
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
        <button className="nav-btn">全部分类</button>
        <button className="sort-btn" onClick={toggleSortOrder}>
          时间 <FaSort size={16} />
        </button>
      </div>

      {/* 图标展示模块 */}
      <div className="content-module icon-grid">
        {sortedIcons.map((item) => (
          <div key={item.id} className="icon-card">
            <div className="icon-placeholder">
              {/* 这里将来会放实际图标 */}
              <span>{item.id}</span>
            </div>
            <span className="icon-name">{item.name}</span>
            <span className="icon-category">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconPage;
