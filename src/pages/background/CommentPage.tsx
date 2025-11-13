import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { useThemeStore } from "../../store";

// 模拟评论数据
const initialComments = [
  {
    id: 1,
    user: "小明",
    avatar: "/avatars/user1.jpg",
    content: "这个主题太赞了！",
    time: "2小时前",
  },
  {
    id: 2,
    user: "小红",
    avatar: "/avatars/user2.jpg",
    content: "我很喜欢这种风格",
    time: "5小时前",
  },
];

const CommentPage = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleBack = () => {
    navigate("/daily");
  };

  const handleSendComment = () => {
    if (newComment.trim()) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setComments([
        ...comments,
        {
          id: Date.now(),
          user: user.name || "匿名用户",
          avatar: user.avatar || "/avatars/default.jpg",
          content: newComment.trim(),
          time: "刚刚",
        },
      ]);
      setNewComment("");
    }
  };

  return (
    <div className={`comment-page ${isDarkMode ? "dark-mode" : ""}`}>
      {/* 顶部导航 */}
      <div className="comment-header">
        <button className="back-btn" onClick={handleBack}>
          <FaArrowLeft size={20} />
        </button>
        <h2>评论区</h2>
      </div>

      {/* 评论列表 */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <img
              src={comment.avatar}
              alt={comment.user}
              className="user-avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="user-name">{comment.user}</span>
                <span className="comment-time">{comment.time}</span>
              </div>
              <p className="comment-text">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 评论输入框 */}
      <div className="comment-input-area">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          className="comment-input"
          onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
        />
        <button
          className="send-btn"
          onClick={handleSendComment}
          disabled={!newComment.trim()}
        >
          <FaPaperPlane size={18} />
        </button>
      </div>
    </div>
  );
};

export default CommentPage;
