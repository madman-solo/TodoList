// src/components/BackgroundAnimation.tsx
import { useEffect, useRef, useState } from "react";
// import { css } from "@emotion/react";

interface AnimationProps {
  visible: boolean;
  background: string;
  layers: {
    type: "line" | "shape" | "image";
    color?: string;
    opacity: number;
    zIndex: number;
    path?: string;
    image?: string;
  }[];
  onComplete: () => void;
}

const BackgroundAnimation = ({
  visible,
  background,
  layers,
  onComplete,
}: AnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);
  const totalFrames = 30; // 动画总帧数

  useEffect(() => {
    if (!visible || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置Canvas尺寸
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // 加载背景图片
    const img = new Image();
    img.src = background;
    img.onload = () => {
      // 开始动画
      let animationId = requestAnimationFrame(update);
      animationId = requestAnimationFrame(update); // 赋值动画ID

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        cancelAnimationFrame(animationId);
      };
    };

    // 动画更新函数
    const update = () => {
      if (!ctx) return;

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制背景
      ctx.globalAlpha = Math.min(0.5, (frame / totalFrames) * 0.5);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 逐帧绘制图层
      layers.forEach((layer, index) => {
        const layerFrame = frame - index * 5; // 图层错开动画
        if (layerFrame < 0) return;

        const progress = Math.min(1, layerFrame / 10);

        ctx.save();
        ctx.globalAlpha = progress * layer.opacity;

        if (layer.type === "shape") {
          // 绘制色块
          ctx.fillStyle = layer.color || "#fff";
          ctx.fillRect(
            canvas.width * 0.2 * index,
            canvas.height * 0.3,
            canvas.width * 0.1 * progress,
            canvas.height * 0.4
          );
        } else if (layer.type === "line") {
          // 绘制线条
          ctx.strokeStyle = layer.color || "#000";
          ctx.lineWidth = 2 + progress * 3;
          ctx.beginPath();
          ctx.moveTo(canvas.width * 0.1, canvas.height * 0.5);
          ctx.lineTo(
            canvas.width * 0.1 + canvas.width * 0.6 * progress,
            canvas.height * 0.5
          );

          ctx.stroke();
        } else if (layer.type === "image" && layer.image) {
          const layerImg = new Image();
          layerImg.src = layer.image;
          layerImg.onload = () => {
            ctx.drawImage(
              layerImg,
              canvas.width * 0.3 * index, // 位置X
              canvas.height * 0.2, // 位置Y
              canvas.width * 0.2 * progress, // 宽度（随进度变化）
              canvas.height * 0.3 * progress // 高度（随进度变化）
            );
          };
        }
        ctx.restore();
      });

      setFrame((prev) => {
        if (prev >= totalFrames) {
          onComplete();
          return totalFrames;
        }
        requestAnimationFrame(update);
        return prev + 1;
      });
    };

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [visible, background, layers]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        display: visible ? "block" : "none",
      }}
    />
  );
};

export default BackgroundAnimation;
