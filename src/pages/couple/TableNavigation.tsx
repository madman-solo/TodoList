/** @jsxImportSource @emotion/react */
import React from "react";
import { css } from "@emotion/react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const TableNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 导航项配置
  const navItems = [
    { id: "my-tables", label: "我的表格", path: "/couple/table/my-tables" },
    { id: "store", label: "表格商店", path: "/couple/table/store" },
    { id: "activity", label: "活跃度", path: "/couple/table/activity" },
  ];

  // 判断当前激活的导航项
  const getActiveNav = () => {
    const currentPath = location.pathname;

    // 如果是 /couple/table 根路径，默认显示 my-tables
    if (currentPath === "/couple/table" || currentPath === "/couple/table/") {
      return "my-tables";
    }

    const activeItem = navItems.find((item) => currentPath.includes(item.id));
    console.log(activeItem); //表格商店返回的是 undefined？因为路径是 /couple/table/store，而不是 /couple/table/table-store，刚才把id写错了
    return activeItem?.id || "my-tables";
  };

  const activeNav = getActiveNav();

  // 如果是根路径，自动导航到 my-tables
  React.useEffect(() => {
    if (
      location.pathname === "/couple/table" ||
      location.pathname === "/couple/table/"
    ) {
      navigate("/couple/table/my-tables", { replace: true });
    }
  }, [location.pathname, navigate]);

  // 处理导航点击
  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div css={styles.container}>
      {/* 导航栏 */}
      <div css={styles.navBar}>
        {navItems.map((item) => (
          <button
            key={item.id}
            css={[
              styles.navButton,
              activeNav === item.id && styles.navButtonActive,
            ]}
            onClick={() => handleNavClick(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div css={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

const styles = {
  container: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
  `,
  navBar: css`
    display: flex;
    gap: 8px;
    padding: 20px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-bottom: 2px solid #e0e0e0;
  `,
  navButton: css`
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    color: #666;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      color: #ff6b9d;
      background: rgba(255, 107, 157, 0.1);
    }

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 3px;
      background: #ff6b9d;
      transition: width 0.3s ease;
    }
  `,
  navButtonActive: css`
    color: #ff6b9d;
    background: rgba(255, 107, 157, 0.15);
    font-weight: 600;

    &::after {
      width: 80%;
    }
  `,
  content: css`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  `,
};

export default TableNavigation;
