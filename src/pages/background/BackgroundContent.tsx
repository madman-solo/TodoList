import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { useThemeStore } from "../../store";

// 轮播数据
const carouselItems = [
  { id: 1, title: "自然风景", desc: "壮丽山河与自然风光，带来宁静感受" },
  { id: 2, title: "抽象艺术", desc: "独特的抽象设计，激发创造力" },
  { id: 3, title: "极简几何", desc: "简洁的几何图案，营造现代感" },
];
// 定义背景项的类型接口
interface BackgroundItems {
  id: number; // 假设 id 是数字类型
  title: string; // 其他可能的属性（根据实际数据补充）
  preview: string;
  category: string;
}
// todo:分类不完善，需要根据实际情况更改
// 背景数据
const backgroundItems = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `背景 ${i + 1}`,
  preview: `/backgrounds/bg${(i % 5) + 1}.jpg`,
  category: i % 3 === 0 ? "真人" : i % 3 === 1 ? "动漫" : "插画",
}));

const BackgroundContent = () => {
  const { isDarkMode, setBackground } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedItems, setSortedItems] = useState(backgroundItems);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 排序和筛选功能
  useEffect(() => {
    let result = [...backgroundItems];

    // 筛选分类
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    // 排序
    result.sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });

    setSortedItems(result);
  }, [sortOrder, activeCategory]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleBackgroundSelect = (item: BackgroundItems) => {
    setSelectedItem(item.id);
    setBackground(`bg${(item.id % 5) + 1}`); // 设置背景
  };

  return (
    <div className={`content-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 轮播模块 */}
      <div className="carousel-module">
        <div
          className="horizontal-carousel"
          style={{ transform: `translateX(-${activeCarousel * 100}%)` }}
        >
          {carouselItems.map((item) => (
            <div key={item.id} className="carousel-slide">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

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
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className="vertical-card"
            style={{ position: "relative" }}
            onClick={() => handleBackgroundSelect(item)}
          >
            <img src={item.preview} alt={item.title} />
            <span>{item.title}</span>
            {selectedItem === item.id && (
              <div
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                }}
              >
                ✓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundContent;
