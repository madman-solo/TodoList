import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useThemeStore } from "../../store";
import { useState } from "react";
const PreferenceSettings = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);

  const goBack = () => {
    navigate("/profile");
  };

  return (
    <div className={`preference-settings ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 */}
      <div className="settings-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>偏好设置</h2>
      </div>

      {/* 设置内容 */}
      <div className="settings-container">
        <div className="settings-box">
          <ul className="settings-list">
            <li className="setting-item">
              <span>按键交互音效</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={() => setSoundEnabled(!soundEnabled)}
                />
                <span className="slider round"></span>
              </label>
            </li>
            <li className="divider"></li>
            <li className="setting-item">
              <span>按键震动</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={vibrationEnabled}
                  onChange={() => setVibrationEnabled(!vibrationEnabled)}
                />
                <span className="slider round"></span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSettings;
