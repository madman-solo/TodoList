import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBell, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useThemeStore, useBirthdayStore, useAnniversaryStore, useScheduleStore } from "../../store";
import { useState, useEffect } from "react";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { getUpcomingBirthdays } = useBirthdayStore();
  const { getUpcomingAnniversaries } = useAnniversaryStore();
  const { getUpcomingSchedules } = useScheduleStore();

  const [notifications, setNotifications] = useState({
    birthday: true,
    anniversary: true,
    schedule: true,
    diary: false,
  });

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    // 获取即将到来的事件
    const birthdays = getUpcomingBirthdays();
    const anniversaries = getUpcomingAnniversaries();
    const schedules = getUpcomingSchedules();

    const events = [
      ...birthdays.map(b => ({ type: 'birthday', data: b })),
      ...anniversaries.map(a => ({ type: 'anniversary', data: a })),
      ...schedules.map(s => ({ type: 'schedule', data: s })),
    ];

    setUpcomingEvents(events);
  }, [getUpcomingBirthdays, getUpcomingAnniversaries, getUpcomingSchedules]);

  const goBack = () => {
    navigate("/profile");
  };

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return '🎂';
      case 'anniversary':
        return '💝';
      case 'schedule':
        return '📅';
      default:
        return '📌';
    }
  };

  return (
    <div className={`notifications-page ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>推送提醒</h2>
      </div>

      <div className="page-content">
        {/* 提醒设置 */}
        <div className="notification-settings">
          <h3 className="section-title">
            <FaBell /> 提醒设置
          </h3>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">生日提醒</span>
              <span className="setting-desc">提前7天提醒好友生日</span>
            </div>
            <button
              className="toggle-btn"
              onClick={() => toggleNotification('birthday')}
            >
              {notifications.birthday ? <FaToggleOn size={32} /> : <FaToggleOff size={32} />}
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">纪念日提醒</span>
              <span className="setting-desc">提前30天提醒重要纪念日</span>
            </div>
            <button
              className="toggle-btn"
              onClick={() => toggleNotification('anniversary')}
            >
              {notifications.anniversary ? <FaToggleOn size={32} /> : <FaToggleOff size={32} />}
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">日程提醒</span>
              <span className="setting-desc">提前提醒未完成的日程</span>
            </div>
            <button
              className="toggle-btn"
              onClick={() => toggleNotification('schedule')}
            >
              {notifications.schedule ? <FaToggleOn size={32} /> : <FaToggleOff size={32} />}
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">日记提醒</span>
              <span className="setting-desc">每日提醒记录心情</span>
            </div>
            <button
              className="toggle-btn"
              onClick={() => toggleNotification('diary')}
            >
              {notifications.diary ? <FaToggleOn size={32} /> : <FaToggleOff size={32} />}
            </button>
          </div>
        </div>

        {/* 即将到来的事件 */}
        <div className="upcoming-events">
          <h3 className="section-title">即将到来的事件</h3>
          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <p>暂无即将到来的事件</p>
            </div>
          ) : (
            <div className="events-list">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="event-card">
                  <span className="event-icon">{getEventIcon(event.type)}</span>
                  <div className="event-info">
                    <span className="event-title">
                      {event.type === 'birthday' && event.data.name}
                      {event.type === 'anniversary' && event.data.title}
                      {event.type === 'schedule' && event.data.title}
                    </span>
                    <span className="event-date">
                      {event.data.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
