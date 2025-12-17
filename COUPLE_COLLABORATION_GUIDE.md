# 情侣绑定+双人实时协作功能实现指南

## 功能概述

本项目实现了基于 React 18 + Socket.io 的情侣绑定和实时协作功能，包括：

1. **情侣绑定系统**：发送/接收绑定请求、后端校验、生成唯一 coupleId
2. **路由守卫**：未绑定用户自动跳转至绑定页面
3. **实时协作**：WebSocket 单例连接、自动重连、数据同步
4. **协作页面**：未来清单、心愿清单、回忆相册等

## 核心文件结构

```
src/
├── services/
│   └── socketService.ts          # WebSocket 单例服务
├── hooks/
│   ├── useWebSocket.ts            # 旧版 WebSocket Hook（已弃用）
│   └── useRealtimeCollaboration.ts # 实时协作 Hook
├── components/
│   ├── CoupleBinding.tsx          # 情侣绑定组件
│   └── CoupleRouteGuard.tsx       # 路由守卫组件
├── store/
│   └── coupleStore.ts             # 情侣状态管理
├── pages/couple/
│   ├── FutureList.tsx             # 未来清单（已集成实时协作）
│   ├── WishList.tsx               # 心愿清单
│   └── MemoriesAlbum.tsx          # 回忆相册
└── router.tsx                     # 路由配置
```

## 1. WebSocket 单例服务

### 文件：`src/services/socketService.ts`

**核心功能**：

- 全局唯一 WebSocket 连接
- 自动重连机制（最多 5 次，延迟递增）
- 消息订阅/发布模式
- 过滤自身发送的消息

**使用方法**：

```typescript
import socketService from "../services/socketService";

// 连接
socketService.connect(userId, coupleId);

// 订阅消息
const unsubscribe = socketService.subscribe((message) => {
  console.log("收到消息:", message);
});

// 发送消息
socketService.send({
  type: "EVENT_ADDED",
  data: { id: "123", content: "新事件" },
});

// 断开连接
socketService.disconnect();

// 取消订阅
unsubscribe();
```

## 2. 实时协作 Hook

### 文件：`src/hooks/useRealtimeCollaboration.ts`

**核心功能**：

- 自动连接 WebSocket
- 处理远程消息（添加、更新、删除、同步）
- 提供广播方法

**使用方法**：

```typescript
import { useRealtimeCollaboration } from "../../hooks/useRealtimeCollaboration";
import type { CoupleEvent } from "../../store/coupleStore";

const { broadcastAdd, broadcastDelete, isConnected } =
  useRealtimeCollaboration<CoupleEvent>({
    roomId: coupleRelation?.id || "",
    onAdd: (event) => {
      // 处理远程添加事件
      setEvents([...events, event]);
    },
    onDelete: (eventId) => {
      // 处理远程删除事件
      setEvents(events.filter((e) => e.id !== eventId));
    },
  });

// 添加事件后广播
const newEvent = await addEvent({ content: "新事件", type: "future" });
broadcastAdd(newEvent);

// 删除事件后广播
await deleteEvent(eventId);
broadcastDelete(eventId);
```

## 3. 路由守卫

### 文件：`src/components/CoupleRouteGuard.tsx`

**核心功能**：

- 检查用户是否已绑定情侣关系
- 未绑定则显示绑定页面
- 绑定成功后自动刷新

**使用方法**（在 `router.tsx` 中）：

```typescript
import CoupleRouteGuard from './components/CoupleRouteGuard';

{
  path: 'couple',
  element: (
    <CoupleRouteGuard>
      <CoupleMode />
    </CoupleRouteGuard>
  ),
  children: [
    { index: true, element: <FutureList /> },
    { path: 'table', element: <TableStyle /> },
    { path: 'games', element: <CoupleGames /> },
  ],
}
```

## 4. 情侣绑定组件

### 文件：`src/components/CoupleBinding.tsx`

**核心功能**：

