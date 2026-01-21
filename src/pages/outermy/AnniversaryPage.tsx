import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaHeart, FaRing, FaUsers, FaBriefcase, FaStar, FaTrash, FaBell } from "react-icons/fa";
import { useThemeStore, useAnniversaryStore } from "../../store";
import { useState } from "react";

const AnniversaryPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { anniversaries, addAnniversary, deleteAnniversary, getDaysPassed, getUpcomingAnniversaries } = useAnniversaryStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnniversary, setNewAnniversary] = useState({
    title: "",
    date: "",
    category: "love" as "love" | "wedding" | "friendship" | "work" | "other",
    description: "",
    reminder: true,
  });

  const goBack = () => {
    navigate("/profile");
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "love":
        return <FaHeart />;
      case "wedding":
        return <FaRing />;
      case "friendship":
        return <FaUsers />;
      case "work":
        return <FaBriefcase />;
      default:
        return <FaStar />;
    }
  };

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "love":
        return "#e74c3c";
      case "wedding":
        return "#f39c12";
      case "friendship":
        return "#3498db";
      case "work":
        return "#9b59b6";
      default:
        return "#95a5a6";
    }
  };

  // 添加纪念日
  const handleAddAnniversary = () => {
    if (!newAnniversary.title || !newAnniversary.date) {
      alert("请填写标题和日期");
      return;
    }

    const anniversary = {
      id: Date.now().toString(),
      ...newAnniversary,
    };

    addAnniversary(anniversary);
    setShowAddModal(false);
    setNewAnniversary({
      title: "",
      date: "",
      category: "love",
      description: "",
      reminder: true,
    });
  };

  // 删除纪念日
  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除这个纪念日吗？")) {
      deleteAnniversary(id);
    }
  };

  // 计算距离下次纪念日的天数
  const getDaysUntilNext = (dateString: string) => {
    const today = new Date();
    const anniversaryDate = new Date(dateString);
    const thisYearAnniversary = new Date(
      today.getFullYear(),
      anniversaryDate.getMonth(),
      anniversaryDate.getDate()
    );

    // 如果今年的纪念日已过，计算明年的
    if (thisYearAnniversary < today) {
      thisYearAnniversary.setFullYear(today.getFullYear() + 1);
    }

    const diffTime = thisYearAnniversary.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  // 获取即将到来的纪念日
  const upcomingAnniversaries = getUpcomingAnniversaries();

  return (
    <div className={`anniversary-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 */}
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>纪念日</h2>
      </div>

      {/* 即将到来的纪念日提醒 */}
      {upcomingAnniversaries.length > 0 && (
        <div className="anniversary-reminders">
          <h3>
            <FaBell /> 即将到来的纪念日
          </h3>
          {upcomingAnniversaries.map((anniversary) => {
            const daysUntil = getDaysUntilNext(anniversary.date);
            return (
              <div key={anniversary.id} className="reminder-item">
                <div
                  className="reminder-icon"
                  style={{ color: getCategoryColor(anniversary.category) }}
                >
                  {getCategoryIcon(anniversary.category)}
                </div>
                <div className="reminder-info">
                  <h4>{anniversary.title}</h4>
                  <p>
                    {daysUntil === 0
                      ? "🎉 就是今天！"
                      : `还有 ${daysUntil} 天`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 纪念日列表 */}
      <div className="page-content">
        {anniversaries.length === 0 ? (
          <div className="empty-state">
            <p>暂无纪念日记录</p>
            <p className="empty-hint">点击右下角按钮添加第一个纪念日</p>
          </div>
        ) : (
          <div className="anniversaries-list">
            {anniversaries.map((anniversary) => {
              const daysPassed = getDaysPassed(anniversary.date);
              const daysUntilNext = getDaysUntilNext(anniversary.date);

              return (
                <div key={anniversary.id} className="anniversary-card">
                  <div
                    className="card-icon"
                    style={{ background: getCategoryColor(anniversary.category) }}
                  >
                    {getCategoryIcon(anniversary.category)}
                  </div>
                  <div className="card-content">
                    <h3>{anniversary.title}</h3>
                    <p className="anniversary-date">
                      {new Date(anniversary.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {anniversary.description && (
                      <p className="anniversary-desc">{anniversary.description}</p>
                    )}
                    <div className="anniversary-stats">
                      <span className="days-passed">已经 {daysPassed} 天</span>
                      {daysUntilNext > 0 && (
                        <span className="days-until">距下次 {daysUntilNext} 天</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="delete-anniversary-btn"
                    onClick={() => handleDelete(anniversary.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 添加按钮 */}
        <button
          className="floating-action-btn"
          onClick={() => setShowAddModal(true)}
        >
          <FaPlus size={24} />
        </button>
      </div>

      {/* 添加纪念日弹窗 */}
      {showAddModal && (
        <>
          <div className="overlay" onClick={() => setShowAddModal(false)} />
          <div className="anniversary-modal">
            <h3>添加纪念日</h3>

            <div className="form-group">
              <label>标题</label>
              <input
                type="text"
                placeholder="例如：恋爱纪念日"
                value={newAnniversary.title}
                onChange={(e) =>
                  setNewAnniversary({ ...newAnniversary, title: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>日期</label>
              <input
                type="date"
                value={newAnniversary.date}
                onChange={(e) =>
                  setNewAnniversary({ ...newAnniversary, date: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>分类</label>
              <div className="category-buttons">
                {[
                  { value: "love", label: "恋爱", icon: <FaHeart /> },
                  { value: "wedding", label: "婚姻", icon: <FaRing /> },
                  { value: "friendship", label: "友谊", icon: <FaUsers /> },
                  { value: "work", label: "工作", icon: <FaBriefcase /> },
                  { value: "other", label: "其他", icon: <FaStar /> },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    className={`category-btn ${
                      newAnniversary.category === cat.value ? "active" : ""
                    }`}
                    onClick={() =>
                      setNewAnniversary({
                        ...newAnniversary,
                        category: cat.value as any,
                      })
                    }
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>描述（可选）</label>
              <textarea
                placeholder="添加一些描述..."
                value={newAnniversary.description}
                onChange={(e) =>
                  setNewAnniversary({
                    ...newAnniversary,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={newAnniversary.reminder}
                  onChange={(e) =>
                    setNewAnniversary({
                      ...newAnniversary,
                      reminder: e.target.checked,
                    })
                  }
                />
                <span>开启提醒</span>
              </label>
            </div>

            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
              <button className="confirm-btn" onClick={handleAddAnniversary}>
                添加
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnniversaryPage;
