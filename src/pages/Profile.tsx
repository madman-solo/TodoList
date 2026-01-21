/** @jsxImportSource @emotion/react */
import { Outlet, Link } from "react-router-dom";
import { css } from "@emotion/react";
import { useUserStore } from "../store";
import { useThemeStore } from "../store";
import { useCoupleStore } from "../store/coupleStore";
import { FaCog, FaQuestionCircle, FaInfoCircle } from "react-icons/fa";
import { useRef, useEffect } from "react";
import socketService from "../services/socketService";

const Profile = () => {
  const { user, isAuthenticated, logout, updateUser } = useUserStore();
  const { isDarkMode } = useThemeStore();
  const { coupleId } = useCoupleStore();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 【头像双向同步】监听来自情侣模式/我的页面的头像更新
  useEffect(() => {
    if (!socketService.isConnected() || !user) return;

    const unsubscribe = socketService.subscribe((message) => {
      if (message.type === "avatar-update" && message.data) {
        const { userId, avatar } = message.data as {
          userId: string | number;
          avatar: string;
        };

        // 如果是当前用户的头像更新
        if (userId === user.id) {
          updateUser({ avatar });
          console.log("收到头像更新，已同步到个人页面");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, updateUser]);

  // 计算创建天数（从用户注册时间开始）
  const calculateDaysSinceCreation = () => {
    if (!user?.createdAt) {
      // 如果没有注册时间，返回0或使用当前时间作为起点
      return 0;
    }
    const creationDate = new Date(user.createdAt);
    const today = new Date();
    const diffTime = today.getTime() - creationDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysSinceCreation = calculateDaysSinceCreation();

  return (
    <div css={container(isDarkMode)}>
      <div css={profileContent}>
        {/* 个人信息模块 */}
        <div css={profileCard}>
          <div css={userInfoTop}>
            <div css={avatarContainer}>
              <div
                css={avatar}
                onClick={() => avatarInputRef.current?.click()}
                style={{ cursor: "pointer" }}
                title="点击更换头像"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
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

                      // 【修复】先同步到服务器，成功后再更新本地store
                      try {
                        const response = await fetch(
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

                        if (!response.ok) {
                          throw new Error("头像上传失败");
                        }

                        // 【修复】服务器保存成功后，再更新本地store
                        updateUser({ avatar: base64String });

                        // 【头像双向同步】通过WebSocket通知其他页面
                        if (coupleId && socketService.isConnected()) {
                          socketService.send({
                            type: "avatar-update",
                            data: {
                              userId: user.id,
                              avatar: base64String,
                            },
                          });
                          console.log("个人页面头像更新已同步到其他页面");
                        }

                        alert("头像上传成功");
                      } catch (error) {
                        console.error("头像上传失败:", error);
                        alert("头像上传失败，请重试");
                        // 【修复】失败时不更新本地store，保持原头像
                      }
                    };
                    reader.readAsDataURL(file);
                  } catch (error) {
                    console.error("头像处理失败:", error);
                    alert("头像处理失败，请重试");
                  }
                }}
              />
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
                  <Link to="/login" css={authLink}>
                    登录
                  </Link>
                  <Link to="/register" css={authLink}>
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
                path: "/settings",
                icon: <FaCog size={18} />,
              },
              {
                name: "推送提醒",
                path: "/notifications",
                icon: <FaCog size={18} />,
              },
              {
                name: "日记",
                path: "/diary",
                icon: <FaCog size={18} />,
              },
              {
                name: "专注",
                path: "/focus",
                icon: <FaCog size={18} />,
              },
              {
                name: "生日",
                path: "/birthday",
                icon: <FaCog size={18} />,
              },
              {
                name: "纪念日",
                path: "/anniversary",
                icon: <FaCog size={18} />,
              },
              {
                name: "日程管理",
                path: "/schedule",
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
