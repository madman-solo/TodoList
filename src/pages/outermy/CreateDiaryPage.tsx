// CreateDiaryPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const goBack = () => {
    navigate("/profile/diary");
  };

  const saveDiary = () => {
    // 保存逻辑
    console.log("保存日记:", { title, content, date: new Date() });
    navigate("/profile/diary");
  };

  return (
    <div className="create-diary-page">
      {/* 顶部导航 */}
      <div className="diary-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>写日记</h2>
        <button className="save-btn" onClick={saveDiary}>
          <FaSave size={20} />
        </button>
      </div>

      {/* 日记编辑区 */}
      <div className="diary-editor">
        <input
          type="text"
          placeholder="请输入标题..."
          className="diary-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="请输入内容..."
          className="diary-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default CreateDiaryPage;
