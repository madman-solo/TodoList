/** @jsxImportSource @emotion/react */
import { Outlet, Link } from "react-router-dom";
import { css } from "@emotion/react";
import { useUserStore } from "../store";
import { useThemeStore } from "../store";
import { FaCog, FaQuestionCircle, FaInfoCircle } from "react-icons/fa";
// import Login from "./Login";
// import Register from "./Register";

const Profile = () => {
  const { user, isAuthenticated, logout } = useUserStore();
  const { isDarkMode } = useThemeStore();
  // const navigate = useNavigate();

  // 计算创建天数（示例）
  const creationDate = new Date();
  creationDate.setDate(creationDate.getDate() - 30); // 假设30天前创建
  const daysSinceCreation = Math.floor(
    (new Date().getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div css={container(isDarkMode)}>
      <div css={profileContent}>
        {/* 个人信息模块 */}
        <div css={profileCard}>
          <div css={userInfoTop}>
            <div css={avatarContainer}>
              <div css={avatar}>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div css={userDetails}>
              <h2>{user?.name || "访客"}</h2>
              <p css={userId}>ID: {user?.id || "未登录"}</p>
            </div>
            <div css={authActions}>
              {isAuthenticated ? (
                <button onClick={logout} css={authButton}>
                  退出
                </button>
              ) : (
                <>
                  <Link to="login" css={authLink}>
                    登录
                  </Link>
                  <Link to="register" css={authLink}>
                    注册
                  </Link>
                </>
              )}
            </div>
          </div>

          <div css={userStats}>
            <div css={statItem}>
              <span css={statValue}>{daysSinceCreation}</span>
              <span css={statLabel}>创建天数</span>
            </div>
            <div css={statItem}>
              <span css={statValue}>0</span>
              <span css={statLabel}>我的好友</span>
            </div>
          </div>
        </div>

        {/* 个性化设置模块 */}
        <div css={settingsCard}>
          <h3 css={sectionTitle}>个性化设置</h3>
          <div css={settingsGrid}>
            {[
              { name: "视图", path: "/view", icon: <FaCog size={18} /> },
              { name: "背景", path: "/background", icon: <FaCog size={18} /> },
              { name: "情侣模式", path: "/couple", icon: <FaCog size={18} /> },
              {
                name: "偏好设置",
                path: "/profile/settings",
                icon: <FaCog size={18} />,
              },
              {
                name: "推送提醒",
                path: "/profile/notifications",
                icon: <FaCog size={18} />,
              },
              {
                name: "日记",
                path: "/profile/diary",
                icon: <FaCog size={18} />,
              },
              {
                name: "专注",
                path: "/profile/focus",
                icon: <FaCog size={18} />,
              },
              {
                name: "生日",
                path: "/profile/birthday",
                icon: <FaCog size={18} />,
              },
              {
                name: "纪念日",
                path: "/profile/anniversary",
                icon: <FaCog size={18} />,
              },
              {
                name: "课程表",
                path: "/profile/schedule",
                icon: <FaCog size={18} />,
              },
            ].map((item) => (
              <Link key={item.name} to={item.path} css={settingItem}>
                <span css={settingIcon}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 帮助与关于模块 */}
        <div css={infoCard}>
          <div css={infoGrid}>
            <Link to="/profile/help" css={infoItem}>
              <FaQuestionCircle size={24} css={infoIcon} />
              <div>
                <h4>帮助和反馈</h4>
                <p css={infoDesc}>获取帮助或提交反馈</p>
              </div>
            </Link>
            <Link to="/profile/about" css={infoItem}>
              <FaInfoCircle size={24} css={infoIcon} />
              <div>
                <h4>关于我们</h4>
                <p css={infoDesc}>了解应用信息</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 子路由出口（登录/注册页面） */}
      <Outlet />
    </div>
  );
};

// 样式定义 - 清新简约风格
const container = (isDarkMode: boolean) => css`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  color: ${isDarkMode ? "#f5f5f5" : "#333"};
`;

const profileContent = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const profileCard = css`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const userInfoTop = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const avatarContainer = css`
  flex-shrink: 0;
`;

const avatar = css`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #6c5ce7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
`;

const userDetails = css`
  flex: 1;
`;

const userId = css`
  color: #888;
  font-size: 0.9rem;
  margin-top: 0.2rem;
`;

const authActions = css`
  display: flex;
  gap: 0.5rem;
`;

const authButton = css`
  padding: 0.5rem 1rem;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #5a49d1;
  }
`;

const authLink = css`
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #6c5ce7;
  border: 1px solid #6c5ce7;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #f0e9ff;
  }
`;

const userStats = css`
  display: flex;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
`;

const statItem = css`
  display: flex;
  flex-direction: column;
`;

const statValue = css`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6c5ce7;
`;

const statLabel = css`
  font-size: 0.9rem;
  color: #888;
`;

const sectionTitle = css`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #555;
`;

const settingsCard = css`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const settingsGrid = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
`;

const settingItem = css`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f9f9f9;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;

  &:hover {
    background: #f0e9ff;
    transform: translateY(-2px);
  }
`;

const settingIcon = css`
  color: #6c5ce7;
  width: 24px;
  text-align: center;
`;

const infoCard = css`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const infoGrid = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const infoItem = css`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  padding: 1rem;
  border-radius: 12px;
  background: #f9f9f9;
  transition: all 0.2s;

  &:hover {
    background: #f0e9ff;
  }
`;

const infoIcon = css`
  color: #6c5ce7;
`;

const infoDesc = css`
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.2rem;
`;

export default Profile;
