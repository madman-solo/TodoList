import { useUserStore } from "../store";
import { useThemeStore } from "../store";
import { useCoupleStore } from "../store/coupleStore";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import socketService from "../services/socketService";
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
  const { user, isAuthenticated, logout, updateUser } = useUserStore();
  const { coupleId } = useCoupleStore();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  console.log(isAuthenticated); //一直是false

  // 【头像双向同步】监听来自情侣模式页面的头像更新
  useEffect(() => {
    if (!socketService.isConnected() || !user) return;

    const unsubscribe = socketService.subscribe((message) => {
      if (message.type === "avatar-update" && message.data) {
        const { userId, avatar } = message.data as {
          userId: string | number;
          avatar: string;
        };

        // 如果是当前用户的头像更新（从情侣模式同步过来）
        if (userId === user.id) {
          updateUser({ avatar });
          console.log("收到情侣模式头像更新，已同步到我的页面");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, updateUser]);

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

  const menuItems = [
    {
      icon: <FaImage size={20} />,
      name: "我的主题",
      path: "/background/my/themes",
    },
    {
      icon: <FaFont size={20} />,
      name: "我的字体",
      path: "/background/my/fonts",
    },
    {
      icon: <FaImage size={20} />,
      name: "我的背景",
      path: "/background/my/backgrounds",
    },
    {
      icon: <FaHeart size={20} />,
      name: "我的点赞",
      path: "/background/my/likes",
    },
    {
      icon: <FaBookmark size={20} />,
      name: "我的收藏",
      path: "/background/my/collections",
    },
    { icon: <FaShoppingCart size={20} />, name: "我的订单" },
    { icon: <FaCubes size={20} />, name: "模块混搭" },
  ];
  return (
    <div className={`my-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 个人信息区域 - 支持头像上传 */}
      <div className="profile-header">
        <div
          className="profile-avatar-wrapper"
          onClick={() => avatarInputRef.current?.click()}
          title="点击更换头像"
        >
          <img
            src={user?.avatar || "/avatars/default.jpg"}
            alt={user?.name}
            className="profile-avatar"
          />
          <div className="avatar-overlay">📷</div>
        </div>
        {/* 隐藏的文件上传input */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file || !user) return;

            // 验证文件类型和大小
            if (!file.type.startsWith("image/")) {
              alert("请选择图片文件");
              return;
            }
            if (file.size > 5 * 1024 * 1024) {
              alert("图片大小不能超过5MB");
              return;
            }

            try {
              // 转换为Base64
              const reader = new FileReader();
              reader.onloadend = async () => {
                const base64String = reader.result as string;

                // 【头像双向同步】更新本地store
                updateUser({ avatar: base64String });

                // 同步到服务器
                try {
                  await fetch(
                    `http://localhost:3001/api/users/${user.id}/avatar`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "authToken"
                        )}`,
                      },
                      body: JSON.stringify({ avatar: base64String }),
                    }
                  );

                  // 【头像双向同步】通过WebSocket通知情侣模式页面
                  if (coupleId && socketService.isConnected()) {
                    socketService.send({
                      type: "avatar-update",
                      data: {
                        userId: user.id,
                        avatar: base64String,
                      },
                    });
                    console.log("个人页面头像更新已同步到情侣模式");
                  }
                } catch (error) {
                  console.error("头像上传失败:", error);
                  alert("头像上传失败，请重试");
                }
              };
              reader.readAsDataURL(file);
            } catch (error) {
              console.error("头像处理失败:", error);
              alert("头像处理失败，请重试");
            }
          }}
        />
        <div className="profile-info">
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email || "完善个人信息"}</p>
        </div>
      </div>

      {/* 功能菜单区域 */}
      <div className="profile-menu">
        {/* {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
            {item.path && <Link to={item.path} className="menu-link" />}
          </div>
        ))} */}
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path || "#"} className="menu-link">
            <div className="menu-item">
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </div>
          </Link>
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
