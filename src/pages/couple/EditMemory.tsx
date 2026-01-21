import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV, FaImage } from "react-icons/fa";
import { useThemeStore, useUserStore } from "../../store";
import { trackActivity } from "../../utils/activityTracker";

interface Album {
  id: string;
  name: string;
  date: string;
  folderId: string;
  coverImage?: string;
  content?: string;
}

const EditMemory = () => {
  const navigate = useNavigate();
  const { albumId } = useParams<{ albumId: string }>();
  const { isDarkMode } = useThemeStore();
  const { user } = useUserStore();
  const [albumName, setAlbumName] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");
  const [editableContent, setEditableContent] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  // 加载相册数据
  useEffect(() => {
    if (albumId) {
      const savedAlbums = localStorage.getItem("memories") || "[]";
      const albums = JSON.parse(savedAlbums) as Album[];
      const album = albums.find((a) => a.id === albumId);

      if (album) {
        setAlbumName(album.name);
        setCurrentDate(new Date(album.date).toLocaleDateString());
        setCoverImage(album.coverImage || "");
        setEditableContent(album.content || "");
        setCurrentFolderId(album.folderId);

        // 设置可编辑区域的内容
        if (editableRef.current && album.content) {
          editableRef.current.innerText = album.content;
        }
      } else {
        // 相册不存在，返回列表页
        navigate("/memories");
      }
    }
  }, [albumId, navigate]);

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
    }
  };

  // 保存相册
  const saveAlbum = () => {
    if (!albumName.trim() || !albumId) return;

    const savedAlbums = localStorage.getItem("memories") || "[]";
    const albums = JSON.parse(savedAlbums) as Album[];
    const albumIndex = albums.findIndex((a) => a.id === albumId);

    if (albumIndex !== -1) {
      // 更新现有相册
      albums[albumIndex] = {
        ...albums[albumIndex],
        name: albumName.trim(),
        coverImage: coverImage || undefined,
        content: editableContent.trim() || undefined,
        folderId: currentFolderId,
      };

      localStorage.setItem("memories", JSON.stringify(albums));

      // 追踪活跃度
      if (user?.id) {
        trackActivity(String(user.id), "memories");
      }

      navigate("/memories");
    }
  };

  // 处理选项点击
  const handleOptionClick = (option: string) => {
    setShowOptions(false);

    switch (option) {
      case "move":
        // 跳转到选择文件夹页面
        navigate(`/memories/folders?albumId=${albumId}&mode=edit`);
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

  return (
    <div className={`create-memory ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 导航栏 */}
      <div className="memory-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>编辑回忆相册</h2>
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
          data-placeholder="点击此处输入内容..."
        />

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
              <div className="plus-icon">
                <FaImage size={40} />
              </div>
            )}
          </div>
          <p>{coverImage ? "点击更换封面照片" : "点击添加封面照片"}</p>
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

export default EditMemory;
