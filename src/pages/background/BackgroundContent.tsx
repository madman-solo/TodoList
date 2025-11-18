// import { useState, useEffect } from "react";
// import { FaSort, FaSpinner } from "react-icons/fa";
// import { useThemeStore } from "../../store";
// import {
//   backgroundAPI,
//   type BackgroundItem,
//   type CarouselItem,
// } from "../../services/api";
// import BackgroundAnimation from "../../components/BackgroundAnimation";
// import BackgroundDetailSidebar from "../../components/BackgroundDetailSidebar";

// const BackgroundContent = () => {
//   const { isDarkMode, setBackground } = useThemeStore();
//   const [activeCarousel, setActiveCarousel] = useState(0);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [selectedItem, setSelectedItem] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
//   // 新增动画及边栏：
//   const [selectedBackground, setSelectedBackground] =
//     useState<BackgroundItem | null>(null);
//   const [showAnimation, setShowAnimation] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [animationComplete, setAnimationComplete] = useState(false);
//   // 主题详情数据结构
//   const themeDetail = selectedBackground
//     ? {
//         id: selectedBackground.id,
//         title: selectedBackground.title,
//         technique: "SVG 矢量绘图，图层叠加顺序为背景层→花卉主体层→细节描边层",
//         colorScheme: "色彩方案参考蒙赛尔色卡的'柔和绿色系'",
//         layers: [
//           { name: "背景层", description: "渐变底色，使用径向渐变创造深度感" },
//           { name: "主体层", description: "主要视觉元素，使用贝塞尔曲线绘制" },
//           { name: "细节层", description: "装饰性线条和纹理，增强视觉层次" },
//         ],
//         preview: selectedBackground.preview,
//       }
//     : null;

//   // 图层数据（用于动画）
//   const animationLayers = [
//     { type: "shape", color: "#a2d9ce", opacity: 0.7, zIndex: 1 },
//     { type: "line", color: "#1abc9c", opacity: 0.9, zIndex: 2 },
//     { type: "shape", color: "#76d7ea", opacity: 0.5, zIndex: 3 },
//   ];

//   const handleBackgroundSelect = (item: BackgroundItem) => {
//     setSelectedBackground(item);
//     setShowAnimation(true);
//     setAnimationComplete(false);
//     // 先不立即设置为背景，等动画完成
//   };

//   const handleAnimationComplete = () => {
//     setAnimationComplete(true);
//     // 动画完成后显示侧边栏
//     setTimeout(() => {
//       setShowSidebar(true);
//     }, 500);
//   };

//   const handleSetAsBackground = () => {
//     if (selectedBackground) {
//       setBackground(selectedBackground.preview);
//       setShowSidebar(false);
//     }
//   };

//   // 获取轮播数据
//   useEffect(() => {
//     const fetchCarousel = async () => {
//       try {
//         const data = await backgroundAPI.getCarousel("background");
//         setCarouselItems(data);
//       } catch (err) {
//         console.error("获取轮播数据失败:", err);
//       }
//     };

//     fetchCarousel();
//   }, []);

//   // 获取背景数据
//   useEffect(() => {
//     const fetchBackgrounds = async () => {
//       try {
//         setLoading(true);
//         const data = await backgroundAPI.getBackgrounds(
//           activeCategory !== "all" ? activeCategory : undefined
//         );
//         setBackgrounds(data);
//         setError("");
//       } catch (err) {
//         setError("加载背景失败，请稍后重试");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBackgrounds();
//   }, [activeCategory]);

//   // 自动轮播效果
//   useEffect(() => {
//     if (carouselItems.length === 0) return;

//     const interval = setInterval(() => {
//       setActiveCarousel((prev) => (prev + 1) % carouselItems.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [carouselItems.length]);

//   // 排序功能
//   useEffect(() => {
//     setBackgrounds((prev) =>
//       [...prev].sort((a, b) => {
//         return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
//       })
//     );
//   }, [sortOrder]);

//   const toggleSortOrder = () => {
//     setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
//   };

//   // const handleBackgroundSelect = (item: BackgroundItem) => {
//   //   setSelectedItem(item.id);
//   //   setBackground(item.preview); // 设置背景
//   // };

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <FaSpinner className="spinner" size={30} />
//         <p>加载背景中...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="error-container">
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()}>重试</button>
//       </div>
//     );
//   }

