// import { useState, useEffect } from "react";
// import { FaSort } from "react-icons/fa";

// // 轮播数据
// const carouselItems = [
//   { id: 1, title: "Material 图标", desc: "遵循Material Design的图标集" },
//   { id: 2, title: "线性图标", desc: "简约的线性风格图标" },
//   { id: 3, title: "填充图标", desc: "富有质感的填充式图标" },
// ];

// // 图标数据
// const iconItems = Array.from({ length: 24 }, (_, i) => ({
//   id: i + 1,
//   name: `图标 ${i + 1}`,
//   category: ["基础", "社交", "工具", "系统"][i % 4],
// }));

// const IconPage = () => {
//   const [activeCarousel, setActiveCarousel] = useState(0);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [sortedIcons, setSortedIcons] = useState(iconItems);

//   // 自动轮播
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   // 排序功能
//   useEffect(() => {
//     setSortedIcons(
//       [...iconItems].sort((a, b) => {
//         return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
//       })
//     );
//   }, [sortOrder]);

//   const toggleSortOrder = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   return (
//     <div className="icon-page">
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
//         <button className="nav-btn">全部分类</button>
//         <button className="sort-btn" onClick={toggleSortOrder}>
//           时间 <FaSort size={16} />
//         </button>
//       </div>

//       {/* 图标展示模块 */}
//       <div className="content-module icon-grid">
//         {sortedIcons.map((item) => (
//           <div key={item.id} className="icon-card">
//             <div className="icon-placeholder">
//               {/* 这里将来会放实际图标 */}
//               <span>{item.id}</span>
//             </div>
//             <span className="icon-name">{item.name}</span>
//             <span className="icon-category">{item.category}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default IconPage;

import { useState, useEffect } from "react";
import {
  FaSort,
  FaCheck,
  FaStar,
  FaHeart,
  FaClock,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import { useThemeStore } from "../../store";

// 轮播数据
const carouselItems = [
  { id: 1, title: "基础图标集", desc: "常用功能图标，风格统一" },
  { id: 2, title: "情感图标", desc: "丰富的情感表达图标" },
  { id: 3, title: "自定义图标", desc: "可个性化设置的图标集合" },
];

// 图标数据
const iconCategories = [
  { id: "all", name: "全部" },
  { id: "action", name: "操作" },
  { id: "emotion", name: "情感" },
  { id: "time", name: "时间" },
  { id: "system", name: "系统" },
];

// 生成图标数据
const generateIconItems = () => {
  const icons = [
    { icon: <FaCheck size={24} />, name: "确认", category: "action" },
    { icon: <FaStar size={24} />, name: "收藏", category: "action" },
    { icon: <FaHeart size={24} />, name: "喜欢", category: "emotion" },
    { icon: <FaClock size={24} />, name: "时间", category: "time" },
    { icon: <FaSun size={24} />, name: "白天", category: "system" },
    { icon: <FaMoon size={24} />, name: "夜晚", category: "system" },
  ];

  // 复制并扩展图标集
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    ...icons[i % icons.length],
    style: i % 3, // 0: 默认, 1: 圆角, 2: 方形
  }));
};

const IconPage = () => {
  const { isDarkMode } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedIcons, setSortedIcons] = useState(generateIconItems());
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);

  // 自动轮播效果
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 排序和筛选功能
  useEffect(() => {
    let result = [...generateIconItems()];

    // 筛选分类
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    // 排序
    result.sort((a, b) => {
      return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
    });

    setSortedIcons(result);
  }, [sortOrder, activeCategory]);

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
      <div className="content-module horizontal-grid">
        {sortedIcons.map((item) => {
          // 图标样式
          const iconStyles = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            margin: "0 auto 1rem",
            backgroundColor: "rgba(108, 92, 231, 0.1)",
            color: "var(--primary)",
            borderRadius:
              item.style === 1 ? "50%" : item.style === 2 ? "4px" : "8px",
            ...(selectedIcon === item.id && {
              border: "2px solid var(--primary)",
            }),
          };

          return (
            <div
              key={item.id}
              className="horizontal-card"
              onClick={() =>
                setSelectedIcon(item.id === selectedIcon ? null : item.id)
              }
            >
              <div style={iconStyles}>{item.icon}</div>
              <div>{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconPage;
