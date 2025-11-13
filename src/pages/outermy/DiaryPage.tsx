import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaPlus } from "react-icons/fa";

const DiaryPage = () => {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goBack = () => {
    navigate("/profile");
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const goToCreateDiary = () => {
    navigate("/profile/diary/create");
  };

  return (
    <div className="diary-page">
      {/* 顶部导航 */}
      <div className="diary-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>笔记</h2>
        <button className="calendar-btn" onClick={toggleCalendar}>
          <FaCalendar size={20} />
        </button>
      </div>

      {/* 主内容区 */}
      <div className="diary-content">
        <div className="empty-state">
          <h3>回忆从第一篇日记开始</h3>
          <p>点击+创建日记</p>
        </div>

        {/* 创建按钮 */}
        <button className="create-btn" onClick={goToCreateDiary}>
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
