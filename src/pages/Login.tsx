// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store";

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUserStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 实际应用中这里应该有API调用验证
    login({ id: Date.now().toString(), name });
    navigate("/");
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>登录</h2>
      <div>
        <label>用户名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">登录</button>
    </form>
  );
};

export default Login;
