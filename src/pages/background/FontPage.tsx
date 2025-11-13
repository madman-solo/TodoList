import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";

// 轮播数据
const carouselItems = [
  { id: 1, title: "手写体合集", desc: "温暖亲切的手写风格字体" },
  { id: 2, title: "简约无衬线体", desc: "现代感十足的无衬线字体" },
  { id: 3, title: "艺术装饰字体", desc: "华丽的装饰性字体" },
];

// 字体数据
const fontItems = [
  "思源黑体",
  "微软雅黑",
  "宋体",
  "黑体",
  "楷体",
  "隶书",
  "幼圆",
  "Arial",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Helvetica",
  "Impact",
];

const FontPage = () => {
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedFonts, setSortedFonts] = useState(fontItems);

  // 自动轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 排序功能
  useEffect(() => {
    setSortedFonts(
      [...fontItems].sort((a, b) => {
        return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="font-page">
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
        <button className="nav-btn">爆款字体</button>
        <button className="nav-btn">新品字</button>
        <button className="nav-btn">分类</button>
        <button className="sort-btn" onClick={toggleSortOrder}>
          时间 <FaSort size={16} />
        </button>
      </div>

      {/* 字体展示模块 */}
      <div className="content-module horizontal-grid">
        {sortedFonts.map((font, index) => (
          <div
            key={index}
            className="horizontal-card"
            style={{ fontFamily: font }}
          >
            {font}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontPage;
