import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";
import { useThemeStore } from "../store";
import { authAPI } from "../services/api";

const Login = () => {
  const { isDarkMode } = useThemeStore();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useUserStore();
  const navigate = useNavigate();

  // 组件挂载时清空输入框
  useEffect(() => {
    setName("");
    setPassword("");
    setError("");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 表单校验
    if (!name.trim()) {
      setError("用户名不能为空");
      return;
    }
    if (!password.trim()) {
      setError("密码不能为空");
      return;
    }
    if (password.length < 6) {
      setError("密码长度不能少于6位");
      return;
    }

    setLoading(true);

    try {
      // 调用认证API
      const response = await authAPI.login({ name, password });

      // 保存认证令牌
      localStorage.setItem("authToken", response.token);

      // 登录到本地存储
      login({
        id: response.user.id,
        name: response.user.name,
        password: response.user.password,
      });

      // 清空输入框
      setName("");
      setPassword("");
      setError("");

      // 跳转到主页
      navigate("/");
    } catch (err) {
      setError("登录失败，请检查用户名和密码");
      console.error("登录错误:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className={`auth-container ${isDarkMode ? "dark-mode" : ""}`}>
      <form onSubmit={handleLogin} className="auth-form">
        <h2>登录</h2>
        {error && <div className="error-message">{error}</div>}
        <div>
          <label>用户名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label>密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "登录中..." : "登录"}
        </button>

        <div className="auth-footer">
          <p>没有账号？</p>
          <button
            type="button"
            onClick={handleGoToRegister}
            className="register-link-button"
          >
            立即注册
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
