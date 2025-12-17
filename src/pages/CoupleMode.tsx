/** @jsxImportSource @emotion/react */

import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { css } from "@emotion/react";
import { useState, useEffect } from "react";
import { useThemeStore } from "../store";
import { useCoupleStore } from "../store/coupleStore";
import CoupleHeader from "../components/CoupleHeader";
import socketService from "../services/socketService";

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
  padding: 2rem 1rem;

  .nav-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    @media (max-width: 768px) {
      gap: 0.8rem;
    }

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 0.6rem;
    }
  }

  .back-link {
    margin-top: 1rem;
    order: 10; /* 确保返回按钮在最后 */

    @media (max-width: 480px) {
      margin-top: 0.5rem;
      order: 0; /* 在移动端放在最前面 */
    }
  }
`;

const navLink = (isActive: boolean) => css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 1.2rem 1rem;
  border-radius: 15px;
  color: #f0e6d6;
  font-weight: 500;
  background: ${isActive
    ? "rgba(249, 224, 118, 0.3)"
    : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${isActive ? "rgba(249, 224, 118, 0.5)" : "rgba(255, 255, 255, 0.2)"};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-height: 80px;
  width: auto;
  box-shadow: ${isActive
    ? "0 8px 25px rgba(249, 224, 118, 0.2)"
    : "0 4px 15px rgba(0, 0, 0, 0.1)"};

  .nav-icon {
    font-size: 1.5rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
  }

  .nav-text {
    font-size: 0.9rem;
    text-align: center;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 0.8rem;
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }

  &:hover {
    background: rgba(249, 224, 118, 0.4);
    border-color: rgba(249, 224, 118, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(249, 224, 118, 0.3);
    color: #fff;
  }

  &.back-link {
    background: rgba(231, 76, 60, 0.2);
    border-color: rgba(231, 76, 60, 0.4);
    max-width: 200px;

    &:hover {
      background: rgba(231, 76, 60, 0.4);
      border-color: rgba(231, 76, 60, 0.6);
    }
  }

  @media (max-width: 768px) {
    padding: 1rem 0.8rem;
    min-height: 70px;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 0.6rem;
    min-height: 60px;
    gap: 0.3rem;
  }
`;

// 情侣头像容器样式
const coupleHeaderContainer = css`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.3rem;
  }
`;

const mainContent = css`
  margin-top: 20px;
  position: relative;
  z-index: 5;
`;

export default CoupleMode;
