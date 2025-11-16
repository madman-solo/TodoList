import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEllipsisV } from "react-icons/fa";
import { useThemeStore } from "../../store";

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

  // 获取当前时间
  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString());

    // 生成唯一ID
    setAlbumId(Date.now().toString());
  }, []);

  // 返回相册首页
  const goBack = () => {
    // console.log("fanhui");

    navigate("/couple/memories");
  };

  // 保存相册
  const saveAlbum = () => {
    if (!albumName.trim()) return;

    const newAlbum: Album = {
      id: albumId,
      name: albumName.trim(),
      date: new Date().toISOString(),
      folderId: "all", // 默认保存到全部
    };

    // 保存到本地存储
    const savedAlbums = localStorage.getItem("memories") || "[]";
    const albums = JSON.parse(savedAlbums) as Album[];
    albums.push(newAlbum);
    localStorage.setItem("memories", JSON.stringify(albums));

    navigate("/couple/memories");
  };

  // 处理选项点击
  const handleOptionClick = (option: string) => {
    setShowOptions(false);
    switch (option) {
      case "style":
        // 跳转到更换样式页面
        navigate(`/couple/memories/style/${albumId}`);
        break;
      case "move":
        // 跳转到选择文件夹页面
        navigate(`/couple/memories/folders?albumId=${albumId}`);
        break;
      case "delete":
        // 删除相册
        if (window.confirm("确定要删除这个相册吗？")) {
          const savedAlbums = localStorage.getItem("memories") || "[]";
          let albums = JSON.parse(savedAlbums) as Album[];
          albums = albums.filter((album) => album.id !== albumId);
          localStorage.setItem("memories", JSON.stringify(albums));
          navigate("/couple/memories");
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
        />

        <p className="current-date">{currentDate}</p>

        <div className="album-cover-upload">
          <div className="default-cover">
            <div className="plus-icon">+</div>
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
