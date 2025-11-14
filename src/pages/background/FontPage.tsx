// import { useState, useEffect } from "react";
// import { FaSort } from "react-icons/fa";

// // 轮播数据
// const carouselItems = [
//   { id: 1, title: "手写体合集", desc: "温暖亲切的手写风格字体" },
//   { id: 2, title: "简约无衬线体", desc: "现代感十足的无衬线字体" },
//   { id: 3, title: "艺术装饰字体", desc: "华丽的装饰性字体" },
// ];

// // 字体数据
// const fontItems = [
//   "思源黑体",
//   "微软雅黑",
//   "宋体",
//   "黑体",
//   "楷体",
//   "隶书",
//   "幼圆",
//   "Arial",
//   "Times New Roman",
//   "Georgia",
//   "Courier New",
//   "Verdana",
//   "Helvetica",
//   "Impact",
// ];

// const FontPage = () => {
//   const [activeCarousel, setActiveCarousel] = useState(0);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [sortedFonts, setSortedFonts] = useState(fontItems);

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
//     <div className="font-page">
//       {/* 轮播模块 */}
//       <div className="carousel-module">
//         <div className="horizontal-carousel">
//           {carouselItems.map((item, index) => (
//             <div
//               key={item.id}
//               className={`carousel-slide ${
//                 index === activeCarousel ? "active" : ""
//               }`}
//               style={{ transform: `translateX(-${activeCarousel * 100}%)` }}
//             >
//               <h3>{item.title}</h3>
//               <p>{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 导航模块 */}
//       <div className="nav-module">
//         <button className="nav-btn">排行榜</button>
//         <button className="nav-btn">爆款字体</button>
//         <button className="nav-btn">新品字</button>
//         <button className="nav-btn">分类</button>
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
//             {font}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FontPage;

import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { useThemeStore } from "../../store";

// 轮播数据
const carouselItems = [
  { id: 1, title: "精选字体集", desc: "精心挑选的高品质字体组合" },
  { id: 2, title: "手写风格", desc: "自然流畅的手写体，增添温度" },
  { id: 3, title: "无衬线字体", desc: "现代简洁的无衬线字体，易读性强" },
];

// 字体数据
const fontItems = [
  "Poppins",
  "Playfair Display",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Inter",
  "Raleway",
  "Oswald",
  "Source Sans Pro",
  "Merriweather",
  "Noto Sans",
];

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
  const [sortedFonts, setSortedFonts] = useState(fontItems);
  const [activeCategory, setActiveCategory] = useState("all");

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
        {sortedFonts.map((font, index) => (
          <div
            key={index}
            className="horizontal-card"
            style={{ fontFamily: font }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Aa</div>
            <div>{font}</div>
            <div
              style={{ fontSize: "0.9rem", marginTop: "0.5rem", opacity: 0.7 }}
            >
              示例文本展示
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontPage;
