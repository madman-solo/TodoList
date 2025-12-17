import { create } from "zustand";
import { persist } from "zustand/middleware";

// 情侣事件类型
export interface CoupleEvent {
  id: string;
  content: string;
  type: "future" | "wish" | "memory";
  createdBy: string | number;
  createdAt: Date;
  updatedAt: Date;
  position?: { x: number; y: number };
  completed?: boolean;
}

// 情侣关系类型
export interface CoupleRelation {
  id: string;
  user1Id: string | number;
  user2Id: string | number;
  createdAt: Date;
  isActive: boolean;
  partner?: {
    id: string;
    name: string;
    avatar?: string; // 新增：对方头像字段
  };
}

// 绑定请求类型
export interface CoupleRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: {
    id: string;
    name: string;
  };
  createdAt: Date;
}

interface CoupleState {
  // 情侣关系状态
  coupleRelation: CoupleRelation | null;
  partnerId: string | number | null;
  coupleId: string | null;
  isCoupleBound: boolean;
  isBinding: boolean;
  bindingError: string | null;

  // 绑定请求状态
  pendingRequests: CoupleRequest[];
  isLoadingRequests: boolean;

  // 事件状态
  events: CoupleEvent[];
  isLoading: boolean;

  // WebSocket连接状态
  wsConnected: boolean;

  // 方法
  bindCouple: (partnerId: string | number) => Promise<void>;
  unbindCouple: () => Promise<void>;
  loadCoupleRelation: () => Promise<void>;
  loadPendingRequests: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  addEvent: (
    event: Omit<CoupleEvent, "id" | "createdAt" | "updatedAt">
  ) => Promise<CoupleEvent>;
  updateEvent: (
    eventId: string,
    updates: Partial<CoupleEvent>
  ) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  loadEvents: () => Promise<void>;
  setEvents: (events: CoupleEvent[]) => void;
  setWsConnected: (connected: boolean) => void;
  clearCoupleData: () => void;
  updatePartnerAvatar: (avatar: string) => void;
}

