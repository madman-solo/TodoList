// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaCalendar, FaPlus } from "react-icons/fa";

// const DiaryPage = () => {
//   const navigate = useNavigate();
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const goBack = () => {
//     navigate("/profile");
//   };

//   const toggleCalendar = () => {
//     setShowCalendar(!showCalendar);
//   };

//   const goToCreateDiary = () => {
//     navigate("/profile/diary/create");
//   };

//   return (
//     <div className="diary-page">
//       {/* 顶部导航 */}
//       <div className="diary-header">
//         <button className="back-btn" onClick={goBack}>
//           <FaArrowLeft size={20} />
//         </button>
//         <h2>笔记</h2>
//         <button className="calendar-btn" onClick={toggleCalendar}>
//           <FaCalendar size={20} />
//         </button>
//       </div>

//       {/* 主内容区 */}
//       <div className="diary-content">
//         <div className="empty-state">
//           <h3>回忆从第一篇日记开始</h3>
//           <p>点击+创建日记</p>
//         </div>

//         {/* 创建按钮 */}
//         <button className="create-btn" onClick={goToCreateDiary}>
//           <FaPlus size={24} />
//         </button>
//       </div>

//       {/* 日历弹窗 */}
//       {showCalendar && (
//         <>
//           <div className="overlay" onClick={toggleCalendar}></div>
//           <div className="calendar-modal">
//             <h3>选择日期</h3>
//             <input
//               type="date"
//               value={selectedDate.toISOString().split("T")[0]}
//               onChange={(e) => setSelectedDate(new Date(e.target.value))}
//             />
//             <button className="confirm-btn" onClick={toggleCalendar}>
//               确认
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default DiaryPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaPlus } from "react-icons/fa";
import { useThemeStore } from "../../store";

// 定义日记数据类型
interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
}

const DiaryPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaries, setDiaries] = useState<Diary[]>([]);

  // 从本地存储加载日记
  useEffect(() => {
    const savedDiaries = localStorage.getItem("diaries");
    if (savedDiaries) {
      setDiaries(JSON.parse(savedDiaries));
    }
  }, []);

  const goBack = () => {
    navigate("/profile");
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const goToCreateDiary = () => {
    navigate("/diary/create");
  };

  return (
    <div className={`diary-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 - 第一个模块 */}
      <div className="diary-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>笔记</h2>
        <button className="calendar-btn" onClick={toggleCalendar}>
          <FaCalendar size={20} />
        </button>
      </div>

      {/* 主内容区 - 第二个模块 */}
      <div className="diary-content">
        {diaries.length === 0 ? (
          <div className="empty-state">
            <h3>回忆从第一篇日记开始</h3>
            <p>点击'+'创建日记</p>
          </div>
        ) : (
          <div className="diaries-list">
            {diaries.map((diary) => (
              <div key={diary.id} className="diary-item">
                <h4>{diary.title}</h4>
                <p className="diary-excerpt">
                  {diary.content.substring(0, 50)}...
                </p>
                <p className="diary-date">
                  {new Date(diary.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 右下角添加按钮 */}
        <button className="floating-action-btn" onClick={goToCreateDiary}>
          <FaPlus size={24} />
        </button>
      </div>

      {/* 日历弹窗 */}
      {showCalendar && (
        <>
          <div className="overlay" onClick={toggleCalendar}></div>
          <div className="calendar-modal">
            <h3>选择日期</h3>
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
            <button className="confirm-btn" onClick={toggleCalendar}>
              确认
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DiaryPage;
