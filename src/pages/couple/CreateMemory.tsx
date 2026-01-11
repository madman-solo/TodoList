import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { useThemeStore } from "../../store";
// todo：在创建相册页面内点击移动到，选择一个文件夹，再次回到该创建相册页面时内容不会消失，同时该相册会被放进该文件夹下，在回忆相册的页面中点击该文件夹可以看到该相册。
interface Album {
  id: string;
  name: string;
  date: string;
  folderId: string;
  coverImage?: string;
}

const CreateMemory = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const [albumName, setAlbumName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [albumId, setAlbumId] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [editableContent, setEditableContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  // 获取当前URL的参数对象
  const params = new URLSearchParams(window.location.search);
  // 获取当前时间
  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString());

    // 生成唯一ID
    setAlbumId(Date.now().toString());
    if (params.has("albumId")) {
      const saved = localStorage.getItem("pageInput");
      if (saved) {
        setAlbumName(saved);
      }
      const savedImage = localStorage.getItem("pageImage");
      if (savedImage) {
        setCoverImage(savedImage);
      }
      const savedContent = localStorage.getItem("pageEditableContent");
      if (savedContent) {
        setEditableContent(savedContent);
      }
    }
  }, []);
  // 解决返回时内容消失的问题：
  // 1.返回上一次的路由页面
  const setAlbumAddress = (id: string) => {
    if (!params.has("albumId")) {
      params.append("albumId", id);
      // 用新参数更新URL，不刷新页面（history.pushState）
      window.history.pushState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
      );
    }
  };
  // 返回相册首页
  const goBack = () => {
    navigate("/memories");
  };

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setCoverImage(imageData);
        localStorage.setItem("pageImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // 触发文件选择
  const handleCoverClick = () => {
    fileInputRef.current?.click();
  };

  // 处理可编辑区域的点击事件
  const handleEditableClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    editableRef.current?.focus();
  };

  // 处理可编辑区域内容变化
  const handleEditableInput = () => {
    if (editableRef.current) {
      const content = editableRef.current.innerText;
      setEditableContent(content);
      localStorage.setItem("pageEditableContent", content);
    }
  };

  // 保存相册
  const saveAlbum = () => {
    if (!albumName.trim()) return;

    const newAlbum: Album = {
      id: albumId,
      name: albumName.trim(),
      date: new Date().toISOString(),
      folderId: "all", // 默认保存到全部
      coverImage: coverImage || undefined,
    };

    // 保存到本地存储
    const savedAlbums = localStorage.getItem("memories") || "[]";
    const albums = JSON.parse(savedAlbums) as Album[];
    albums.push(newAlbum);
    localStorage.setItem("memories", JSON.stringify(albums));

    // 清除临时存储
    localStorage.removeItem("pageInput");
    localStorage.removeItem("pageImage");
    localStorage.removeItem("pageEditableContent");

    navigate("/memories");
  };

  // 处理选项点击
  // 跳转页面前，保存内容到localStorage
  const handleOptionClick = (option: string) => {
    setShowOptions(false);
    localStorage.setItem("pageInput", albumName);
    localStorage.setItem("pageEditableContent", editableContent);
    switch (option) {
      case "style":
        // 跳转到更换样式页面
        saveAlbum();
        navigate(`/memories/style/${albumId}`);
        break;
      case "move":
        // 跳转到选择文件夹页面
        // 不在这里保存相册，避免重复创建
        navigate(`/memories/folders?albumId=${albumId}`);
        break;
      case "delete":
        // 删除相册
        if (window.confirm("确定要删除这个相册吗？")) {
          const savedAlbums = localStorage.getItem("memories") || "[]";
          let albums = JSON.parse(savedAlbums) as Album[];
          albums = albums.filter((album) => album.id !== albumId);
          localStorage.setItem("memories", JSON.stringify(albums));
          navigate("/memories");
        }
        break;
    }
  };
  // console.log(albumName);

  return (
    <div className={`create-memory ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 导航栏 */}
      <div className="memory-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>创建回忆相册</h2>
        <button
          className="options-btn"
          onClick={() => setShowOptions(!showOptions)}
        >
          <FaEllipsisV size={20} />
        </button>
      </div>

      {/* 选项弹窗 */}
      {showOptions && (
        <>
          <div className="overlay" onClick={() => setShowOptions(false)}></div>
          <div className="options-modal">
            <ul>
              <li onClick={() => handleOptionClick("style")}>更换相册样式</li>
              <li onClick={() => handleOptionClick("move")}>移动到</li>
              <li onClick={() => handleOptionClick("delete")}>删除</li>
            </ul>
          </div>
        </>
      )}

      {/* 相册内容区 */}
      <div className="memory-content">
        <input
          type="text"
          placeholder="请输入相册名称..."
          className="album-name-input"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
          onFocus={() => setAlbumAddress(albumId)}
        />

        <p className="current-date">{currentDate}</p>

        {/* 可编辑区域 */}
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          onClick={handleEditableClick}
          onInput={handleEditableInput}
          className="editable-content-area"
          style={{
            minHeight: "100px",
            padding: "15px",
            margin: "15px 0",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
            cursor: "text",
            lineHeight: "1.6",
            fontSize: "14px",
          }}
          data-placeholder="点击此处输入内容..."
        >
          {editableContent}
        </div>

        <div className="album-cover-upload" onClick={handleCoverClick}>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
          <div className="default-cover" style={{ cursor: "pointer" }}>
            {coverImage ? (
              <img
                src={coverImage}
                alt="Album cover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            ) : (
              <div className="plus-icon">+</div>
            )}
          </div>
          <p>点击添加封面照片</p>
        </div>

        <button
          className="save-album-btn"
          onClick={saveAlbum}
          disabled={!albumName.trim()}
        >
          保存相册
        </button>
      </div>
    </div>
  );
};

export default CreateMemory;
