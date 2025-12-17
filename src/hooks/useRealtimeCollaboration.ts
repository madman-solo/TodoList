import { useEffect, useCallback, useRef } from "react";
import socketService from "../services/socketService";
import { useCoupleStore } from "../store/coupleStore";
import { useUserStore } from "../store";

interface CollaborationData<T> {
  type: string;
  data: T;
  action?: "add" | "update" | "delete";
}

interface UseRealtimeCollaborationOptions<T> {
  roomId: string;
  onRemoteUpdate: (data: CollaborationData<T>) => void;
  enabled?: boolean;
}

export function useRealtimeCollaboration<T>({
  roomId,
  onRemoteUpdate,
  enabled = true,
}: UseRealtimeCollaborationOptions<T>) {
  const { user } = useUserStore();
  const { coupleId, isCoupleBound } = useCoupleStore();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // 连接Socket
  useEffect(() => {
    if (!enabled || !isCoupleBound || !coupleId || !user?.id) {
      return;
    }

    console.log("初始化实时协作:", { roomId, coupleId, userId: user.id });

    // 连接Socket
    socketService.connect(user.id, coupleId);

    // 订阅消息
    unsubscribeRef.current = socketService.subscribe((message) => {
      console.log("收到协作消息:", message);

      // 处理绑定成功通知
      if (message.type === "couple-bound") {
        console.log("收到绑定成功通知，刷新页面状态");
        const coupleStore = useCoupleStore.getState();
        coupleStore.loadCoupleRelation();
        return;
      }

      // 处理解绑通知
      if (message.type === "couple-unbound") {
        console.log("收到解绑通知，清空数据");
        const coupleStore = useCoupleStore.getState();
        coupleStore.clearCoupleData();
        return;
      }

      // 处理协作更新
      if (message.type === roomId) {
        onRemoteUpdate(message as CollaborationData<T>);
      }
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [enabled, isCoupleBound, coupleId, user?.id, roomId, onRemoteUpdate]);

  // 广播更新
  const broadcastUpdate = useCallback(
    (data: CollaborationData<T>) => {
      if (!enabled || !isCoupleBound || !coupleId) {
        console.warn("未绑定或未启用，跳过广播");
        return;
      }

      console.log("广播更新:", data);
      socketService.send({
        type: roomId,
        data,
      });
    },
    [enabled, isCoupleBound, coupleId, roomId]
  );

  // 检查连接状态
  const isConnected = useCallback(() => {
    return socketService.isConnected();
  }, []);

  return {
    broadcastUpdate,
    isConnected,
  };
}
