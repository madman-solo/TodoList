import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { css } from "@emotion/react"; // 若使用emotion样式库，需提前安装

// 模拟点赞数据（实际项目中可从API或store获取）
const mockLikedItems = [
  {
    id: 1,
    title: "简约风背景",
    image: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    title: "手写艺术字体",
    image: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    title: "治愈系插画",
    image: "https://picsum.photos/300/200?random=3",
  },
];

export const Myliked = () => {
  const [likedList, setLikedList] = useState(mockLikedItems);

  // 切换点赞状态
  const toggleLike = (itemId: number) => {
    setLikedList((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isLiked: !item.isLiked } : item
      )
    );
  };

  return (
    <div css={containerStyle}>
      <div css={headerStyle}>
        <h2>我的喜欢</h2>
        <span css={countStyle}>{likedList.length} 个内容</span>
      </div>

      {likedList.length === 0 ? (
        <div css={emptyStyle}>
          <p>暂无喜欢的内容，快去首页点赞吧～</p>
        </div>
      ) : (
        <div css={gridStyle}>
          {likedList.map((item) => (
            <div key={item.id} css={cardStyle}>
              <img src={item.image} alt={item.title} css={imageStyle} />
              <div css={infoStyle}>
                <h3>{item.title}</h3>
                <button css={likeBtnStyle} onClick={() => toggleLike(item.id)}>
                  {item.isLiked ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 样式定义（使用emotion增强可维护性）
const containerStyle = css`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const headerStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const countStyle = css`
  color: #666;
  font-size: 0.9rem;
`;

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const cardStyle = css`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const imageStyle = css`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const infoStyle = css`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const likeBtnStyle = css`
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const emptyStyle = css`
  text-align: center;
  padding: 4rem 0;
  color: #999;
`;
