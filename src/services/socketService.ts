import { io, Socket } from "socket.io-client";

interface SocketMessage {
  type: string;
  data: unknown;
  fromUserId?: string | number;
}

type MessageHandler = (message: SocketMessage) => void;

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private userId: string | number | null = null;
  private coupleId: string | null = null;
  private isConnecting = false;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(userId: string | number, coupleId: string): void {
    const isCoupleBound = localStorage.getItem("isCoupleBound");
    const localCoupleId = localStorage.getItem("coupleId");

    if (
      isCoupleBound !== "true" ||
      !localCoupleId ||
      localCoupleId !== coupleId
    ) {
      console.log("未绑定或coupleId不匹配，跳过Socket连接");
      return;
    }

    if (this.isConnecting || (this.socket && this.socket.connected)) {
      console.log("Socket已连接或正在连接中");
      return;
    }

    this.userId = userId;
    this.coupleId = coupleId;
    this.isConnecting = true;

    console.log("连接Socket.io:", { userId, coupleId });

    this.socket = io("http://localhost:3001", {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    this.socket.on("connect", () => {
      console.log("Socket.io连接成功");
      this.isConnecting = false;

      if (this.socket && this.userId && this.coupleId) {
        this.socket.emit("join-couple-room", {
          userId: this.userId,
          coupleId: this.coupleId,
        });
      }
    });

    this.socket.on("joined-room", (data) => {
      console.log("成功加入情侣房间:", data);
    });

    this.socket.on("remote-update", (data) => {
      console.log("收到远程更新:", data);

      if (data.fromUserId === this.userId) {
        console.log("忽略自己发送的消息");
        return;
      }

      this.messageHandlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error("消息处理器执行失败:", error);
        }
      });
    });

    this.socket.on("couple-bound", (data) => {
      console.log("收到绑定成功通知:", data);
      this.messageHandlers.forEach((handler) => {
        try {
          handler({ type: "couple-bound", data });
        } catch (error) {
          console.error("绑定通知处理失败:", error);
        }
      });
    });

    this.socket.on("couple-unbound", (data) => {
      console.log("收到解除绑定通知:", data);
      this.messageHandlers.forEach((handler) => {
        try {
          handler({ type: "couple-unbound", data });
        } catch (error) {
          console.error("解绑通知处理失败:", error);
        }
      });
      this.disconnect();
    });

    this.socket.on("partner-online", (data) => {
      console.log("对方上线:", data);
    });

    this.socket.on("partner-offline", (data) => {
      console.log("对方离线:", data);
    });

    this.socket.on("error", (error) => {
      console.error("Socket错误:", error);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket断开连接:", reason);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket连接错误:", error);
      this.isConnecting = false;
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.userId = null;
    this.coupleId = null;
    this.isConnecting = false;
  }

  send(message: Omit<SocketMessage, "fromUserId">): void {
    if (!this.socket || !this.socket.connected) {
      console.warn("Socket未连接，无法发送消息");
      return;
    }

    try {
      this.socket.emit("collaboration-update", {
        ...message,
        fromUserId: this.userId,
      });
    } catch (error) {
      console.error("发送Socket消息失败:", error);
    }
  }

  notifyBindingSuccess(coupleId: string, userId: string | number): void {
    if (!this.socket || !this.socket.connected) {
      console.warn("Socket未连接，无法发送绑定通知");
      return;
    }

    this.socket.emit("binding-success", { coupleId, userId });
  }

  notifyUnbind(coupleId: string): void {
    if (!this.socket || !this.socket.connected) {
      console.warn("Socket未连接，无法发送解绑通知");
      return;
    }

    this.socket.emit("unbind-couple", { coupleId });
  }

  subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);

    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.connected;
  }
}

export default SocketService.getInstance();
