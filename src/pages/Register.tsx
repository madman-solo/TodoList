// src/pages/Register.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store";
import { authAPI } from "../services/api";

const Register = () => {
  const { isDarkMode } = useThemeStore();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 组件挂载时清空输入框
  useEffect(() => {
    setName("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
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
    if (password !== confirmPassword) {
      setError("密码不一致");
      return;
    }

    setLoading(true);

    try {
      // 调用注册API
      await authAPI.register({ name, password });

      // 清空输入框
      setName("");
      setPassword("");
      setConfirmPassword("");
      setError("");

      // 注册成功后跳转到登录页
      alert("注册成功，请使用刚才注册的账号密码登录");
      navigate("/login");
    } catch (err) {
      setError("注册失败，用户名可能已存在");
      console.error("注册错误:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={`auth-container ${isDarkMode ? "dark-mode" : ""}`}>
      <form onSubmit={handleRegister} className="auth-form">
        <h2>注册</h2>
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
        <div>
          <label>确认密码</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "注册中..." : "注册"}
        </button>

        <div className="auth-footer">
          <p>已有账号？</p>
          <button
            type="button"
            onClick={handleGoToLogin}
            className="login-link-button"
          >
            立即登录
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
