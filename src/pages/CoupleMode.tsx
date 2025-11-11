/** @jsxImportSource @emotion/react */

import { Outlet, Link, useLocation } from "react-router-dom";
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useThemeStore } from "../store";

const CoupleMode = () => {
  const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const [starPositions, setStarPositions] = useState<
    Array<{
      top: string;
      left: string;
      size: number;
      opacity: number;
      delay: number;
    }>
  >([]);
  // 生成星空效果
  useEffect(() => {
    const stars = Array.from({ length: 150 }, () => ({
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 5,
    }));
    setStarPositions(stars);
  }, []);
  return (
    // <div css={container}>
    <div className={`couple-mode ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 星空背景 */}
      <div className="starry-sky">
        {starPositions.map((star, index) => (
          <div
            key={index}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <nav css={coupleNav}>
        <Link to="table" css={navLink(location.pathname.endsWith("table"))}>
          表格样式
        </Link>
        <Link
          to=""
          css={navLink(
            location.pathname.endsWith("couple") &&
              !location.pathname.includes("/couple/")
          )}
        >
          未来清单
        </Link>
        <Link to="wish" css={navLink(location.pathname.endsWith("wish"))}>
          心愿清单
        </Link>
        <Link to="games" css={navLink(location.pathname.endsWith("games"))}>
          情侣小游戏
        </Link>
        <Link to="/" className="back-link">
          返回首页
        </Link>
      </nav>
      <main css={mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

// 样式

const coupleNav = css`
  position: relative;
  z-index: 10;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
`;

// todo:这里没删
const navLink = (isActive: boolean) => css`
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  color: #333;
  font-weight: 500;
  background: ${isActive ? "#ffccd5" : "transparent"};
  transition: all 0.3s;

  &:hover {
    background: #ffccd5;
  }
`;

const mainContent = css`
  margin-top: 20px;
`;

export default CoupleMode;
