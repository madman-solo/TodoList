# 情侣绑定+双人实时协作功能实现总结

## 技术栈

- React 18 + TypeScript + Hooks
- Socket.io-client (WebSocket)
- Zustand (状态管理)
- Tailwind CSS

## 核心功能实现

### 1. 情侣绑定流程

**完整流程：**

1. 用户 A 发送绑定请求 → 后端创建 CoupleRequest
2. 用户 B 接收请求 → 显示在待处理列表
3. 用户 B 同意 → 后端创建 CoupleRelation，生成唯一 coupleId
4. 双方 localStorage 存储：`coupleId` + `isCoupleBound="true"`
5. 拒绝/未处理请求 → 保持未绑定状态，localStorage 无相关字段

**关键文件：**

- `src/components/CoupleBinding.tsx` - 绑定 UI 组件
- `src/store/coupleStore.ts` - 状态管理（新增 coupleId、isCoupleBound 字段）
- `memory-backend/couple-routes.js` - 后端 API（新增/validate 端点）

**校验逻辑：**

- 禁止绑定自己
- 禁止重复绑定
- 未处理请求不标记为已绑定

### 2. 路由守卫（双重校验）

**实现位置：** `src/components/CoupleRouteGuard.tsx`

**校验流程：**

1. **第一重：localStorage 校验**
   - 检查`isCoupleBound === "true"`
   - 检查`coupleId`存在
2. **第二重：后端校验**
   - 调用`/api/couple/relation`验证 coupleId 有效性
   - 验证返回的 coupleId 与 localStorage 一致

**未通过校验：** 跳转到绑定页面，禁止访问情侣模式子路由

### 3. 实时协作（WebSocket）

**Socket 服务：** `src/services/socketService.ts`

- 全局单例模式
- 自动重连机制（最多 5 次，延迟递增）
- 连接前校验：`isCoupleBound="true"` + `coupleId`有效
- 过滤自身发送的消息，避免重复渲染

**协作 Hook：** `src/hooks/useRealtimeCollaboration.ts`

- 仅在绑定状态下建立连接
- 支持事件：添加、更新、删除、同步
- 原子操作广播

**消息类型：**

- `EVENT_ADDED` - 添加事件
- `EVENT_UPDATED` - 更新事件
- `EVENT_DELETED` - 删除事件
- `EVENTS_SYNC` - 全量同步

### 4. 数据持久化

**localStorage 策略：**

- **已绑定用户：** 缓存`coupleId`、`isCoupleBound`、`events`
- **未绑定用户：** 无缓存，localStorage 中无相关字段
- **解绑时：** 清空所有情侣相关数据

**Zustand 持久化配置：**

```typescript
partialize: (state) => ({
  coupleRelation: state.coupleRelation,
  partnerId: state.partnerId,
  coupleId: state.coupleId,
  isCoupleBound: state.isCoupleBound,
  events: state.isCoupleBound ? state.events : [], // 仅绑定状态缓存
});
```

### 5. 后端 API 端点

**新增端点：**

- `POST /api/couple/validate` - 验证 coupleId 有效性

**现有端点：**

- `POST /api/couple/bind` - 发送绑定请求
- `GET /api/couple/requests` - 获取待处理请求
- `POST /api/couple/accept` - 接受请求
- `POST /api/couple/reject` - 拒绝请求
- `GET /api/couple/relation` - 获取情侣关系
- `POST /api/couple/unbind` - 解除绑定
- `GET /api/couple/events` - 获取事件列表
- `POST /api/couple/events` - 添加事件
- `PUT /api/couple/events/:id` - 更新事件
- `DELETE /api/couple/events/:id` - 删除事件

## 关键约束实现

### ✅ 初始状态强制清空

- 新用户 localStorage 无`coupleId`/`isCoupleBound`字段
- 默认未绑定状态

### ✅ 路由双重校验

- localStorage + 后端验证
- 任一不满足 → 跳转绑定页

### ✅ Socket 全局单例

- 避免重复创建连接
- 自动重连机制

### ✅ 原子操作

- 事件增删改使用原子更新
- 广播前先更新本地状态

### ✅ 最小化代码

- 仅实现核心功能
- 无冗余依赖

## 使用示例

### 协作页面集成

```typescript
import { useRealtimeCollaboration } from "../hooks/useRealtimeCollaboration";

const { broadcastAdd, broadcastDelete, isConnected } =
  useRealtimeCollaboration<CoupleEvent>({
    roomId: coupleRelation?.id || "",
    onAdd: handleRemoteAdd,
    onDelete: handleRemoteDelete,
  });

// 添加事件
const newEvent = await addEvent({ content, type, position });
broadcastAdd(newEvent); // 广播给对方

// 删除事件
await deleteEvent(eventId);
broadcastDelete(eventId); // 广播给对方
```

## 测试要点

1. 绑定流程：发送请求 → 同意/拒绝 → localStorage 状态
2. 路由守卫：未绑定访问情侣模式 → 跳转绑定页
3. 实时协作：双方同时操作 → 数据实时同步
4. 解绑：清空 localStorage + 断开 WebSocket
5. 重连机制：网络断开 → 自动重连

## 注意事项

- WebSocket 连接仅在`isCoupleBound="true"`且`coupleId`有效时建立
- 所有协作页面需包裹在`CoupleRouteGuard`内
- 后端需启动 WebSocket 服务（端口 3001）
- 消息过滤：忽略自身发送的更新
