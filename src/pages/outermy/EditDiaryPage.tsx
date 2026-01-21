import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaSmile,
  FaSun,
  FaCloud,
  FaCloudRain,
  FaTag,
  FaImage,
  FaTimes,
  FaBold,
  FaPalette,
  FaFont,
} from "react-icons/fa";
import { useThemeStore, useDiaryStore } from "../../store";

const EditDiaryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useThemeStore();
  const { updateDiary, getDiaryById } = useDiaryStore();

  // 加载现有日记
  const existingDiary = id ? getDiaryById(id) : null;

  const [title, setTitle] = useState(existingDiary?.title || "");
  const [content, setContent] = useState(existingDiary?.content || "");
  const [mood, setMood] = useState(existingDiary?.mood || "");
  const [weather, setWeather] = useState(existingDiary?.weather || "");
  const [tags, setTags] = useState<string[]>(existingDiary?.tags || []);
  const [images, setImages] = useState<string[]>(existingDiary?.images || []);
  const [tagInput, setTagInput] = useState("");
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showWeatherPicker, setShowWeatherPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);
  const isComposingRef = useRef(false);

  // 同步初始内容到编辑器
  useEffect(() => {
    if (editorRef.current && existingDiary) {
      editorRef.current.innerHTML = existingDiary.content || "";
    }
  }, [existingDiary]);

  const moods = ["😊", "😢", "😡", "😴", "🤔", "😍", "😎", "🥳", "😌", "🤗", "😭", "🥰"];
  const weathers = [
    { value: "sunny", icon: <FaSun />, label: "晴天" },
    { value: "cloudy", icon: <FaCloud />, label: "多云" },
    { value: "rainy", icon: <FaCloudRain />, label: "雨天" },
  ];
  const colors = ["#e8b4d9", "#ffb6c1", "#ffc8a2", "#a8e6cf", "#ffd3b6", "#ffaaa5", "#b4a7d6", "#f39c12"];
  const fonts = ["默认", "宋体", "楷体", "黑体", "微软雅黑", "Arial"];

  // 检测未保存的更改
  useEffect(() => {
    if (existingDiary) {
      const hasChanges =
        title !== existingDiary.title ||
        content !== existingDiary.content ||
        mood !== existingDiary.mood ||
        weather !== existingDiary.weather ||
        JSON.stringify(tags) !== JSON.stringify(existingDiary.tags) ||
        JSON.stringify(images) !== JSON.stringify(existingDiary.images);
      setHasUnsavedChanges(hasChanges);
    }
  }, [title, content, mood, weather, tags, images, existingDiary]);

  // 如果日记不存在，返回列表页
  useEffect(() => {
    if (!existingDiary) {
      alert("日记不存在");
      navigate("/diary");
    }
  }, [existingDiary, navigate]);

  const goBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("有未保存的更改，确定要离开吗？")) {
        navigate("/diary");
      }
    } else {
      navigate("/diary");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // 保存当前选区
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedSelectionRef.current = selection.getRangeAt(0);
    }
  };

  // 恢复选区
  const restoreSelection = () => {
    const selection = window.getSelection();
    if (selection && savedSelectionRef.current) {
      selection.removeAllRanges();
      selection.addRange(savedSelectionRef.current);
    }
  };

  // 富文本编辑功能 - 使用 document.execCommand 实现真正的富文本编辑
  const applyTextStyle = (style: string, value?: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    // 恢复之前保存的选区
    if (savedSelectionRef.current) {
      try {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(savedSelectionRef.current.cloneRange());
        }
      } catch (e) {
        console.error("恢复选区失败:", e);
      }
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
      alert("请先选中要编辑的文字");
      return;
    }

    // 确保编辑器获得焦点
    editor.focus();

    // 应用样式
    try {
      switch (style) {
        case "bold":
          document.execCommand('bold', false);
          break;
        case "color":
          if (value) {
            document.execCommand('foreColor', false, value);
          }
          break;
        case "font":
          if (value) {
            document.execCommand('fontName', false, value);
          }
          break;
      }

      // 更新内容状态
      setTimeout(() => {
        if (editorRef.current) {
          setContent(editorRef.current.innerHTML);
        }
      }, 0);
    } catch (e) {
      console.error("应用样式失败:", e);
    }

    // 清除保存的选区
    savedSelectionRef.current = null;
  };

  // 处理输入法开始
  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  // 处理输入法结束
  const handleCompositionEnd = () => {
    isComposingRef.current = false;
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  // 处理编辑器内容变化
  const handleContentChange = () => {
    // 如果正在使用输入法，不更新状态
    if (isComposingRef.current) return;

    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const saveDiary = () => {
    if (!title.trim() && !content.trim()) {
      alert("请至少填写标题或内容");
      return;
    }

    if (!id || !existingDiary) {
      alert("日记ID不存在");
      return;
    }

    const now = new Date().toISOString();
    const diaryData = {
      title: title.trim() || "无标题日记",
      content: content.trim(),
      mood,
      weather,
      tags,
      images,
      updatedAt: now,
    };

    updateDiary(id, diaryData);
    setHasUnsavedChanges(false);
    alert("保存成功！");
    navigate("/diary");
  };

  if (!existingDiary) {
    return null;
  }

  return (
    <div className={`create-diary-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 */}
      <div className="diary-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>编辑日记</h2>
        <button
          className="save-btn"
          onClick={saveDiary}
          disabled={!hasUnsavedChanges}
          style={{ opacity: hasUnsavedChanges ? 1 : 0.5 }}
        >
          <FaSave size={20} />
        </button>
      </div>

      {/* 日记编辑区 */}
      <div className="diary-editor">
        {/* 日期显示 */}
        <div className="diary-date-display">
          <span>
            {new Date(existingDiary.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* 标题输入 */}
        <input
          type="text"
          placeholder="请输入标题..."
          className="diary-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 心情和天气选择器 */}
        <div className="diary-meta-selector">
          <div className="meta-item">
            <button
              className="meta-btn"
              onClick={() => setShowMoodPicker(!showMoodPicker)}
            >
              <FaSmile />
              <span>{mood || "心情"}</span>
            </button>
            {showMoodPicker && (
              <div className="mood-picker">
                {moods.map((m) => (
                  <button
                    key={m}
                    className={`mood-option ${mood === m ? "selected" : ""}`}
                    onClick={() => {
                      setMood(m);
                      setShowMoodPicker(false);
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="meta-item">
            <button
              className="meta-btn"
              onClick={() => setShowWeatherPicker(!showWeatherPicker)}
            >
              {weather ? (
                weathers.find((w) => w.value === weather)?.icon
              ) : (
                <FaSun />
              )}
              <span>
                {weather
                  ? weathers.find((w) => w.value === weather)?.label
                  : "天气"}
              </span>
            </button>
            {showWeatherPicker && (
              <div className="weather-picker">
                {weathers.map((w) => (
                  <button
                    key={w.value}
                    className={`weather-option ${
                      weather === w.value ? "selected" : ""
                    }`}
                    onClick={() => {
                      setWeather(w.value);
                      setShowWeatherPicker(false);
                    }}
                  >
                    {w.icon}
                    <span>{w.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 富文本编辑工具栏 */}
        <div className="text-formatting-toolbar">
          <button
            type="button"
            className="format-btn"
            onClick={() => applyTextStyle("bold")}
            title="加粗"
          >
            <FaBold />
          </button>
          <button
            type="button"
            className="format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              setShowColorPicker(!showColorPicker);
            }}
            title="文字颜色"
          >
            <FaPalette />
          </button>
          {showColorPicker && (
            <div className="color-picker-dropdown">
              {colors.map((color) => (
                <button
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    applyTextStyle("color", color);
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
          <button
            type="button"
            className="format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              saveSelection();
              setShowFontPicker(!showFontPicker);
            }}
            title="字体样式"
          >
            <FaFont />
          </button>
          {showFontPicker && (
            <div className="font-picker-dropdown">
              {fonts.map((font) => (
                <button
                  key={font}
                  className="font-option"
                  onClick={() => {
                    applyTextStyle("font", font);
                    setShowFontPicker(false);
                  }}
                >
                  {font}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 内容输入 - 使用 contentEditable 实现富文本编辑 */}
        <div
          ref={editorRef}
          contentEditable
          className="diary-editor-content"
          onInput={handleContentChange}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          suppressContentEditableWarning
          data-placeholder="记录今天的心情..."
        />

        {/* 图片上传和预览 */}
        <div className="images-section">
          <label className="image-upload-btn">
            <FaImage />
            <span>添加图片</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
          {images.length > 0 && (
            <div className="images-preview">
              {images.map((img, index) => (
                <div key={index} className="image-item">
                  <img src={img} alt={`预览 ${index + 1}`} />
                  <button
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 标签输入 */}
        <div className="tags-section">
          <div className="tags-header">
            <FaTag className="tags-icon" />
            <span className="tags-title">标签</span>
          </div>
          <div className="tags-input-wrapper">
            <input
              type="text"
              className="tags-input-field"
              placeholder="输入标签后按回车或点击添加..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button type="button" className="tags-add-btn" onClick={handleAddTag}>
              添加
            </button>
          </div>
          {tags.length > 0 && (
            <div className="tags-list">
              {tags.map((tag, index) => (
                <span key={index} className="tag-item">
                  <span className="tag-text">#{tag}</span>
                  <button
                    type="button"
                    className="tag-remove-btn"
                    onClick={() => handleRemoveTag(tag)}
                    aria-label="删除标签"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDiaryPage;
