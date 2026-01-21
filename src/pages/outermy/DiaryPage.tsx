import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendar,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSun,
  FaCloud,
  FaCloudRain,
} from "react-icons/fa";
import { useThemeStore, useDiaryStore } from "../../store";

const DiaryPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { diaries, deleteDiary, searchDiaries } = useDiaryStore();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filterByDate, setFilterByDate] = useState(false);

  const goBack = () => {
    navigate("/profile");
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const goToCreateDiary = () => {
    navigate("/diary/create");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除这篇日记吗？")) {
      deleteDiary(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/diary/edit/${id}`);
  };

  const getWeatherIcon = (weather?: string) => {
    switch (weather) {
      case "sunny":
        return <FaSun style={{ color: "#f39c12" }} />;
      case "cloudy":
        return <FaCloud style={{ color: "#95a5a6" }} />;
      case "rainy":
        return <FaCloudRain style={{ color: "#3498db" }} />;
      default:
        return null;
    }
  };

  // 过滤日记：支持搜索和日期筛选
  const filteredDiaries = diaries.filter((diary) => {
    // 搜索关键词过滤
    if (searchKeyword) {
      const lowerKeyword = searchKeyword.toLowerCase();
      const matchesSearch =
        diary.title.toLowerCase().includes(lowerKeyword) ||
        diary.content.toLowerCase().includes(lowerKeyword) ||
        diary.tags?.some((tag) => tag.toLowerCase().includes(lowerKeyword));
      if (!matchesSearch) return false;
    }

    // 日期过滤
    if (filterByDate && selectedDate) {
      const diaryDate = new Date(diary.date).toDateString();
      const filterDate = selectedDate.toDateString();
      if (diaryDate !== filterDate) return false;
    }

    return true;
  });

  return (
    <div className={`diary-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 */}
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>日记本</h2>
        <div className="header-actions">
          <button className="icon-btn" onClick={() => setShowSearch(!showSearch)}>
            <FaSearch size={18} />
          </button>
          <button className="icon-btn" onClick={toggleCalendar}>
            <FaCalendar size={18} />
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      {showSearch && (
        <div className="search-bar">
          <input
            type="text"
            placeholder="搜索日记标题、内容或标签..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      )}

      {/* 主内容区 */}
      <div className="page-content">
        {filteredDiaries.length === 0 ? (
          <div className="empty-state">
            <h3>📖 回忆从第一篇日记开始</h3>
            <p>点击右下角按钮创建日记</p>
          </div>
        ) : (
          <div className="diaries-list">
            {filteredDiaries
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((diary) => (
                <div
                  key={diary.id}
                  className="diary-card"
                  onClick={() => handleEdit(diary.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="diary-header">
                    <div className="diary-meta">
                      <span className="diary-date">
                        {new Date(diary.date).toLocaleDateString("zh-CN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {diary.mood && <span className="diary-mood">{diary.mood}</span>}
                      {diary.weather && (
                        <span className="diary-weather">{getWeatherIcon(diary.weather)}</span>
                      )}
                    </div>
                    <div className="diary-actions">
                      <button
                        type="button"
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(diary.id);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(diary.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="diary-content">
                    <h3>{diary.title}</h3>
                    <p className="diary-excerpt">
                      {diary.content.length > 100
                        ? `${diary.content.substring(0, 100)}...`
                        : diary.content}
                    </p>
                    {diary.tags && diary.tags.length > 0 && (
                      <div className="diary-tags">
                        {diary.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 添加按钮 */}
        <button className="floating-action-btn" onClick={goToCreateDiary}>
          <FaPlus size={24} />
        </button>
      </div>

      {/* 日历弹窗 */}
      {showCalendar && (
        <>
          <div className="overlay" onClick={toggleCalendar} />
          <div className="calendar-modal">
            <h3>按日期筛选</h3>
            <input
              type="date"
              value={selectedDate?.toISOString().split("T")[0] || ""}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
            <div className="modal-buttons">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setFilterByDate(false);
                  setSelectedDate(null);
                  toggleCalendar();
                }}
              >
                清除筛选
              </button>
              <button
                type="button"
                className="confirm-btn"
                onClick={() => {
                  if (selectedDate) {
                    setFilterByDate(true);
                  }
                  toggleCalendar();
                }}
              >
                确认
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiaryPage;
