// src/pages/CoupleMode.tsx
import { Link } from "react-router-dom";

const CoupleMode = () => {
  return (
    <div className="couple-mode">
      <h2>情侣模式</h2>
      <p>这里是情侣模式的功能实现</p>
      <Link to="/">返回首页</Link>
    </div>
  );
};

export default CoupleMode;
