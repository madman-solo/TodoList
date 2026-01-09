/** @jsxImportSource @emotion/react */

import { Outlet, Link, useLocation } from "react-router-dom";
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useThemeStore } from "../store";
import CoupleHeader from "../components/CoupleHeader";

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
      isSpecial: boolean;
    }>
  >([]);

  // 生成梵高风格的星空效果 - 更多更密集的星星
  useEffect(() => {
    const stars = Array.from({ length: 200 }, (_, index) => ({
      top: `${Math.random() * 100}vh`,
      left: `${Math.random() * 100}vw`,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      delay: Math.random() * 8,
      // 每10个星星中有1个是特殊的旋转星星
      isSpecial: index % 10 === 0,
    }));
    setStarPositions(stars);
  }, []);

  return (
    <div className={`couple-mode ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 梵高风格星空背景 - 旋转的星星和月亮 */}
      <div className="starry-sky">
        {starPositions.map((star, index) => (
          <div
            key={index}
            className={star.isSpecial ? "heart-star" : "star"}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          >
            {star.isSpecial ? "⭐" : ""}
          </div>
        ))}
      </div>

      {/* 梵高风格的漩涡云朵动画 */}
      <div className="clouds-container">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>

      {/* 情侣头像和名字显示在右上方 */}
      <div css={coupleHeaderContainer}>
        <CoupleHeader />
      </div>

      {/* 优化后的横向导航栏 */}
      <nav css={coupleNav}>
        <div className="nav-container">
          <Link to="table" css={navLink(location.pathname.endsWith("table"))}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">表格样式</span>
          </Link>
          <Link
            to=""
            css={navLink(
              location.pathname.endsWith("couple") &&
                !location.pathname.includes("/couple/")
            )}
          >
            <span className="nav-icon">📝</span>
            <span className="nav-text">未来清单</span>
          </Link>
          <Link to="/wish" css={navLink(location.pathname.endsWith("wish"))}>
            <span className="nav-icon">💫</span>
            <span className="nav-text">心愿清单</span>
          </Link>
          <Link
            to="/memories"
            css={navLink(location.pathname.endsWith("memories"))}
          >
            <span className="nav-icon">📸</span>
            <span className="nav-text">回忆相册</span>
          </Link>
          <Link to="games" css={navLink(location.pathname.endsWith("games"))}>
            <span className="nav-icon">🎮</span>
            <span className="nav-text">情侣小游戏</span>
          </Link>
          <Link to="/" className="back-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">返回首页</span>
          </Link>
        </div>
      </nav>

      <main css={mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

// 优化后的横向导航栏样式
const coupleNav = css`
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  .nav-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;

    @media (max-width: 768px) {
      gap: 0.6rem;
    }

    @media (max-width: 480px) {
      gap: 0.5rem;
    }
  }

  .back-link {
    margin-left: 1rem;

    @media (max-width: 768px) {
      margin-left: 0;
      width: 100%;
      order: 10;
    }
  }
`;

const navLink = (isActive: boolean) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  padding: 0.3rem 0.9rem;
  border-radius: 7px;
  color: #3b3a37ff;
  font-weight: 500;
  background: ${isActive
    ? "rgba(249, 224, 118, 0.35)"
    : "rgba(255, 255, 255, 0.12)"};
  border: 1px solid
    ${isActive ? "rgba(249, 224, 118, 0.6)" : "rgba(255, 255, 255, 0.25)"};
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 90px;
  box-shadow: ${isActive
    ? "0 6px 20px rgba(249, 224, 118, 0.25), 0 0 0 1px rgba(249, 224, 118, 0.1) inset"
    : "0 3px 12px rgba(0, 0, 0, 0.15)"};

  .nav-icon {
    font-size: 1.4rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    transition: transform 0.3s ease;

    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }

  .nav-text {
    font-size: 0.85rem;
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }

  &:hover {
    background: rgba(249, 224, 118, 0.45);
    border-color: rgba(249, 224, 118, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 224, 118, 0.35);
    color: #fff;

    .nav-icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(0);
  }

  &.back-link {
    background: rgba(231, 76, 60, 0.25);
    border-color: rgba(231, 76, 60, 0.5);

    &:hover {
      background: rgba(231, 76, 60, 0.4);
      border-color: rgba(231, 76, 60, 0.7);
      box-shadow: 0 8px 25px rgba(231, 76, 60, 0.35);
    }
  }

  @media (max-width: 768px) {
    padding: 0.85rem 0.75rem;
    min-width: 80px;
  }

  @media (max-width: 480px) {
    padding: 0.7rem 0.6rem;
    min-width: 70px;
    gap: 0.3rem;
  }
`;

// 情侣头像容器样式
const coupleHeaderContainer = css`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.4rem;
  }
`;

const mainContent = css`
  margin-top: 1rem;
  position: relative;
  z-index: 5;
  padding: 0 1rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

export default CoupleMode;
