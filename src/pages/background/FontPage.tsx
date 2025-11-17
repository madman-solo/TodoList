// import { useState, useEffect } from "react";
// import { FaSort } from "react-icons/fa";
// import { useThemeStore } from "../../store";

// // 轮播数据
// const carouselItems = [
//   { id: 1, title: "精选字体集", desc: "精心挑选的高品质字体组合" },
//   { id: 2, title: "手写风格", desc: "自然流畅的手写体，增添温度" },
//   { id: 3, title: "无衬线字体", desc: "现代简洁的无衬线字体，易读性强" },
// ];

// // 字体数据
// const fontItems = [
//   "Poppins",
//   "Playfair Display",
//   "Roboto",
//   "Open Sans",
//   "Lato",
//   "Montserrat",
//   "Inter",
//   "Raleway",
//   "Oswald",
//   "Source Sans Pro",
//   "Merriweather",
//   "Noto Sans",
// ];
// // todo:需要做分类
// // 字体分类
// const fontCategories = [
//   { id: "all", name: "全部" },
//   { id: "sans", name: "书法字体" },
//   { id: "serif", name: "个性字体" },
//   { id: "display", name: "个人字体展" },
//   { id: "handwriting", name: "手写" },
// ];

// const FontPage = () => {
//   const { isDarkMode } = useThemeStore();
//   const [activeCarousel, setActiveCarousel] = useState(0);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [sortedFonts, setSortedFonts] = useState(fontItems);
//   const [activeCategory, setActiveCategory] = useState("all");

//   // 自动轮播
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // 排序功能
//   useEffect(() => {
//     setSortedFonts(
//       [...fontItems].sort((a, b) => {
//         return sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a);
//       })
//     );
//   }, [sortOrder]);

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
//         {fontCategories.map((category) => (
//           <button
//             key={category.id}
//             className={`nav-btn ${
//               activeCategory === category.id ? "active" : ""
//             }`}
//             onClick={() => setActiveCategory(category.id)}
//           >
//             {category.name}
//           </button>
//         ))}
//         <button className="sort-btn" onClick={toggleSortOrder}>
//           时间 <FaSort size={16} />
//         </button>
//       </div>

//       {/* 字体展示模块 */}
//       <div className="content-module horizontal-grid">
//         {sortedFonts.map((font, index) => (
//           <div
//             key={index}
//             className="horizontal-card"
//             style={{ fontFamily: font }}
//           >
//             <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Aa</div>
//             <div>{font}</div>
//             <div
//               style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}
//             >
//               示例文本展示
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FontPage;

import { useState, useEffect } from "react";
import { FaSort, FaSpinner } from "react-icons/fa";
import { useThemeStore } from "../../store";
import {
  backgroundAPI,
  type FontItem,
  type CarouselItem,
} from "../../services/api";

// 字体分类
const fontCategories = [
  { id: "all", name: "全部" },
  { id: "sans", name: "书法字体" },
  { id: "serif", name: "个性字体" },
  { id: "display", name: "个人字体展" },
  { id: "handwriting", name: "手写" },
];

const FontPage = () => {
  const { isDarkMode } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

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
      </div>
    </div>
  );
};

export default FontPage;
