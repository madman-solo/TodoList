import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaBriefcase,
  FaBook,
  FaHome,
  FaUsers,
  FaStar,
  FaTrash,
  FaEdit,
  FaCheck,
  FaBell,
  FaFileImport,
} from "react-icons/fa";
import { useThemeStore, useScheduleStore } from "../../store";
import { useState } from "react";

const SchedulePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleComplete,
    getTodaySchedules,
    getUpcomingSchedules,
    importSchedules,
  } = useScheduleStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [newSchedule, setNewSchedule] = useState({
    title: "",
    date: "",
    time: "",
    endTime: "",
    category: "life" as "work" | "study" | "life" | "meeting" | "other",
    priority: "medium" as "high" | "medium" | "low",
    description: "",
    reminder: true,
    location: "",
  });

  const goBack = () => {
    navigate("/profile");
  };

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "work":
        return <FaBriefcase />;
      case "study":
        return <FaBook />;
      case "life":
        return <FaHome />;
      case "meeting":
        return <FaUsers />;
      default:
        return <FaStar />;
    }
  };

  // 获取分类颜色
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "#3498db";
      case "study":
        return "#9b59b6";
      case "life":
        return "#e74c3c";
      case "meeting":
        return "#f39c12";
      default:
        return "#95a5a6";
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#e74c3c";
      case "medium":
        return "#f39c12";
      case "low":
        return "#95a5a6";
      default:
        return "#95a5a6";
    }
  };

  // 添加或更新日程
  const handleSaveSchedule = () => {
    if (!newSchedule.title || !newSchedule.date) {
      alert("请填写标题和日期");
      return;
    }

    if (editingSchedule) {
      // 更新现有日程
      updateSchedule(editingSchedule.id, newSchedule);
      setEditingSchedule(null);
    } else {
      // 添加新日程
      const schedule: Schedule = {
        id: Date.now().toString(),
        ...newSchedule,
        completed: false,
      };
      addSchedule(schedule);
    }

    setShowAddModal(false);
    resetForm();
  };

  // 重置表单
  const resetForm = () => {
    setNewSchedule({
      title: "",
      date: "",
      time: "",
      endTime: "",
      category: "life",
      priority: "medium",
      description: "",
      reminder: true,
      location: "",
    });
  };

  // 编辑日程
  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setNewSchedule({
      title: schedule.title,
      date: schedule.date,
      time: schedule.time || "",
      endTime: schedule.endTime || "",
      category: schedule.category,
      priority: schedule.priority,
      description: schedule.description || "",
      reminder: schedule.reminder,
      location: schedule.location || "",
    });
    setShowAddModal(true);
  };

  // 删除日程
  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除这个日程吗？")) {
      deleteSchedule(id);
    }
  };

  // 获取今天的日程
  const todaySchedules = getTodaySchedules();
  const upcomingSchedules = getUpcomingSchedules();

  return (
    <div className={`schedule-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 */}
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>日程管理</h2>
        <button className="import-btn" onClick={() => setShowImportModal(true)}>
          <FaFileImport size={18} />
        </button>
      </div>

      {/* 今日日程提醒 */}
      {todaySchedules.length > 0 && (
        <div className="today-schedules">
          <h3>
            <FaBell /> 今日日程 ({todaySchedules.length})
          </h3>
          <div className="today-list">
            {todaySchedules.map((schedule) => (
              <div
                key={schedule.id}
                className={`today-item ${
                  schedule.completed ? "completed" : ""
                }`}
              >
                <div
                  className="today-icon"
                  style={{ color: getCategoryColor(schedule.category) }}
                >
                  {getCategoryIcon(schedule.category)}
                </div>
                <div className="today-info">
                  <h4>{schedule.title}</h4>
                  <p>
                    {schedule.time && `${schedule.time}`}
                    {schedule.endTime && ` - ${schedule.endTime}`}
                    {schedule.location && ` · ${schedule.location}`}
                  </p>
                </div>
                <button
                  className="complete-btn"
                  onClick={() => toggleComplete(schedule.id)}
                >
                  <FaCheck />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 日程列表 */}
      <div className="page-content">
        {schedules.length === 0 ? (
          <div className="empty-state">
            <p>暂无日程安排</p>
            <p className="empty-hint">点击右下角按钮添加第一个日程</p>
          </div>
        ) : (
          <div className="schedules-list">
            {schedules
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((schedule) => (
                <div
                  key={schedule.id}
                  className={`schedule-card ${
                    schedule.completed ? "completed" : ""
                  }`}
                >
                  <div
                    className="card-icon"
                    style={{ background: getCategoryColor(schedule.category) }}
                  >
                    {getCategoryIcon(schedule.category)}
                  </div>
                  <div className="card-content">
                    <div className="card-header">
                      <h3>{schedule.title}</h3>
                      <span
                        className="priority-badge"
                        style={{
                          background: getPriorityColor(schedule.priority),
                        }}
                      >
                        {schedule.priority === "high"
                          ? "高"
                          : schedule.priority === "medium"
                          ? "中"
                          : "低"}
                      </span>
                    </div>
                    <p className="schedule-date">
                      {new Date(schedule.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      {schedule.time && ` ${schedule.time}`}
                      {schedule.endTime && ` - ${schedule.endTime}`}
                    </p>
                    {schedule.location && (
                      <p className="schedule-location">
                        📍 {schedule.location}
                      </p>
                    )}
                    {schedule.description && (
                      <p className="schedule-desc">{schedule.description}</p>
                    )}
                  </div>
                  <div className="card-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(schedule)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="action-btn complete-btn"
                      onClick={() => toggleComplete(schedule.id)}
                    >
                      <FaCheck />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* 添加按钮 */}
        <button
          className="floating-action-btn"
          onClick={() => {
            setEditingSchedule(null);
            resetForm();
            setShowAddModal(true);
          }}
        >
          <FaPlus size={24} />
        </button>
      </div>

      {/* 添加/编辑日程弹窗 */}
      {showAddModal && (
        <>
          <div className="overlay" onClick={() => setShowAddModal(false)} />
          <div className="schedule-modal">
            <h3>{editingSchedule ? "编辑日程" : "添加日程"}</h3>

            <div className="form-group">
              <label>标题 *</label>
              <input
                type="text"
                placeholder="例如：团队会议"
                value={newSchedule.title}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, title: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>日期 *</label>
                <input
                  type="date"
                  value={newSchedule.date}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, date: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>开始时间</label>
                <input
                  type="time"
                  value={newSchedule.time}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, time: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>结束时间</label>
                <input
                  type="time"
                  value={newSchedule.endTime}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label>分类</label>
              <div className="category-buttons">
                {[
                  { value: "work", label: "工作", icon: <FaBriefcase /> },
                  { value: "study", label: "学习", icon: <FaBook /> },
                  { value: "life", label: "生活", icon: <FaHome /> },
                  { value: "meeting", label: "会议", icon: <FaUsers /> },
                  { value: "other", label: "其他", icon: <FaStar /> },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    className={`category-btn ${
                      newSchedule.category === cat.value ? "active" : ""
                    }`}
                    onClick={() =>
                      setNewSchedule({
                        ...newSchedule,
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
              <label>优先级</label>
              <div className="priority-buttons">
                {[
                  { value: "high", label: "高", color: "#e74c3c" },
                  { value: "medium", label: "中", color: "#f39c12" },
                  { value: "low", label: "低", color: "#95a5a6" },
                ].map((pri) => (
                  <button
                    key={pri.value}
                    className={`priority-btn ${
                      newSchedule.priority === pri.value ? "active" : ""
                    }`}
                    style={{
                      borderColor: pri.color,
                      color:
                        newSchedule.priority === pri.value ? "#fff" : pri.color,
                      background:
                        newSchedule.priority === pri.value
                          ? pri.color
                          : "transparent",
                    }}
                    onClick={() =>
                      setNewSchedule({
                        ...newSchedule,
                        priority: pri.value as any,
                      })
                    }
                  >
                    {pri.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>地点（可选）</label>
              <input
                type="text"
                placeholder="例如：会议室A"
                value={newSchedule.location}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, location: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>描述（可选）</label>
              <textarea
                placeholder="添加一些描述..."
                value={newSchedule.description}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
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
                  checked={newSchedule.reminder}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
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
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSchedule(null);
                  resetForm();
                }}
              >
                取消
              </button>
              <button className="confirm-btn" onClick={handleSaveSchedule}>
                {editingSchedule ? "保存" : "添加"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 导入日程弹窗 */}
      {showImportModal && (
        <>
          <div className="overlay" onClick={() => setShowImportModal(false)} />
          <div className="import-modal">
            <h3>导入日程</h3>
            <p className="import-hint">
              支持导入 JSON 格式的日程文件。文件格式示例：
            </p>
            <pre className="import-example">
              {`[
  {
    "title": "团队会议",
    "date": "2026-01-15",
    "time": "14:00",
    "endTime": "15:30",
    "category": "meeting",
    "priority": "high",
    "location": "会议室A",
    "description": "讨论项目进度",
    "reminder": true
  }
]`}
            </pre>
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const content = event.target?.result as string;
                      const importedSchedules = JSON.parse(content);

                      if (!Array.isArray(importedSchedules)) {
                        alert("文件格式错误：应为数组格式");
                        return;
                      }

                      // 验证并添加 ID 和 completed 字段
                      const validSchedules = importedSchedules.map(
                        (s: any) => ({
                          id: Date.now().toString() + Math.random(),
                          title: s.title || "未命名日程",
                          date:
                            s.date || new Date().toISOString().split("T")[0],
                          time: s.time || "",
                          endTime: s.endTime || "",
                          category: s.category || "other",
                          priority: s.priority || "medium",
                          description: s.description || "",
                          reminder:
                            s.reminder !== undefined ? s.reminder : true,
                          completed: false,
                          location: s.location || "",
                        })
                      );

                      importSchedules(validSchedules);
                      alert(`成功导入 ${validSchedules.length} 条日程`);
                      setShowImportModal(false);
                    } catch (error) {
                      alert("文件解析失败，请检查文件格式");
                      console.error(error);
                    }
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowImportModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SchedulePage;
