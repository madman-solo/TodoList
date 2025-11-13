import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useThemeStore } from "../../store";
import { useState } from "react";
const AnniversaryPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [birthday, setBirthday] = useState("");

  const goBack = () => {
    navigate("/profile");
  };

  const saveBirthday = () => {
    console.log("保存生日:", birthday);
    // 这里可以添加保存逻辑
  };

  return (
    <div className={`birthday-page ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>生日设置</h2>
      </div>

      <div className="page-content">
        <div className="input-group">
          <label>生日日期</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <button className="save-btn" onClick={saveBirthday}>
          保存
        </button>
      </div>
    </div>
  );
};

export default AnniversaryPage;
