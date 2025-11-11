/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

const CoupleGames = () => {
  return (
    <div css={container}>
      <h2>情侣小游戏</h2>
      <div css={gamePlaceholder}>
        <p>游戏功能开发中...</p>
        <p>敬请期待更多有趣的情侣互动游戏</p>
      </div>
    </div>
  );
};

// 样式
const container = css`
  padding: 20px;
`;

const gamePlaceholder = css`
  padding: 60px;
  text-align: center;
  background: #fff0f5;
  border-radius: 8px;
  color: #666;
  margin-top: 40px;
`;

export default CoupleGames;
