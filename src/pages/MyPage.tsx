import { useUserStore } from "../store";
import { useThemeStore } from "../store";
import { Link } from "react-router-dom";
import {
  // FaUser,
  FaImage,
  FaFont,
  FaHeart,
  FaBookmark,
  FaShoppingCart,
  FaCubes,
  FaSignOutAlt,
} from "react-icons/fa";

const MyPage = () => {
  const { isDarkMode } = useThemeStore();
  const { user, isAuthenticated, logout } = useUserStore();

  // 如果未登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className={`my-page ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="login-prompt">
          <h3>请先登录</h3>
          <Link to="/login" className="login-btn">
            登录
          </Link>
        </div>
      </div>
    );
  }

  // 功能菜单
  const menuItems = [
    {
      icon: <FaImage size={20} />,
      name: "我的主题",
      path: "/background/theme",
    },
    { icon: <FaFont size={20} />, name: "我的字体" },
    { icon: <FaImage size={20} />, name: "我的背景" },
    { icon: <FaHeart size={20} />, name: "我的点赞" },
    { icon: <FaBookmark size={20} />, name: "我的收藏" },
    { icon: <FaShoppingCart size={20} />, name: "我的订单" },
    { icon: <FaCubes size={20} />, name: "模块混搭" },
  ];

  return (
    <div className={`my-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 个人信息区域 */}
      <div className="profile-header">
        <img
          src={user?.avatar || "/avatars/default.jpg"}
          alt={user?.name}
          className="profile-avatar"
        />
        <div className="profile-info">
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email || "完善个人信息"}</p>
        </div>
      </div>

      {/* 功能菜单区域 */}
      <div className="profile-menu">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
            {item.path && <Link to={item.path} className="menu-link" />}
          </div>
        ))}
      </div>

      {/* 退出按钮 */}
      <button className="logout-btn" onClick={logout}>
        <FaSignOutAlt size={18} />
        <span>退出登录</span>
      </button>

      {/* 底部文字 */}
      <div className="footer-text">谢谢您选择支持我们</div>
    </div>
  );
};

export default MyPage;