- 发送绑定请求
- 显示待处理请求
- 接受/拒绝请求
- 解除绑定

**使用方法**：

```typescript
<CoupleBinding
  onBindingSuccess={() => {
    // 绑定成功回调
    loadCoupleRelation();
  }}
/>
```

## 5. 情侣状态管理

### 文件：`src/store/coupleStore.ts`

**核心状态**：

```typescript
interface CoupleState {
  coupleRelation: CoupleRelation | null; // 情侣关系
  partnerId: string | number | null; // 伴侣 ID
  events: CoupleEvent[]; // 事件列表
  pendingRequests: CoupleRequest[]; // 待处理请求
  wsConnected: boolean; // WebSocket 连接状态
}
```

**核心方法**：

- `bindCouple(partnerId)` - 发送绑定请求
- `acceptRequest(requestId)` - 接受绑定请求
- `rejectRequest(requestId)` - 拒绝绑定请求
- `unbindCouple()` - 解除绑定
- `addEvent(event)` - 添加事件
- `deleteEvent(eventId)` - 删除事件
- `loadEvents()` - 加载事件列表

## 6. 实时协作页面示例

### 文件：`src/pages/couple/FutureList.tsx`

**核心实现**：

```typescript
const FutureList = () => {
  const { events, addEvent, deleteEvent, setEvents } = useCoupleStore();

  // 处理远程添加
  const handleRemoteAdd = useCallback(
    (event: CoupleEvent) => {
      setEvents([...events, event]);
    },
    [events, setEvents]
  );

  // 处理远程删除
  const handleRemoteDelete = useCallback(
    (eventId: string) => {
      setEvents(events.filter((e) => e.id !== eventId));
    },
    [events, setEvents]
  );

  // 使用实时协作
  const { broadcastAdd, broadcastDelete, isConnected } =
    useRealtimeCollaboration<CoupleEvent>({
      roomId: coupleRelation?.id || "",
      onAdd: handleRemoteAdd,
      onDelete: handleRemoteDelete,
    });

  // 添加事件
  const handleAddItem = async () => {
    const newEvent = await addEvent({ content, type: "future" });
    broadcastAdd(newEvent); // 广播给对方
  };

  // 删除事件
  const handleDeleteItem = async (eventId: string) => {
    await deleteEvent(eventId);
    broadcastDelete(eventId); // 广播给对方
  };

  return (
    <div>
      {/* 连接状态 */}
      <div>{isConnected ? "● 已连接" : "○ 未连接"}</div>

      {/* 事件列表 */}
      {events.map((event) => (
        <div key={event.id} onClick={() => handleDeleteItem(event.id)}>
          {event.content}
        </div>
      ))}
    </div>
  );
};
```

## 7. 后端 WebSocket 服务

### 文件：`memory-backend/server.js`

**核心实现**：

```javascript
const wss = new WebSocket.Server({ server, path: "/ws" });
const clients = new Map();

wss.on("connection", (ws, req) => {
  const userId = url.searchParams.get("userId");
  const coupleId = url.searchParams.get("coupleId");

  // 存储客户端
  clients.set(`${coupleId}-${userId}`, { ws, userId, coupleId });

  // 处理消息
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    // 广播给同一情侣关系中的其他用户
    clients.forEach((client, key) => {
      if (
        client.coupleId === coupleId &&
        client.userId !== userId &&
        client.ws.readyState === WebSocket.OPEN
      ) {
        client.ws.send(JSON.stringify(data));
      }
    });
  });
});
```

## 8. 数据流程

### 添加事件流程：

1. 用户 A 添加事件 → `addEvent()` → 后端 API
2. 后端返回新事件 → 更新本地状态
3. `broadcastAdd(newEvent)` → WebSocket 发送消息
4. 后端 WebSocket 接收 → 广播给用户 B
5. 用户 B 的 `onAdd` 回调触发 → 更新本地状态

### 删除事件流程：