//   return (
//     <div className={`content-page ${isDarkMode ? "dark-mode" : "light-mode"}`}>
//       {/* 添加Canvas动画容器 */}
//       <div style={{ position: "relative", width: "100%", minHeight: "400px" }}>
//         {/* 轮播模块 */}
//         {carouselItems.length > 0 && (
//           <div className="carousel-module">
//             <div
//               className="horizontal-carousel"
//               style={{ transform: `translateX(-${activeCarousel * 100}%)` }}
//             >
//               {carouselItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="carousel-slide"
//                   style={{
//                     backgroundImage: `url("${item.image}")`,
//                     backgroundSize: "cover",
//                     backgroundPosition: "center",
//                     backgroundRepeat: "no-repeat",
//                     // 为了文字清晰，可添加半透明遮罩层（通过伪元素或渐变实现）
//                     backgroundColor: "rgba(0, 0, 0, 0.3)", // 深色遮罩，提升文字对比度
//                     backgroundBlendMode: "overlay", // 混合背景图和遮罩色
//                   }}
//                 >
//                   <h3>{item.title}</h3>
//                   <p>{item.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//         {/* 背景动画组件 */}
//         <BackgroundAnimation
//           visible={showAnimation}
//           background={selectedBackground?.preview || ""}
//           layers={animationLayers}
//           onComplete={handleAnimationComplete}
//         />
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
//           className={`nav-btn ${activeCategory === "真人" ? "active" : ""}`}
//           onClick={() => setActiveCategory("真人")}
//         >
//           真人
//         </button>
//         <button
//           className={`nav-btn ${activeCategory === "动漫" ? "active" : ""}`}
//           onClick={() => setActiveCategory("动漫")}
//         >
//           动漫
//         </button>
//         <button
//           className={`nav-btn ${activeCategory === "插画" ? "active" : ""}`}
//           onClick={() => setActiveCategory("插画")}
//         >
//           插画
//         </button>
//         <button className="sort-btn" onClick={toggleSortOrder}>
//           时间 <FaSort size={16} />
//         </button>
//       </div>

//       {/* 内容模块 */}
//       <div className="content-module vertical-grid">
//         {backgrounds.map((item) => (
//           <div
//             key={item.id}
//             className="vertical-card"
//             style={{
//               position: "relative",
//               cursor: "pointer",
//               opacity:
//                 selectedBackground?.id === item.id && showAnimation ? 0 : 1,
//               transition: "opacity 0.3s",
//             }}
//             onClick={() => handleBackgroundSelect(item)}
//           >
//             <img src={item.preview} alt={item.title} />
//             <span>{item.title}</span>
//             <div className="resolution-badge">{item.resolution}</div>
//             {selectedItem === item.id && !showAnimation && (
//               <div className="selected-indicator">✓</div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* 主题详情侧边栏 */}
//       <BackgroundDetailSidebar
//         visible={showSidebar}
//         theme={themeDetail as any}
//         onClose={() => {
//           setShowSidebar(false);
//           setShowAnimation(false);
//           setSelectedBackground(null);
//         }}
//         onSetAsBackground={handleSetAsBackground}
//       />

//       {/* 半透明遮罩 */}
//       {showSidebar && (
//         <div
//           className="sidebar-overlay"
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: " rgba(0, 0, 0, 0.5)",
//             zIndex: 99,
//           }}
//           onClick={() => setShowSidebar(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default BackgroundContent;

import { useState, useEffect } from "react";
import { FaSort, FaSpinner } from "react-icons/fa";
import { useThemeStore } from "../../store";
import {
  backgroundAPI,
  type BackgroundItem,
  type CarouselItem,
} from "../../services/api";
import BackgroundAnimation from "../../components/BackgroundAnimation";
import BackgroundDetailSidebar from "../../components/BackgroundDetailSidebar";
interface Layer {
  type: "line" | "shape" | "image";
  color?: string;
  opacity: number;
  zIndex: number;
  path?: string;
  image?: string;
}
// 定义主题详情类型
interface ThemeDetail {
  id: number;
  title: string;
  technique: string;
  colorScheme: string;
  layers: { name: string; description: string }[];
  preview: string;
}

