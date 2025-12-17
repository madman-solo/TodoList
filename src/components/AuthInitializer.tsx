import { useEffect } from "react";
import { useUserStore, checkAuthStatus } from "../store";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useUserStore();

  useEffect(() => {
    // 应用启动时检查登录状态
    const isAuth = checkAuthStatus();

    // 如果localStorage中没有有效的认证信息，但store中显示已认证，则清除状态
    if (!isAuth && isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  return <>{children}</>;
};

export default AuthInitializer;
