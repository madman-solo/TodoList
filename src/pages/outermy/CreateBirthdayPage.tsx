import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useThemeStore } from "../../store";

// 定义生日数据类型
interface Birthday {
  id: string;
  name: string;
  gender: "male" | "female" | "other";
  date: string;
  reminder: boolean;
  phone?: string;
}

const CreateBirthdayPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    gender: "other" as "male" | "female" | "other",
    date: "",
    reminder: true,
    phone: "",
  });
  const [isValid, setIsValid] = useState(false);

  // 验证表单
  const validateForm = () => {
    return formData.name.trim() !== "" && formData.date !== "";
  };

  // 监听表单变化
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 检测表单有效性
  // useState(() => {
  //   const checkValidity = () => {
  //     setIsValid(validateForm());
  //   };
  //   checkValidity();
  //   // 可以添加防抖处理
  // }, [formData]);
  useEffect(() => {
    setIsValid(validateForm());
  }, [formData]);

  const goBack = () => {
    navigate("/birthday");
  };

  const saveBirthday = () => {
    if (!validateForm()) return;

    const newBirthday: Birthday = {
      id: Date.now().toString(),
      ...formData,
    };

    // 保存到本地存储
    const savedBirthdays = localStorage.getItem("birthdays") || "[]";
    const birthdays = JSON.parse(savedBirthdays) as Birthday[];
    birthdays.push(newBirthday);
    localStorage.setItem("birthdays", JSON.stringify(birthdays));

    navigate("/birthday");
  };

  return (
    <div className={`create-birthday-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 */}
      <div className="page-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>新建生日</h2>
        <button
          className="save-btn"
          onClick={saveBirthday}
          disabled={!isValid}
          style={{
            opacity: isValid ? 1 : 0.6, // 修复5：添加视觉反馈
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          添加
        </button>
      </div>

      {/* 表单区域 */}
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="name">姓名</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="请输入姓名"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">性别</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">生日日期</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reminder">
            <input
              type="checkbox"
              id="reminder"
              name="reminder"
              checked={formData.reminder}
              onChange={handleChange}
            />
            生日提醒
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="phone">手机号码（选填）</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="请输入手机号码"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateBirthdayPage;
