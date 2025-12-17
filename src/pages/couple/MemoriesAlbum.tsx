import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaCamera,
  FaImage,
  FaArrowLeft,
  FaTrash,
  FaHeart,
  FaFolder,
} from "react-icons/fa";
import { useThemeStore } from "../../store";

// 定义相册类型
interface Album {
  id: string;
  name: string;
  date: string;
  folderId: string;
  coverImage?: string;
}

// 定义文件夹类型
interface Folder {
  id: string;
  name: string;
}

const MemoriesAlbum = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [folders, setFolders] = useState<Folder[]>([
    { id: "all", name: "全部" },
  ]);
  const [activeFolder, setActiveFolder] = useState("all");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 从本地存储加载数据
  useEffect(() => {
    const savedFolders = localStorage.getItem("memoryFolders");
    const savedAlbums = localStorage.getItem("memories");

    if (savedFolders) {
      setFolders((prev) => [...prev, ...JSON.parse(savedFolders)]);
    }
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums));
    }
  }, []);

  // 筛选相册
  const filteredAlbums = albums.filter((album) => {
    const matchesSearch =
      album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(album.date).toLocaleDateString().includes(searchQuery);
    const matchesFolder =
      activeFolder === "all" || album.folderId === activeFolder;
    return matchesSearch && matchesFolder;
  });

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const newAlbum: Album = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name.split(".")[0] || "新相册",
            date: new Date().toISOString(),
            folderId: activeFolder === "all" ? "default" : activeFolder,
            coverImage: imageUrl,
          };

          const updatedAlbums = [...albums, newAlbum];
          setAlbums(updatedAlbums);
          localStorage.setItem("memories", JSON.stringify(updatedAlbums));
        };
        reader.readAsDataURL(file);
      });
    }
    setShowUploadOptions(false);
  };

  // 打开文件选择器
  const openFileSelector = () => {
    fileInputRef.current?.click();
    setShowUploadOptions(false);
  };

  // 打开相机
  const openCamera = () => {
    cameraInputRef.current?.click();
    setShowUploadOptions(false);
  };

  const goToCreateAlbum = () => {
    navigate("/memories/create");
  };

  const realFolders = Array.from(
    new Map(folders.map((item) => [item.id, item])).values()
  );

  // 删除相册
  const handleDeleteAlbum = (albumId: string) => {
    if (window.confirm("确定要删除这个相册吗？")) {
      const updatedAlbums = albums.filter((album) => album.id !== albumId);
      setAlbums(updatedAlbums);
      localStorage.setItem("memories", JSON.stringify(updatedAlbums));
    }
  };

  // 删除文件夹
  const handleDeleteFolder = (folderId: string) => {
    if (folderId === "all") {
      alert("不能删除全部文件夹");
      return;
    }

    if (
      window.confirm("确定要删除这个文件夹吗？文件夹内的相册将移至默认文件夹。")
    ) {
      // 将该文件夹下的相册移至默认文件夹
      const updatedAlbums = albums.map((album) =>
        album.folderId === folderId ? { ...album, folderId: "default" } : album
      );
      setAlbums(updatedAlbums);
      localStorage.setItem("memories", JSON.stringify(updatedAlbums));

      // 删除文件夹
      const updatedFolders = folders.filter((folder) => folder.id !== folderId);
      setFolders(updatedFolders);
      localStorage.setItem(
        "memoryFolders",
        JSON.stringify(updatedFolders.filter((f) => f.id !== "all"))
      );

      // 如果当前选中的是被删除的文件夹，切换到全部
      if (activeFolder === folderId) {
        setActiveFolder("all");
      }
    }
  };

  // 返回情侣模式页面
  const handleBackToCouple = () => {
    navigate("/couple");
  };

  return (
    <div
      className={`memories-album ${isDarkMode ? "dark-mode" : "light-mode"}`}
    >
      {/* 优化后的顶部标题和搜索框 */}
      <div className="memories-header">
        <div className="header-top">
          <button
            onClick={handleBackToCouple}
            className="back-to-couple-btn"
            title="返回情侣模式"
          >
            <FaArrowLeft size={18} />
          </button>
          <div className="header-title">
            <FaHeart className="title-icon" />
            <h2>回忆相册</h2>
            <span className="album-count">({filteredAlbums.length})</span>
          </div>
          <div className="header-spacer"></div>
        </div>

        <div className="search-container">
          <div className="search-bar">
            <FaSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="搜索回忆..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search"
                onClick={() => setSearchQuery("")}
                title="清除搜索"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 优化后的文件夹导航 */}
      <div className="folders-nav">
        <div className="folders-scroll">
          {realFolders.map((folder) => (
            <div key={folder.id} className="folder-item-wrapper">
              <button
                className={`folder-btn ${
                  activeFolder === folder.id ? "active" : ""
                }`}
                onClick={() => setActiveFolder(folder.id)}
              >
                <FaFolder className="folder-icon" />
                <span>{folder.name}</span>
                {folder.id !== "all" && (
                  <span className="folder-count">
                    ({albums.filter((a) => a.folderId === folder.id).length})
                  </span>
                )}
              </button>
              {folder.id !== "all" && (
                <button
                  className="delete-folder-btn"
                  onClick={() => handleDeleteFolder(folder.id)}
                  title="删除文件夹"
                >
                  <FaTrash size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 优化后的相册内容区 */}
      <div className="albums-container">
        {filteredAlbums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📸</div>
            <h3>还没有回忆</h3>
            <p>开始记录你们的美好时光吧</p>
            <button className="create-first-album" onClick={openFileSelector}>
              <FaPlus />
              添加第一张照片
            </button>
          </div>
        ) : (
          <div className="albums-grid">
            {filteredAlbums.map((album) => (
              <div key={album.id} className="album-item">
                <div className="album-card">
                  <button
                    className="delete-album-btn"
                    onClick={() => handleDeleteAlbum(album.id)}
                    title="删除相册"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="album-cover">
                    {album.coverImage ? (
                      <img src={album.coverImage} alt={album.name} />
                    ) : (
                      <div className="default-cover">
                        <FaImage className="default-icon" />
                      </div>
                    )}
                    <div className="album-overlay">
                      <FaHeart className="heart-icon" />
                    </div>
                  </div>

                  <div className="album-info">
                    <h4 className="album-name">{album.name}</h4>
                    <p className="album-date">
                      {new Date(album.date).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 优化后的上传按钮组 */}
        <div className="upload-section">
          <div className="quick-actions">
            <button
              className="quick-action-btn camera-btn"
              onClick={openCamera}
              title="拍照上传"
            >
              <FaCamera />
              <span>拍照</span>
            </button>

            <button
              className="quick-action-btn gallery-btn"
              onClick={openFileSelector}
              title="从相册选择"
            >
              <FaImage />
              <span>相册</span>
            </button>

            <button
              className="quick-action-btn create-btn"
              onClick={goToCreateAlbum}
              title="创建相册"
            >
              <FaPlus />
              <span>创建</span>
            </button>
          </div>

          <button
            className={`floating-action-btn ${
              showUploadOptions ? "active" : ""
            }`}
            onClick={() => setShowUploadOptions(!showUploadOptions)}
            title="更多选项"
          >
            <FaPlus size={20} />
          </button>
        </div>

        {/* 优化后的上传选项菜单 */}
        {showUploadOptions && (
          <div className="upload-options-menu">
            <div
              className="menu-backdrop"
              onClick={() => setShowUploadOptions(false)}
            />
            <div className="menu-content">
              <button onClick={openCamera} className="upload-option">
                <FaCamera />
                <span>拍照上传</span>
              </button>
              <button onClick={openFileSelector} className="upload-option">
                <FaImage />
                <span>从相册选择</span>
              </button>
              <button onClick={goToCreateAlbum} className="upload-option">
                <FaPlus />
                <span>创建相册</span>
              </button>
            </div>
          </div>
        )}

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />

        {/* 隐藏的相机输入 */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
};

export default MemoriesAlbum;
