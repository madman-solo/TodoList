import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
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

  const goToCreateAlbum = () => {
    navigate("/couple/memories/create");
  };

  return (
    <div
      className={`memories-album ${isDarkMode ? "dark-mode" : "light-mode"}`}
    >
      {/* 第一个模块：顶部标题和搜索框 */}
      <div className="memories-header">
        <h2>回忆相册</h2>
        <div className="search-bar">
          <FaSearch size={16} className="search-icon" />
          <input
            type="text"
            placeholder="按时间或相册名称搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 第二个模块：文件夹导航 */}
      <div className="folders-nav">
        {folders.map((folder) => (
          <button
            key={folder.id}
            className={`folder-btn ${
              activeFolder === folder.id ? "active" : ""
            }`}
            onClick={() => setActiveFolder(folder.id)}
          >
            {folder.name}
          </button>
        ))}
      </div>

      {/* 第三个模块：相册内容区 */}
      <div className="albums-container">
        {filteredAlbums.length === 0 ? (
          <div className="empty-state">
            <p>等待您添加新的回忆照片</p>
          </div>
        ) : (
          <div className="albums-grid">
            {filteredAlbums.map((album) => (
              <div key={album.id} className="album-item">
                <div className="album-cover">
                  {album.coverImage ? (
                    <img src={album.coverImage} alt={album.name} />
                  ) : (
                    <div className="default-cover">
                      <div className="plus-icon">+</div>
                    </div>
                  )}
                </div>
                <h4>{album.name}</h4>
                <p>{new Date(album.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* 添加按钮 */}
        <button className="floating-action-btn" onClick={goToCreateAlbum}>
          <FaPlus size={24} />
        </button>
      </div>
    </div>
  );
};

export default MemoriesAlbum;
