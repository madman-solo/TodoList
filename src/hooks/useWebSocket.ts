import { useEffect, useRef } from "react";
import { useCoupleStore } from "../store/coupleStore";
import { useUserStore } from "../store";
import type { CoupleEvent } from "../store/coupleStore";

interface WebSocketMessage {
  type:
    | "EVENT_ADDED"
    | "EVENT_UPDATED"
    | "EVENT_DELETED"
    | "EVENTS_SYNC"
    | "CONNECTION_ESTABLISHED";
  data: unknown;
  userId?: number;
}

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useUserStore();
  const { coupleRelation, setEvents, setWsConnected } = useCoupleStore();

  const connect = () => {
    if (!user?.id || !coupleRelation) {
      console.log("无法连接WebSocket: 缺少用户ID或情侣关系", {
        userId: user?.id,
        coupleRelation,
      });
      return;
    }

    const wsUrl = `ws://localhost:3001/ws?userId=${user.id}&coupleId=${coupleRelation.id}`;
    console.log("尝试连接WebSocket:", wsUrl);

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket连接已建立");
        setWsConnected(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log("收到WebSocket消息:", message);

          // 处理连接确认消息
          if (message.type === "CONNECTION_ESTABLISHED") {
            console.log("WebSocket连接确认:", message.data);
            return;
          }

          // 忽略自己发送的消息
          if (message.userId === user.id) {
            console.log("忽略自己发送的消息");
            return;
          }

          switch (message.type) {
            case "EVENT_ADDED":
              console.log("添加事件:", message.data);
              // 直接更新本地状态，不需要调用API
              useCoupleStore.setState((state) => ({
                events: [...state.events, message.data as CoupleEvent],
              }));
              break;

            case "EVENT_UPDATED":
              console.log("更新事件:", message.data);
              useCoupleStore.setState((state) => ({
                events: state.events.map((event) =>
                  event.id === (message.data as CoupleEvent).id
                    ? (message.data as CoupleEvent)
                    : event
                ),
              }));
              break;

            case "EVENT_DELETED":
              console.log("删除事件:", message.data);
              useCoupleStore.setState((state) => ({
                events: state.events.filter(
                  (event) => event.id !== (message.data as { id: string }).id
                ),
              }));
              break;

            case "EVENTS_SYNC":
              console.log("同步事件:", message.data);
              setEvents(message.data as CoupleEvent[]);
              break;

            default:
              console.log("未知消息类型:", message.type);
          }
        } catch (error) {
          console.error("解析WebSocket消息失败:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket连接已关闭", {
          code: event.code,
          reason: event.reason,
        });
        setWsConnected(false);

        // 尝试重连
        setTimeout(() => {
          if (user?.id && coupleRelation) {
            console.log("尝试重新连接WebSocket...");
            connect();
          }
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket错误:", error);
        setWsConnected(false);
      };
    } catch (error) {
      console.error("WebSocket连接失败:", error);
      setWsConnected(false);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setWsConnected(false);
    }
  };

  const sendMessage = (message: Omit<WebSocketMessage, "userId">) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          ...message,
          userId: user?.id,
        })
      );
    }
  };

  // 监听情侣关系变化，自动连接/断开WebSocket
  useEffect(() => {
    if (coupleRelation && user?.id) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [coupleRelation, user?.id]);

  // 页面卸载时断开连接
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    sendMessage,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN || false,
  };
};
