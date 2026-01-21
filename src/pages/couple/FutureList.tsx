/** @jsxImportSource @emotion/react */

import { useState, useEffect, useCallback } from "react";
import { css } from "@emotion/react";
import { useCoupleStore } from "../../store/coupleStore";
import type { CoupleEvent } from "../../store/coupleStore";
import { useRealtimeCollaboration } from "../../hooks/useRealtimeCollaboration";
import { useUserStore } from "../../store";
import { trackActivity } from "../../utils/activityTracker";

const FutureList = () => {
  const {
    events,
    coupleRelation,
    addEvent,
    deleteEvent,
    loadEvents,
    setEvents,
  } = useCoupleStore();
  const { user } = useUserStore();

  const [newItem, setNewItem] = useState("");
  const [positions, setPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  // 获取未来清单类型的事件
  const futureEvents = events.filter((event) => event.type === "future");

  // 处理远程更新
  const handleRemoteUpdate = useCallback(
    (message: {
      type: string;
      data: CoupleEvent | { id: string };
      action?: string;
    }) => {
      console.log("收到远程更新:", message);

      if (message.action === "add" && message.data) {
        setEvents([...events, message.data as CoupleEvent]);
      } else if (message.action === "delete" && "id" in message.data) {
        setEvents(events.filter((e) => e.id !== message.data.id));
      }
    },
    [events, setEvents]
  );

  // 使用实时协作Hook
  const { broadcastUpdate, isConnected } =
    useRealtimeCollaboration<CoupleEvent>({
      roomId: "future-list",
      onRemoteUpdate: handleRemoteUpdate,
      enabled: !!coupleRelation,
    });

  // 加载事件数据
  useEffect(() => {
    if (coupleRelation) {
      loadEvents();
    }
  }, [coupleRelation, loadEvents]);

  // 初始化位置
  useEffect(() => {
    const newPositions: Record<string, { x: number; y: number }> = {};
    futureEvents.forEach((event) => {
      if (event.position) {
        newPositions[event.id] = event.position;
      } else if (!positions[event.id]) {
        newPositions[event.id] = generateUniquePosition();
      }
    });
    setPositions((prev) => ({ ...prev, ...newPositions }));
  }, [futureEvents.length]);

  // 生成不重叠的位置
  const generateUniquePosition = () => {
    const container = document.getElementById("heart-container");
    if (!container) return { x: 50, y: 50 };

    const containerRect = container.getBoundingClientRect();
    const cardSize = 120; // 卡片尺寸
    const maxAttempts = 100;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const candidate = {
        x: Math.random() * (containerRect.width - cardSize) + 20,
        y: Math.random() * (containerRect.height - cardSize) + 20,
      };

      // 检查是否与现有卡片重叠
      const isOverlapping = Object.values(positions).some((pos) => {
        return !(
          candidate.x + cardSize < pos.x ||
          candidate.x > pos.x + cardSize ||
          candidate.y + cardSize < pos.y ||
          candidate.y > pos.y + cardSize
        );
      });

      if (!isOverlapping) {
        return {
          x: (candidate.x / containerRect.width) * 100, // 转换为百分比
          y: (candidate.y / containerRect.height) * 100,
        };
      }

      attempts++;
    }

    // 如果多次尝试仍重叠，则返回一个默认位置（会导致轻微重叠）
    return {
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
    };
  };

  const handleAddItem = async () => {
    if (newItem.trim() && coupleRelation) {
      try {
        const newPos = generateUniquePosition();
        const newEvent = await addEvent({
          content: newItem.trim(),
          type: "future",
          createdBy: 0, // 将由后端设置
          position: newPos,
        });

        // 立即设置新事件的位置
        setPositions((prev) => ({
          ...prev,
          [newEvent.id]: newPos,
        }));

        setNewItem("");

        // 追踪活跃度
        if (user?.id) {
          trackActivity(String(user.id), "futureList");
        }

        // 广播添加事件
        broadcastUpdate({ type: "future-list", data: newEvent, action: "add" });
      } catch (error) {
        console.error("添加事件失败:", error);
      }
    }
  };

  const handleDeleteItem = async (eventId: string) => {
    try {
      await deleteEvent(eventId);

      // 追踪活跃度
      if (user?.id) {
        trackActivity(String(user.id), "futureList");
      }

      // 广播删除事件
      broadcastUpdate({
        type: "future-list",
        data: { id: eventId } as unknown as CoupleEvent,
        action: "delete",
      });
    } catch (error) {
      console.error("删除事件失败:", error);
    }
  };

  // 检查并扩展容器高度
  const expandContainerIfNeeded = () => {
    const container = document.getElementById("heart-container");
    if (!container) return;

    // 当项目数量超过12个时开始扩展容器高度
    if (futureEvents.length > 12) {
      const extraHeight = Math.ceil((futureEvents.length - 12) / 4) * 100;
      container.style.minHeight = `${400 + extraHeight}px`;
    }
  };

  // 监听事件变化，扩展容器
  useEffect(() => {
    expandContainerIfNeeded();
  }, [futureEvents.length]);

  return (
    <div css={container}>
      {/* 中央爱心容器 */}
      <div css={heartContainer} id="heart-container">
        {/* 跳动的正红色爱心 */}
        <div css={redHeart}></div>

        {/* 输入框置于爱心尖底 */}
        <div css={inputContainer}>
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="添加未来想一起做的事..."
            css={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
          />
          <button onClick={handleAddItem} css={addButton}>
            添加
          </button>
        </div>
      </div>

      {/* 连接状态指示器 */}
      <div css={connectionStatus}>
        <span css={statusIndicator(isConnected())}>
          {isConnected() ? "● 已连接" : "○ 未连接"}
        </span>
      </div>

      {/* 随机分布的小卡片 */}
      {futureEvents.map((event) => (
        <div
          key={event.id}
          css={itemCard}
          style={{
            top: `${positions[event.id]?.y}%`,
            left: `${positions[event.id]?.x}%`,
          }}
          onClick={() => handleDeleteItem(event.id)}
          title="点击删除"
        >
          {event.content}
        </div>
      ))}
    </div>
  );
};

// 样式修改：爱心跳动、形状优化、输入框位置调整
const heartContainer = css`
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* 让内容靠下，为爱心尖底留空间 */
  margin: auto;
  padding: 2rem;
`;

// 跳动的正红色爱心（通过CSS动画实现）
const redHeart = css`
  position: relative;
  width: 240px;
  height: 240px;
  background-color: #cd1500ff; /* 正红色 */
  transform: rotate(-45deg) scale(1);
  box-shadow: 0 0 30px rgba(244, 88, 71, 0.7);
  z-index: 1;
  animation: heartbeat 1.5s infinite ease-in-out; /* 跳动动画 */

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 240px;
    height: 240px;
    background-color: #cd1500ff;
    border-radius: 50%;
  }

  &::before {
    top: -120px;
    left: 0;
  }

  &::after {
    top: 0;
    right: -120px;
  }

  /* 响应式调整 */
  @media (max-width: 768px) {
    width: 180px;
    height: 180px;
    transform: rotate(-45deg);
    position: relative;
    background-color: #cd1500ff; /* 正红色 */

    &::before,
    &::after {
      content: ""; /* 必须添加，伪元素才会显示 */
      position: absolute; /* 绝对定位 */
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background-color: #cd1500ff; /* 正红色 */
    }

    &::before {
      top: -90px;
    }

    &::after {
      right: -90px;
    }
  }
`;

// 爱心跳动动画
const keyframes = css`
  @keyframes heartbeat {
    0% {
      transform: rotate(-45deg) scale(1);
    }
    14% {
      transform: rotate(-45deg) scale(1.02);
    }
    28% {
      transform: rotate(-45deg) scale(1);
    }
    42% {
      transform: rotate(-45deg) scale(1.04);
    }
    70% {
      transform: rotate(-45deg) scale(1);
    }
  }
`;

// 输入框置于爱心尖底
const inputContainer = css`
  ${keyframes} /* 引入动画 */
  position: absolute;
  z-index: 2;
  bottom: 20px; /* 调整距离爱心尖底的位置 */
  left: 50%;
  transform: translateX(-50%) rotate(-5deg); /* 轻微斜放，与爱心风格呼应 */
  display: flex;
  gap: 0.5rem;
  width: 80%;
  max-width: 320px;

  /* 移动端调整 */
  @media (max-width: 768px) {
    width: 70%;
    bottom: 15px;
  }
`;
const inputStyle = css`
  flex: 1;
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
`;

const addButton = css`
  padding: 0 1rem;
  background: #cd1500ff;
  color: #333;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #d56154ff;
  }
`;

const itemCard = () => css`
  position: absolute;
  background: #000000ff;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  width: 100px;
  min-height: 30px;
  transform: rotate(${(Math.random() - 0.5) * 10}deg); /* 修复类型不匹配问题 */
  transition: all 0.3s;
  z-index: 2;

  &:hover {
    transform: rotate(${(Math.random() - 0.5) * 10}deg) scale(1.05);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: 100px;
    padding: 0.6rem;
    font-size: 0.85rem;
  }
`;

const container = css`
  position: relative;
  width: 100%;
  padding: 2rem 1rem;
  min-height: 100vh;
`;

const connectionStatus = css`
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  font-size: 0.9rem;
`;

const statusIndicator = (isConnected: boolean) => css`
  color: ${isConnected ? "#4caf50" : "#f44336"};
  font-weight: 500;
`;

export default FutureList;
