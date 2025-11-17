// import { useState, useEffect } from "react";
// import { FaSort } from "react-icons/fa";
// import { useThemeStore } from "../../store";

// // 轮播数据
// const carouselItems = [
//   {
//     id: 1,
//     title: "极简主义主题包",
//     desc: "简约而不简单的设计风格，提升专注度",
//   },
//   { id: 2, title: "暗黑模式主题", desc: "保护眼睛的深色主题，夜间使用更舒适" },
//   { id: 3, title: "春日主题", desc: "充满生机与活力的设计，带来愉悦心情" },
// ];

// // 主题数据
// const themeItems = Array.from({ length: 12 }, (_, i) => ({
//   id: i + 1,
//   title: `主题 ${i + 1}`,
//   preview: `/themes/theme${(i % 4) + 1}.jpg`,
//   category: i % 3 === 0 ? "简约" : i % 3 === 1 ? "活力" : "专业",
// }));

// const ThemePage = () => {
//   const { isDarkMode } = useThemeStore();
//   const [activeCarousel, setActiveCarousel] = useState(0);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [sortedItems, setSortedItems] = useState(themeItems);
//   const [activeCategory, setActiveCategory] = useState("all");

//   // 自动轮播效果
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // 排序和筛选功能
//   useEffect(() => {
//     let result = [...themeItems];

//     // 筛选分类
//     if (activeCategory !== "all") {
//       result = result.filter((item) => item.category === activeCategory);
//     }

//     // 排序
//     result.sort((a, b) => {
//       return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
//     });

//     setSortedItems(result);
//   }, [sortOrder, activeCategory]);

//   const toggleSortOrder = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   return (
//     <div className={`content-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
//       {/* 轮播模块 */}
//       <div className="carousel-module">
//         <div
//           className="horizontal-carousel"
//           style={{ transform: `translateX(-${activeCarousel * 100}%)` }}
//         >
//           {carouselItems.map((item) => (
//             <div key={item.id} className="carousel-slide">
//               <h3>{item.title}</h3>
//               <p>{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 导航模块 */}
//       <div className="nav-module">
//         <button
//           className={`nav-btn ${activeCategory === "all" ? "active" : ""}`}
//           onClick={() => setActiveCategory("all")}
//         >
//           全部
//         </button>
//         <button
//           className={`nav-btn ${activeCategory === "简约" ? "active" : ""}`}
//           onClick={() => setActiveCategory("简约")}
//         >
//           简约
//         </button>
//         <button
//           className={`nav-btn ${activeCategory === "活力" ? "active" : ""}`}
//           onClick={() => setActiveCategory("活力")}
//         >
//           活力
//         </button>
//         <button
//           className={`nav-btn ${activeCategory === "专业" ? "active" : ""}`}
//           onClick={() => setActiveCategory("专业")}
//         >
//           专业
//         </button>
//         <button className="sort-btn" onClick={toggleSortOrder}>
//           时间 <FaSort size={16} />
//         </button>
//       </div>

//       {/* 内容模块 */}
//       <div className="content-module vertical-grid">
//         {sortedItems.map((item) => (
//           <div key={item.id} className="vertical-card">
//             <img src={item.preview} alt={item.title} />
//             <span>{item.title}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ThemePage;

import { useState, useEffect } from "react";
import { FaSort, FaSpinner } from "react-icons/fa";
import { useThemeStore } from "../../store";
import {
  backgroundAPI,
  type ThemeItem,
  type CarouselItem,
} from "../../services/api";

const ThemePage = () => {
  const { isDarkMode } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedItems, setSortedItems] = useState<ThemeItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

  // 获取轮播数据
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await backgroundAPI.getCarousel("theme");
        setCarouselItems(data);
      } catch (err) {
        console.error("获取轮播数据失败:", err);
      }
    };

    fetchCarousel();
  }, []);

  // 获取主题数据
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const data = await backgroundAPI.getThemes(
          activeCategory !== "all" ? activeCategory : undefined
        );
        setSortedItems(data);
        setError("");
      } catch (err) {
        setError("加载主题失败，请稍后重试");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
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
    setSortedItems((prev) =>
      [...prev].sort((a, b) => {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      })
    );
  }, [sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" size={30} />
        <p>加载主题中...</p>
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
              <div key={item.id} className="carousel-slide">
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
          className={`nav-btn ${activeCategory === "简约" ? "active" : ""}`}
          onClick={() => setActiveCategory("简约")}
        >
          简约
        </button>
        <button
          className={`nav-btn ${activeCategory === "活力" ? "active" : ""}`}
          onClick={() => setActiveCategory("活力")}
        >
          活力
        </button>
        <button
          className={`nav-btn ${activeCategory === "专业" ? "active" : ""}`}
          onClick={() => setActiveCategory("专业")}
        >
          专业
        </button>
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
            {item.isNew && <span className="new-badge">新</span>}
            <div className="download-count">下载: {item.downloadCount}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePage;
