// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";
// import { useThemeStore } from "../../store";
// import { useState } from "react";

// const BirthdayPage = () => {
//   const navigate = useNavigate();
//   const { isDarkMode } = useThemeStore();
//   const [birthday, setBirthday] = useState("");

//   const goBack = () => {
//     navigate("/profile");
//   };

//   const saveBirthday = () => {
//     console.log("保存生日:", birthday);
//     // 这里可以添加保存逻辑
//   };

//   return (
//     <div className={`birthday-page ${isDarkMode ? "dark-mode" : ""}`}>
//       <div className="page-header">
//         <button className="back-btn" onClick={goBack}>
//           <FaArrowLeft size={20} />
//         </button>
//         <h2>生日设置</h2>
//       </div>

//       <div className="page-content">
//         <div className="input-group">
//           <label>生日日期</label>
//           <input
//             type="date"
//             value={birthday}
//             onChange={(e) => setBirthday(e.target.value)}
//           />
//         </div>
//         <button className="save-btn" onClick={saveBirthday}>
//           保存
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BirthdayPage;

import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useThemeStore } from "../../store";
import { useState, useEffect } from "react";

// 定义生日数据类型
interface Birthday {
  id: string;
  name: string;
  gender: "male" | "female" | "other";
  date: string;
  reminder: boolean;
  phone?: string;
}

const BirthdayPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  // 从本地存储加载生日数据
  useEffect(() => {
    const savedBirthdays = localStorage.getItem("birthdays");
    if (savedBirthdays) {
      setBirthdays(JSON.parse(savedBirthdays));
    }
  }, []);

  const goBack = () => {
    navigate("/profile");
  };

  const goToCreateBirthday = () => {
    navigate("/birthday/create");
  };

  return (
    <div className={`birthday-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 第一个模块：顶部导航 */}
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>生日</h2>
      </div>

      {/* 第二个模块：生日列表或提示 */}
      <div className="page-content">
        {birthdays.length === 0 ? (
          <div className="empty-state">
            <p>当前无生日提醒</p>
          </div>
        ) : (
          <div className="birthdays-list">
            {birthdays.map((birthday) => (
              <div key={birthday.id} className="birthday-item">
                <div className="avatar">{birthday.name.charAt(0)}</div>
                <div className="birthday-info">
                  <h4>{birthday.name}</h4>
                  <p>
                    {new Date(birthday.date).toLocaleDateString("zh-CN", {
                      month: "long",
                      day: "numeric",
                    })}
                    {birthday.reminder && (
                      <span className="reminder-indicator">提醒已设置</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 右下角添加按钮 */}
        <button className="floating-action-btn" onClick={goToCreateBirthday}>
          <FaPlus size={24} />
        </button>
      </div>
    </div>
  );
};

export default BirthdayPage;
