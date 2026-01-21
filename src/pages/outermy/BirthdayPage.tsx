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
import { FaArrowLeft, FaPlus, FaBell } from "react-icons/fa";
import { useThemeStore } from "../../store";
import { useBirthdayStore } from "../../store";
import { useEffect } from "react";

const BirthdayPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { birthdays, getUpcomingBirthdays } = useBirthdayStore();

  const goBack = () => {
    navigate("/profile");
  };

  const goToCreateBirthday = () => {
    navigate("/birthday/create");
  };

  // 计算距离生日的天数
  const getDaysUntilBirthday = (dateString: string) => {
    const today = new Date();
    const birthdayDate = new Date(dateString);
    const thisYearBirthday = new Date(
      today.getFullYear(),
      birthdayDate.getMonth(),
      birthdayDate.getDate()
    );

    const diffTime = thisYearBirthday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // 获取即将到来的生日
  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <div className={`birthday-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 第一个模块：顶部导航 */}
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>生日</h2>
      </div>

      {/* 生日提醒区域 */}
      {upcomingBirthdays.length > 0 && (
        <div className="birthday-reminders">
          <h3>
            <FaBell /> 即将到来的生日
          </h3>
          {upcomingBirthdays.map((birthday) => {
            const daysUntil = getDaysUntilBirthday(birthday.date);
            return (
              <div key={birthday.id} className="reminder-item">
                <div className="reminder-avatar">{birthday.name.charAt(0)}</div>
                <div className="reminder-info">
                  <h4>{birthday.name}</h4>
                  <p>
                    {daysUntil === 0
                      ? "🎉 今天生日！"
                      : `还有 ${daysUntil} 天`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
