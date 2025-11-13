// src/pages/couple/HeartContainer.tsx (新增文件)
/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useState } from "react";

const HeartContainer = () => {
  const [size, setSize] = useState(200);

  // 响应式爱心大小
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSize(150);
      } else {
        setSize(200);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div css={heartWrapper}>
      <div
        css={heart}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          animation: `beat ${1.5 + Math.random() * 0.5}s infinite`,
        }}
      >
        {/* 爱心内部闪光效果 */}
        <div css={heartGlow} />
      </div>
    </div>
  );
};

// 样式
const heartWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  position: relative;

  @keyframes beat {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const heart = css`
  position: relative;
  background-color: #e74c3c;
  transform: rotate(-45deg);
  box-shadow: 0 0 30px rgba(231, 76, 60, 0.6);

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #e74c3c;
    border-radius: 50%;
  }

  &::before {
    top: -50%;
    left: 0;
  }

  &::after {
    top: 0;
    right: -50%;
  }
`;

const heartGlow = css`
  position: absolute;
  width: 60%;
  height: 60%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  top: 20%;
  left: 20%;
  animation: pulse 2s infinite alternate;

  @keyframes pulse {
    from {
      opacity: 0.2;
      transform: scale(0.8);
    }
    to {
      opacity: 0.5;
      transform: scale(1);
    }
  }
`;

export default HeartContainer;
