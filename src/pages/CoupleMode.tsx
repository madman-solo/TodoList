// // src/pages/CoupleMode.tsx
// import { Link } from "react-router-dom";

// const CoupleMode = () => {
//   return (
//     <div className="couple-mode">
//       <h2>情侣模式</h2>
//       <p>这里是情侣模式的功能实现</p>
//       <Link to="/">返回首页</Link>
//     </div>
//   );
// };

// export default CoupleMode;
/** @jsxImportSource @emotion/react */

import { Outlet, Link, useLocation } from "react-router-dom";
import { css } from "@emotion/react";

const CoupleMode = () => {
  const location = useLocation();

  return (
    <div css={container}>
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
      </nav>
      <main css={mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

// 样式
const container = css`
  padding: 20px;
  min-height: 100vh;
`;

const coupleNav = css`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #ffe6ea;
  border-radius: 8px;
  margin-bottom: 20px;
`;

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
