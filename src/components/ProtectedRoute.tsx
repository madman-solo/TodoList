import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore, checkAuthStatus } from "../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const isAuth = checkAuthStatus();

    if (!isAuth && !isAuthenticated) {
      // 如果未登录，清除状态并跳转到登录页
      logout();
      navigate("/login", { replace: true });
    }

    setIsChecking(false);
  }, [isAuthenticated, logout, navigate]);

  // 正在检查认证状态时显示加载
  if (isChecking) {
    return <div>正在验证登录状态...</div>;
  }

  // 如果未认证，不渲染子组件
  if (!isAuthenticated && !checkAuthStatus()) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