const BackgroundContent = () => {
  const { isDarkMode, setBackground } = useThemeStore();
  const [activeCarousel, setActiveCarousel] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedItem] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  // 新增动画及边栏：
  const [selectedBackground, setSelectedBackground] =
    useState<BackgroundItem | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [, setAnimationComplete] = useState(false);

  // 主题详情数据结构
  const themeDetail: ThemeDetail | null = selectedBackground
    ? {
        id: selectedBackground.id,
        title: selectedBackground.title,
        technique: "SVG 矢量绘图，图层叠加顺序为背景层→花卉主体层→细节描边层",
        colorScheme: "色彩方案参考蒙赛尔色卡的'柔和绿色系'",
        layers: [
          { name: "背景层", description: "渐变底色，使用径向渐变创造深度感" },
          { name: "主体层", description: "主要视觉元素，使用贝塞尔曲线绘制" },
          { name: "细节层", description: "装饰性线条和纹理，增强视觉层次" },
        ],
        preview: selectedBackground.preview,
      }
    : null;

  // 图层数据（用于动画）
  const animationLayers: Layer[] = [
    { type: "shape", color: "#a2d9ce", opacity: 0.7, zIndex: 1 },
    { type: "line", color: "#1abc9c", opacity: 0.9, zIndex: 2 },
    { type: "shape", color: "#76d7ea", opacity: 0.5, zIndex: 3 },
  ];
  // 处理背景项选中事件
  const handleBackgroundSelect = (item: BackgroundItem) => {
    setSelectedBackground(item);
    setShowAnimation(true);
    setAnimationComplete(false);
    setShowSidebar(true);
  };
  // 处理动画完成事件
  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };
  // 处理"设为背景"操作
  const handleSetAsBackground = () => {
    if (selectedBackground) {
      setBackground(selectedBackground.preview);
      setShowSidebar(false);
    }
  };
  // 定义统一关闭函数：
  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setShowAnimation(false);
    setSelectedBackground(null);
  };
  // 获取轮播数据
  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const data = await backgroundAPI.getCarousel("background");
        setCarouselItems(data);
      } catch (err) {
        console.error("获取轮播数据失败:", err);
      }
    };

    fetchCarousel();
  }, []);

  // 获取背景数据
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        setLoading(true);
        const data = await backgroundAPI.getBackgrounds(
          activeCategory !== "all" ? activeCategory : undefined
        );
        setBackgrounds(data);
        setError("");
      } catch (err) {
        setError("加载背景失败，请稍后重试");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackgrounds();
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
    setBackgrounds((prev) =>
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
        <p>加载背景中...</p>
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
    <div style={{ width: "100%" }}>
      <div
        className={`content-page ${isDarkMode ? "dark-mode" : "light-mode"}`}
      >
        {/* 添加Canvas动画容器 */}
        {/* 轮播模块 */}
        {carouselItems.length > 0 && (
          <div className="carousel-module">
            <div
              className="horizontal-carousel"
              style={{ transform: `translateX(-${activeCarousel * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div
                  key={item.id}
                  className="carousel-slide"
                  style={{
                    backgroundImage: `url("${item.image}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    backgroundBlendMode: "overlay",
                  }}
                >
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* 背景动画组件 */}
        <BackgroundAnimation
          visible={showAnimation}
          background={selectedBackground?.preview || ""}
          layers={animationLayers}
          onComplete={handleAnimationComplete}
        />
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
        {backgrounds.map((item) => (
          <div
            key={item.id}
            className="vertical-card"
            style={{
              position: "relative",
              cursor: "pointer",
              transition: "opacity 0.3s",
            }}
            onClick={() => handleBackgroundSelect(item)}
          >
            <img src={item.preview} alt={item.title} />
            <span>{item.title}</span>
            <div className="resolution-badge">{item.resolution}</div>
            {selectedItem === item.id && !showAnimation && (
              <div className="selected-indicator">✓</div>
            )}
          </div>
        ))}
      </div>

      {/* 主题详情侧边栏 */}
      <BackgroundDetailSidebar
        visible={showSidebar}
        theme={themeDetail}
        onClose={handleCloseSidebar}
        onSetAsBackground={handleSetAsBackground}
      />

      {/* 半透明遮罩 */}
      {showSidebar && (
        <div
          className="sidebar-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: " rgba(0, 0, 0, 0.5)",
            zIndex: 99,
          }}
          onClick={handleCloseSidebar}
        />
      )}
    </div>
  );
};

export default BackgroundContent;
