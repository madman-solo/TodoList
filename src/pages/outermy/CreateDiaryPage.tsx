// // CreateDiaryPage.tsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaSave } from "react-icons/fa";

// const CreateDiaryPage = () => {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");

//   const goBack = () => {
//     navigate("/profile/diary");
//   };

//   const saveDiary = () => {
//     // 保存逻辑
//     console.log("保存日记:", { title, content, date: new Date() });
//     navigate("/profile/diary");
//   };

//   return (
//     <div className="create-diary-page">
//       {/* 顶部导航 */}
//       <div className="diary-header">
//         <button className="back-btn" onClick={goBack}>
//           <FaArrowLeft size={20} />
//         </button>
//         <h2>写日记</h2>
//         <button className="save-btn" onClick={saveDiary}>
//           <FaSave size={20} />
//         </button>
//       </div>

//       {/* 日记编辑区 */}
//       <div className="diary-editor">
//         <input
//           type="text"
//           placeholder="请输入标题..."
//           className="diary-title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//         <textarea
//           placeholder="请输入内容..."
//           className="diary-textarea"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         ></textarea>
//       </div>
//     </div>
//   );
// };

// export default CreateDiaryPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaEllipsisV,
  FaBold,
  FaItalic,
  FaTextHeight,
  FaImage,
  FaFont,
} from "react-icons/fa";
import { useThemeStore } from "../../store";
// 定义日记数据类型
interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  coverImage?: string;
}

const CreateDiaryPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { isDarkMode } = useThemeStore();

  // 从本地存储加载日记（如果是编辑模式）
  useEffect(() => {
    // 这里可以添加编辑现有日记的逻辑
  }, []);

  const goBack = () => {
    // 如果有内容，保存到本地存储
    if (title.trim() || content.trim() || coverImage) {
      const newDiary: Diary = {
        id: Date.now().toString(),
        title: title.trim() || "无标题笔记",
        content: content.trim(),
        date: new Date().toISOString(),
        coverImage,
      };

      const savedDiaries = localStorage.getItem("diaries") || "[]";
      const diaries = JSON.parse(savedDiaries) as Diary[];
      diaries.push(newDiary);
      localStorage.setItem("diaries", JSON.stringify(diaries));
    }
    navigate("/diary");
  };

  const saveDiary = () => {
    const newDiary: Diary = {
      id: Date.now().toString(),
      title: title.trim() || "无标题笔记",
      content: content.trim(),
      date: new Date().toISOString(),
      coverImage,
    };

    const savedDiaries = localStorage.getItem("diaries") || "[]";
    const diaries = JSON.parse(savedDiaries) as Diary[];
    diaries.push(newDiary);
    localStorage.setItem("diaries", JSON.stringify(diaries));
    navigate("/diary");
  };

  const handleChangeCover = () => {
    // 实际项目中这里会打开文件选择器
    setCoverImage("https://picsum.photos/800/400?random=" + Math.random());
    setShowOptions(false);
  };

  const handleShare = () => {
    alert("分享功能开发中...");
    setShowOptions(false);
  };

  const applyFormat = (format: string) => {
    // 简单的文本格式化处理
    let selectedText, newContent;

    // 模拟文本选择处理
    if (window.getSelection) {
      selectedText = window.getSelection()?.toString() || "";
      if (selectedText) {
        switch (format) {
          case "bold":
            newContent = content.replace(selectedText, `**${selectedText}**`);
            break;
          case "italic":
            newContent = content.replace(selectedText, `*${selectedText}*`);
            break;
          default:
            newContent = content;
        }
        setContent(newContent);
      }
    }
    setShowFormatting(false);
  };

  return (
    <div className={`create-diary-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶层导航栏 - 第一个模块 */}
      <div className="diary-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>写日记</h2>
        <button
          className="options-btn"
          onClick={() => setShowOptions(!showOptions)}
        >
          <FaEllipsisV size={20} />
        </button>
      </div>

      {/* 选项弹框 */}
      {showOptions && (
        <>
          <div className="overlay" onClick={() => setShowOptions(false)}></div>
          <div className="options-modal">
            <ul>
              <li onClick={handleChangeCover}>
                <FaImage size={16} className="option-icon" />
                更换封面
              </li>
              <li onClick={handleShare}>
                <FaShareAlt size={16} className="option-icon" />
                分享笔记
              </li>
            </ul>
          </div>
        </>
      )}

      {/* 封面图 */}
      {coverImage && (
        <div className="diary-cover">
          <img src={coverImage} alt="日记封面" />
        </div>
      )}

      {/* 第二个模块：标题和正文输入 */}
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
          rows={15}
        ></textarea>
      </div>

      {/* 底部选择栏 - 第三个模块 */}
      <div className="formatting-toolbar">
        <button
          className="format-btn"
          onClick={() => applyFormat("bold")}
          title="加粗"
        >
          <FaBold size={18} />
        </button>
        <button
          className="format-btn"
          onClick={() => applyFormat("italic")}
          title="斜体"
        >
          <FaItalic size={18} />
        </button>
        <button
          className="format-btn"
          onClick={() => setShowFormatting(!showFormatting)}
          title="字体大小"
        >
          <FaTextHeight size={18} />
        </button>
        <button
          className="format-btn"
          onClick={handleChangeCover}
          title="添加图片"
        >
          <FaImage size={18} />
        </button>
        <button className="format-btn" onClick={() => {}} title="字体选择">
          <FaFont size={18} />
        </button>
        <button className="save-diary-btn" onClick={saveDiary}>
          <FaSave size={18} />
          保存
        </button>
      </div>
    </div>
  );
};

export default CreateDiaryPage;