1. 用户 A 删除事件 → `deleteEvent()` → 后端 API
2. 后端删除成功 → 更新本地状态
3. `broadcastDelete(eventId)` → WebSocket 发送消息
4. 后端 WebSocket 接收 → 广播给用户 B
5. 用户 B 的 `onDelete` 回调触发 → 更新本地状态

## 9. 注意事项

### 避免重复渲染

- WebSocket 消息中包含 `userId`，接收方会过滤自己发送的消息
- `socketService` 中自动过滤：`if (message.userId === this.userId) return;`

### 自动重连

- 连接断开后自动尝试重连（最多 5 次）
- 重连延迟递增：3s、6s、9s、12s、15s

### localStorage 缓存

- `coupleStore` 使用 `zustand/persist` 持久化
- 缓存 `coupleRelation`、`partnerId`、`events`
- 页面刷新后自动恢复

### 路由保护

- 所有情侣模式路由都需要包裹 `<CoupleRouteGuard>`
- 未绑定用户会自动显示绑定页面
- 绑定成功后自动刷新页面

## 10. 扩展其他协作页面

### 步骤：

1. 在页面中导入 `useRealtimeCollaboration`
2. 定义远程消息处理函数（`onAdd`、`onUpdate`、`onDelete`）
3. 调用 Hook 获取广播方法
4. 在本地操作后调用广播方法

### 示例（心愿清单）：

```typescript
// src/pages/couple/WishList.tsx
import { useRealtimeCollaboration } from "../../hooks/useRealtimeCollaboration";

const WishList = () => {
  const { events, addEvent, deleteEvent, setEvents } = useCoupleStore();

  const { broadcastAdd, broadcastDelete } =
    useRealtimeCollaboration<CoupleEvent>({
      roomId: coupleRelation?.id || "",
      onAdd: (event) => setEvents([...events, event]),
      onDelete: (id) => setEvents(events.filter((e) => e.id !== id)),
    });

  const handleAdd = async (content: string) => {
    const newEvent = await addEvent({ content, type: "wish" });
    broadcastAdd(newEvent);
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    broadcastDelete(id);
  };

  // ... 渲染逻辑
};
```

## 11. 测试建议

### 本地测试：

1. 启动后端：`cd memory-backend && npm start`
2. 启动前端：`npm run dev`
3. 打开两个浏览器窗口（或隐身模式）
4. 分别注册两个用户
5. 用户 A 发送绑定请求给用户 B
6. 用户 B 接受请求
7. 在任一窗口添加/删除事件，观察另一窗口是否实时更新

### 检查点：

- ✅ WebSocket 连接状态显示"已连接"
- ✅ 添加事件后，对方窗口立即显示
- ✅ 删除事件后，对方窗口立即移除
- ✅ 刷新页面后，数据仍然存在
- ✅ 断网后自动重连

## 12. 常见问题

### Q: WebSocket 连接失败？

A: 检查后端是否启动，端口是否为 3001，防火墙是否阻止

### Q: 消息重复渲染？

A: 检查是否正确过滤了自己发送的消息（`userId` 匹配）

### Q: 页面刷新后数据丢失？

A: 检查 `zustand/persist` 配置，确保 `localStorage` 正常工作

### Q: 路由守卫不生效？

A: 检查 `router.tsx` 中是否正确包裹 `<CoupleRouteGuard>`

## 总结

本实现提供了完整的情侣绑定和实时协作功能，核心特点：

1. **单例模式**：全局唯一 WebSocket 连接，避免重复创建
2. **自动重连**：网络断开后自动尝试重连
3. **消息过滤**：避免自己发送的消息重复渲染
4. **路由守卫**：未绑定用户自动跳转绑定页面
5. **状态持久化**：localStorage 缓存，刷新不丢失
6. **易于扩展**：统一的 Hook 接口，快速集成到新页面

所有协作页面只需调用 `useRealtimeCollaboration` Hook，即可实现实时同步！