export const useCoupleStore = create<CoupleState>()(
  persist(
    (set, get) => ({
      // 初始状态
      coupleRelation: null,
      partnerId: null,
      coupleId: null,
      isCoupleBound: false,
      isBinding: false,
      bindingError: null,
      pendingRequests: [],
      isLoadingRequests: false,
      events: [],
      isLoading: false,
      wsConnected: false,

      // 加载情侣关系
      loadCoupleRelation: async () => {
        try {
          const response = await fetch(
            "http://localhost:3001/api/couple/relation",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("加载情侣关系失败");
          }

          const relation = await response.json();

          if (relation) {
            set({
              coupleRelation: relation,
              partnerId: relation.partner?.id || null,
              coupleId: relation.id,
              isCoupleBound: true,
            });
            localStorage.setItem("coupleId", relation.id);
            localStorage.setItem("isCoupleBound", "true");

            console.log("[loadCoupleRelation] 情侣关系已加载:", {
              coupleId: relation.id,
              partnerId: relation.partner?.id,
              isCoupleBound: true,
            });
          } else {
            set({
              coupleRelation: null,
              partnerId: null,
              coupleId: null,
              isCoupleBound: false,
            });
            localStorage.removeItem("coupleId");
            localStorage.removeItem("isCoupleBound");

            console.log("[loadCoupleRelation] 未找到情侣关系");
          }
        } catch (error) {
          console.error("加载情侣关系失败:", error);
          set({
            coupleRelation: null,
            partnerId: null,
            coupleId: null,
            isCoupleBound: false,
          });
          localStorage.removeItem("coupleId");
          localStorage.removeItem("isCoupleBound");
        }
      },

      // 加载待处理的绑定请求
      loadPendingRequests: async () => {
        set({ isLoadingRequests: true });
        try {
          const response = await fetch(
            "http://localhost:3001/api/couple/requests",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("加载绑定请求失败");
          }

          const requests = await response.json();
          set({ pendingRequests: requests, isLoadingRequests: false });

          console.log(
            "[loadPendingRequests] 加载了",
            requests.length,
            "个待处理请求"
          );
        } catch (error) {
          console.error("加载绑定请求失败:", error);
          set({ isLoadingRequests: false });
        }
      },

      // 接受绑定请求 - BUG修复：接收方同意后设置绑定状态
      acceptRequest: async (requestId: string) => {
        try {
          console.log("[acceptRequest] 开始接受请求:", requestId);

          const response = await fetch(
            "http://localhost:3001/api/couple/accept",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ requestId }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "接受请求失败");
          }

          const coupleRelation = await response.json();

          // 确保返回的数据包含必要的字段
          if (!coupleRelation || !coupleRelation.id) {
            throw new Error("服务器返回的数据格式不正确");
          }

          // BUG修复：接收方同意后立即设置绑定状态
          set({
            coupleRelation,
            partnerId: coupleRelation.partner?.id || null,
            coupleId: coupleRelation.id,
            isCoupleBound: true,
            pendingRequests: get().pendingRequests.filter(
              (req) => req.id !== requestId
            ),
          });

          localStorage.setItem("coupleId", coupleRelation.id);
          localStorage.setItem("isCoupleBound", "true");

          console.log("[acceptRequest] 绑定状态已更新:", {
            coupleId: coupleRelation.id,
            partnerId: coupleRelation.partner?.id,
            isCoupleBound: true,
          });

          // 加载事件
          await get().loadEvents();
        } catch (error) {
          console.error("[acceptRequest] 接受请求失败:", error);
          throw error;
        }
      },

      // 拒绝绑定请求
      rejectRequest: async (requestId: string) => {
        try {
          console.log("[rejectRequest] 开始拒绝请求:", requestId);

          const response = await fetch(
            "http://localhost:3001/api/couple/reject",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ requestId }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "拒绝请求失败");
          }

          set({
            pendingRequests: get().pendingRequests.filter(
              (req) => req.id !== requestId
            ),
          });

          console.log("[rejectRequest] 请求已拒绝");
        } catch (error) {
          console.error("[rejectRequest] 拒绝请求失败:", error);
          throw error;
        }
      },

      // 绑定情侣（发送请求）- BUG修复：发送请求后不跳转，仅等待对方确认
      bindCouple: async (partnerId: string | number) => {
        set({ isBinding: true, bindingError: null });

        try {
          console.log("[bindCouple] 发送绑定请求给:", partnerId);

          const response = await fetch(
            "http://localhost:3001/api/couple/bind",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify({ partnerId }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "绑定失败";
            try {
              const error = JSON.parse(errorText);
              errorMessage = error.message || errorMessage;
            } catch {
              errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
          }

          // BUG修复：发送请求后不设置coupleRelation，不标记为已绑定
          // 仅在接收到对方同意后才设置绑定状态
          set({
            isBinding: false,
            bindingError: null,
          });

          console.log("[bindCouple] 绑定请求已发送，等待对方确认");
        } catch (error) {
          console.error("[bindCouple] 发送绑定请求失败:", error);
          set({
            isBinding: false,
            bindingError: error instanceof Error ? error.message : "绑定失败",
          });
          throw error;
        }
      },

      // 解除绑定
      unbindCouple: async () => {
        try {
          console.log("[unbindCouple] 开始解除绑定");

          await fetch("http://localhost:3001/api/couple/unbind", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          set({
            coupleRelation: null,
            partnerId: null,
            coupleId: null,
            isCoupleBound: false,
            events: [],
            bindingError: null,
          });

          localStorage.removeItem("coupleId");
          localStorage.removeItem("isCoupleBound");

          console.log("[unbindCouple] 绑定已解除");
        } catch (error) {
          console.error("[unbindCouple] 解除绑定失败:", error);
        }
      },

      // 添加事件
      addEvent: async (
        eventData: Omit<CoupleEvent, "id" | "createdAt" | "updatedAt">
      ) => {
        try {
          const response = await fetch(
            "http://localhost:3001/api/couple/events",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify(eventData),
            }
          );

          if (!response.ok) {
            throw new Error("添加事件失败");
          }

          const rawEvent = await response.json();

          // 解析 position 字段
          const newEvent: CoupleEvent = {
            ...rawEvent,
            position: rawEvent.position
              ? JSON.parse(rawEvent.position)
              : undefined,
            createdAt: new Date(rawEvent.createdAt),
            updatedAt: new Date(rawEvent.updatedAt),
          };

          set((state) => ({
            events: [...state.events, newEvent],
          }));

          return newEvent;
        } catch (error) {
          console.error("添加事件失败:", error);
          throw error;
        }
      },

      // 更新事件
      updateEvent: async (eventId: string, updates: Partial<CoupleEvent>) => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/couple/events/${eventId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
              body: JSON.stringify(updates),
            }
          );

          if (!response.ok) {
            throw new Error("更新事件失败");
          }

          const updatedEvent = await response.json();

          set((state) => ({
            events: state.events.map((event) =>
              event.id === eventId ? updatedEvent : event
            ),
          }));
        } catch (error) {
          console.error("更新事件失败:", error);
          throw error;
        }
      },

      // 删除事件
      deleteEvent: async (eventId: string) => {
        try {
          const response = await fetch(
            `http://localhost:3001/api/couple/events/${eventId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("删除事件失败");
          }

          set((state) => ({
            events: state.events.filter((event) => event.id !== eventId),
          }));
        } catch (error) {
          console.error("删除事件失败:", error);
          throw error;
        }
      },

      // 加载事件
      loadEvents: async () => {
        set({ isLoading: true });

        try {
          const response = await fetch(
            "http://localhost:3001/api/couple/events",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("加载事件失败");
          }

          const rawEvents = await response.json();

          // 解析 position 字段（从 JSON 字符串转换为对象）
          const events: CoupleEvent[] = rawEvents.map(
            (event: {
              id: string;
              content: string;
              type: string;
              createdBy: string | number;
              createdAt: string;
              updatedAt: string;
              position?: string;
              completed?: boolean;
            }) => ({
              ...event,
              position: event.position ? JSON.parse(event.position) : undefined,
              createdAt: new Date(event.createdAt),
              updatedAt: new Date(event.updatedAt),
            })
          );

          set({ events, isLoading: false });

          console.log("[loadEvents] 加载了", events.length, "个事件");
        } catch (error) {
          console.error("加载事件失败:", error);
          set({ isLoading: false });
        }
      },

      // 设置事件（用于WebSocket更新）
      setEvents: (events: CoupleEvent[]) => {
        set({ events });
      },

      // 设置WebSocket连接状态
      setWsConnected: (connected: boolean) => {
        set({ wsConnected: connected });
      },

      // 清除情侣数据
      clearCoupleData: () => {
        set({
          coupleRelation: null,
          partnerId: null,
          coupleId: null,
          isCoupleBound: false,
          events: [],
          bindingError: null,
          wsConnected: false,
        });
        localStorage.removeItem("coupleId");
        localStorage.removeItem("isCoupleBound");

        console.log("[clearCoupleData] 情侣数据已清除");
      },

      // 更新对方头像
      updatePartnerAvatar: (avatar: string) => {
        set((state) => {
          if (state.coupleRelation?.partner) {
            return {
              coupleRelation: {
                ...state.coupleRelation,
                partner: {
                  ...state.coupleRelation.partner,
                  avatar,
                },
              },
            };
          }
          return state;
        });
        console.log("[updatePartnerAvatar] 对方头像已更新");
      },
    }),
    {
      name: "couple-storage",
      partialize: (state) => ({
        coupleRelation: state.coupleRelation,
        partnerId: state.partnerId,
        coupleId: state.coupleId,
        isCoupleBound: state.isCoupleBound,
        events: state.isCoupleBound ? state.events : [],
      }),
    }
  )
);
