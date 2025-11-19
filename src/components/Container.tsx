import { css } from "@emotion/react";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => (
  <div css={containerStyle}>{children}</div>
);

const containerStyle = css`
  width: 100%;
  max-width: 1200px; // 电脑端最大宽度
  min-width: 320px; // 手机端最小宽度
  margin: 0 auto;
  padding: ${window.innerWidth < 768 ? "12px" : "24px"};
  box-sizing: border-box;
`;
