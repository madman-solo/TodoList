import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { useThemeStore } from "../../store";

interface Folder {
  id: string;
  name: string;
}
// 1. 定义Album接口，明确类型结构
interface Album {
  id: string;
  name: string;
  date: string;
  folderId: string;
  coverImage?: string; // 可选属性用?标记
}

const SelectFolder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useThemeStore();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("文件夹");

  // 获取当前相册ID
  const albumId = new URLSearchParams(location.search).get("albumId") || "";

  // 加载文件夹
  useEffect(() => {
    const savedFolders = localStorage.getItem("memoryFolders");
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // 返回创建相册页面
  const goBack = () => {
    navigate("/couple/memories/create");
  };

  // 选择文件夹
  const selectFolder = (folderId: string) => {
    if (!albumId) return;

    // 更新相册的文件夹ID
    const savedAlbums = localStorage.getItem("memories") || "[]";
    const albums: Album[] = JSON.parse(savedAlbums);
    // 此时album会被正确推断为Album类型
    const updatedAlbums = albums.map((album: Album) =>
      album.id === albumId ? { ...album, folderId: folderId } : album
    );
    localStorage.setItem("memories", JSON.stringify(updatedAlbums));

    navigate("/couple/memories/create");
  };

  // 创建新文件夹
  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem("memoryFolders", JSON.stringify(updatedFolders));

    setShowCreateFolder(false);
    setNewFolderName("文件夹");
  };

  return (
    <div className={`select-folder ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      {/* 顶部导航 */}
      <div className="folder-header">
        <button className="back-btn" onClick={goBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>选择相册文件夹</h2>
      </div>

      {/* 文件夹列表 */}
      <div className="folders-list">
        {folders.length === 0 ? (
          <div className="empty-state">
            <p>等待您创建新的文件夹</p>
          </div>
        ) : (
          <ul>
            {folders.map((folder) => (
              <li
                key={folder.id}
                className="folder-item"
                onClick={() => selectFolder(folder.id)}
              >
                {folder.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 添加文件夹按钮 */}
      <div className="add-folder-btn" onClick={() => setShowCreateFolder(true)}>
        <div className="plus-circle">
          <FaPlus size={18} />
        </div>
        <span>添加文件夹</span>
      </div>

      {/* 创建文件夹弹窗 */}
      {showCreateFolder && (
        <>
          <div
            className="overlay"
            onClick={() => setShowCreateFolder(false)}
          ></div>
          <div className="create-folder-modal">
            <h3>新建文件夹</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowCreateFolder(false)}
              >
                取消
              </button>
              <button className="confirm-btn" onClick={createFolder}>
                确定
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SelectFolder;
