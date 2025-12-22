# TodoList 项目完整梳理文档

## 📋 项目概述

**项目名称**: TodoList 情侣协作应用  
**项目定位**: 一个集待办事项管理、情侣互动、个性化定制于一体的全栈 Web 应用  
**技术栈**: React 18 + TypeScript + Zustand + Socket.io + Prisma + Express + SQLite

---

## 🎯 核心功能模块

### 1. 待办事项管理（TodoList）

- **拖拽排序**: 基于 `react-dnd` 实现待办项的拖拽重排（注：目前没有实现可以自主拖曳的功能）
- **状态管理**: 使用 Zustand 进行全局状态管理
- **本地持久化**: 数据存储在 localStorage，支持离线使用（注：目前不确定有没有bug）
- **实时更新**: 添加、删除、完成状态切换等操作实时响应

**技术亮点**:

- ✅ TypeScript 类型安全：通过 `ITodo` 接口约束数据结构
- ✅ 拖拽交互：`useDrag` + `useDrop` 实现直观的拖拽体验（注：目前没有实现）
- ✅ 状态同步：Zustand 的 `set` 方法确保状态不可变更新（注：没有理解）

### 2. 情侣协作模式（Couple Mode）

#### 2.1 情侣绑定系统

- **绑定流程**: 发送请求 → 接收通知 → 接受绑定 → 建立关系
- **防重复机制**:
  - 数据库层：`@@unique([user1Id, user2Id])` 唯一约束
  - 应用层：发送前检查现有关系和待处理请求
  - 并发控制：接受时再次检查，防止并发创建
- **实时通知**: Socket.io 推送绑定成功消息

**技术亮点**:

- ✅ 双重校验：localStorage + 后端验证，防止前端伪造
- ✅ ID 排序：确保 `user1Id < user2Id`，避免 (A,B) 和 (B,A) 重复
- ✅ 级联删除：Prisma 的 `onDelete: Cascade` 自动清理关联数据

#### 2.2 实时协作功能

- **未来清单（Future List）**: 共同规划未来计划
- **心愿单（Wish List）**: 记录彼此的心愿
- **回忆相册（Memories Album）**: 上传和分享照片回忆
- **情侣游戏（Couple Games）**: 互动小游戏增进感情

**技术亮点**:

- ✅ WebSocket 单例模式：全局唯一连接，避免资源浪费
- ✅ 消息过滤：通过 `fromUserId` 过滤自身消息，避免重复渲染
- ✅ 自动重连：网络断开后自动尝试重连（最多 5 次）
- ✅ 房间隔离：每对情侣独立的 Socket 房间，数据互不干扰

### 3. 个性化定制系统

#### 3.1 背景选择器（Background Selector）

- **主题切换**: 简约、活力、专业等多种主题风格
- **字体定制**: 书法、个性、手写等字体选择
- **背景图片**: 真人、动漫、插画等分类背景
- **图标库**: 系统、社交、商务等图标资源

**技术亮点**:

- ✅ 分类筛选：前端 `activeCategory` + 后端 `where` 条件实现动态筛选
- ✅ 查询参数传递：避免 HTTP 头中文编码问题
- ✅ 数据转换：SQLite 不支持数组，用逗号分隔字符串存储后端转换

#### 3.2 每日精选（Daily Selection）

- **轮播图展示**: 精选主题、字体、背景的轮播推荐
- **评论互动**: 用户可对精选内容发表评论

### 4. 用户系统

#### 4.1 认证与授权

- **注册登录**: 用户名密码注册，JWT Token 认证
- **路由守卫**: `ProtectedRoute` 保护需要登录的页面
- **自动填充控制**: `autoComplete` 属性优化表单体验

**技术亮点**:

- ✅ JWT 认证：后端 `authenticateToken` 中间件验证 Token
- ✅ 统一请求封装：`request` 函数自动添加 `Authorization` 头
- ✅ 双重路由守卫：前端路由拦截 + 后端接口验证

#### 4.2 个人中心

- **个人资料**: 头像、昵称、密码修改
- **我的收藏**: 收藏的主题、字体、背景、图标
- **偏好设置**: 通知、隐私、显示等个性化配置

### 5. 辅助功能

- **专注模式（Focus Page）**: 番茄钟计时器，提升工作效率
- **日记本（Diary）**: 记录每日心情和事件
- **生日提醒（Birthday）**: 重要日期提醒
- **纪念日（Anniversary）**: 情侣纪念日管理
- **日程安排（Schedule）**: 日历视图的日程管理
- **通知中心（Notifications）**: 系统消息和互动通知

---

## 🛠️ 技术栈详解

### 前端技术栈

| 技术                 | 版本    | 用途       | 核心特性                                             |
| -------------------- | ------- | ---------- | ---------------------------------------------------- |
| **React**            | 19.2.0  | UI 框架    | 函数式组件、Hooks、虚拟 DOM                          |
| **TypeScript**       | 5.9.3   | 类型系统   | 静态类型检查、接口定义、泛型                         |
| **Vite**             | 7.2.2   | 构建工具   | 快速冷启动、HMR 热更新                               |
| **React Router**     | 7.9.2   | 路由管理   | `createBrowserRouter` 编程式路由                     |
| **Zustand**          | 5.0.8   | 状态管理   | 轻量级、无 Provider、中间件支持                      |
| **Socket.io Client** | 4.8.1   | 实时通信   | WebSocket、自动重连、房间机制                        |
| **React DnD**        | 16.0.1  | 拖拽交互   | `useDrag`、`useDrop`、HTML5 Backend                  |
| **@dnd-kit**         | 6.3.1   | 拖拽排序   | 可访问性、触摸支持、性能优化（注：功能尚未实现）     |
| **Emotion**          | 11.14.0 | CSS-in-JS  | 动态样式、主题切换、样式组合                         |
| **React Icons**      | 5.5.0   | 图标库     | 多图标集、Tree-shaking                               |
| **Emoji Mart**       | 5.6.0   | 表情选择器 | 表情搜索、分类、自定义（注：这里的功能没有正确实现） |

### 后端技术栈

| 技术          | 版本 | 用途     | 核心特性                       |
| ------------- | ---- | -------- | ------------------------------ |
| **Node.js**   | -    | 运行时   | 事件驱动、非阻塞 I/O           |
| **Express**   | 4.x  | Web 框架 | 中间件、路由、RESTful API      |
| **Prisma**    | 5.x  | ORM      | 类型安全、迁移管理、可视化工具 |
| **SQLite**    | 3.x  | 数据库   | 轻量级、无服务器、文件存储     |
| **Socket.io** | 4.x  | 实时通信 | 双向通信、房间、广播           |
| **JWT**       | -    | 认证     | 无状态、跨域、Token 刷新       |

---

## 💡 技术亮点与创新点

### 1. TypeScript 类型安全体系

**问题场景**: 组件 Props 类型不匹配导致运行时错误

**解决方案**:

```typescript
// ❌ 错误：空对象断言导致运行时错误
const Input = () => {
  const { addTodo, todoList } = {} as InputProps;
  // todoList.find(...) 会报错，因为实际是空对象
};

// ✅ 正确：通过 Props 正确接收
const Input = ({ addTodo, todoList }: InputProps) => {
  const isExist = todoList.find((item) => item.content === val);
};
```

**技术价值**:

- 编译时发现错误，避免运行时崩溃
- IDE 智能提示，提升开发效率
- 类型契约确保组件间数据传递安全

### 2. React DnD 拖拽系统

**问题场景**: 如何确定拖拽的是哪一项？

**解决方案**:

```typescript
const [, drag] = useDrag<DragItem>({
  type: "TODO_ITEM",
  item: {
    index, // 数组索引，用于排序
    id, // 唯一 ID，用于标识
    type: "TODO_ITEM", // 类型匹配
    clientOffset: { x: 0, y: 0 }, // 拖拽坐标
  },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(), // 收集拖拽状态
  }),
});
```

**技术价值**:

- 通过 `index` 和 `id` 精准定位拖拽项
- `collect` 收集状态用于 UI 反馈（如半透明效果）
- 类型匹配确保只能拖拽到兼容的放置目标

### 3. Zustand 状态管理最佳实践

**问题场景**: 为什么必须在 `TodoState` 中声明方法？

**解决方案**:

```typescript
// ✅ 正确：在接口中声明方法
interface TodoState {
  todos: ITodo[];
  toggleTodo: (id: number) => void; // 必须声明
}

const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
}));

// ❌ 错误：未声明会导致 TypeScript 报错
const { toggleTodo } = useTodoStore();
// 类型"TodoState"上不存在属性"toggleTodo"
```

**技术价值**:

- TypeScript 类型契约确保方法存在性
- 编译时检查，避免调用不存在的方法
- IDE 自动补全，提升开发体验

### 4. React Router v6 路由配置

**问题场景**: `createBrowserRouter` 与 `<BrowserRouter>` 冲突

**解决方案**:

```typescript
// ❌ 错误：重复使用路由容器
<Router>  {/* BrowserRouter */}
  <RouterProvider router={router} />  {/* 已包含路由上下文 */}
</Router>

// ✅ 正确：RouterProvider 本身就是路由根容器
<BackgroundProvider>
  <RouterProvider router={router} />
</BackgroundProvider>
```

**技术价值**:

- 避免路由上下文冲突
- `createBrowserRouter` 支持数据加载、错误边界等高级特性
- 嵌套路由通过 `<Outlet />` 渲染子路由

### 5. Socket.io 实时协作架构

**问题场景**: 如何避免多个组件创建多个 WebSocket 连接？

**解决方案**:

```typescript
// ✅ 单例模式 + 发布订阅
class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  send(message: SocketMessage): void {
    this.socket?.emit("collaboration-update", {
      ...message,
      fromUserId: this.userId, // 自动附加发送者 ID
    });
  }
}
```

**技术价值**:

- 单例模式确保全局唯一连接，节省资源
- 发布订阅支持多个组件订阅同一连接
- 消息过滤避免接收自己发送的消息

### 6. 情侣绑定防重复机制

**问题场景**: 如何防止重复创建情侣关系？

**解决方案**:

```typescript
// ✅ 多层防护
// 1. 数据库层：唯一约束
@@unique([user1Id, user2Id])

// 2. 应用层：发送前检查
const existingRelation = await prisma.coupleRelation.findFirst({
  where: {
    OR: [
      { user1Id: userId, user2Id: partnerId },
      { user1Id: partnerId, user2Id: userId },
    ],
    isActive: true,
  },
});

// 3. 并发控制：接受时再次检查
if (existingRelation) {
  await prisma.coupleRequest.delete({ where: { id: requestId } });
  return res.status(200).json(existingRelation);
}

// 4. ID 排序：确保唯一映射
const coupleRelation = await prisma.coupleRelation.create({
  data: {
    user1Id: fromUserId < toUserId ? fromUserId : toUserId,
    user2Id: fromUserId < toUserId ? toUserId : fromUserId,
  },
});
```

**技术价值**:

- 数据库唯一约束是最后防线
- 应用层检查提前拦截，减少数据库压力
- ID 排序确保 (A,B) 和 (B,A) 映射到同一记录

### 7. HTTP 请求参数传递优化

**问题场景**: 请求头中文编码导致 "非 ISO-8859-1" 错误

**解决方案**:

```typescript
// ❌ 错误：请求头传递中文
headers: {
  Category: "真人背景",  // 违反 HTTP 头编码规范
}

// ✅ 正确：查询参数传递
const request = async <T>(endpoint: string, options: { params?: Record<string, string> }) => {
  let url = `${API_BASE_URL}${endpoint}`;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  // ...
};

// 调用
getBackgrounds: (category?: string) =>
  request<BackgroundItem[]>("/backgrounds", {
    params: { category: category || "all" },
  })
```

**技术价值**:

- 符合 HTTP 规范，避免编码问题
- 查询参数支持中文，无需 Base64 编码
- 后端通过 `req.query` 直接获取，简洁可靠

### 8. Prisma 数据库设计技巧

**问题场景**: SQLite 不支持数组类型

**解决方案**:

```prisma
// ❌ 错误：SQLite 不支持 String[]
model Icon {
  format String[]  // 报错！
}

// ✅ 正确：用逗号分隔字符串
model Icon {
  format String  // "svg,png"
}

// 后端转换
const formattedIcons = icons.map(icon => ({
  ...icon,
  format: icon.format.split(',')  // "svg,png" → ["svg", "png"]
}));
```

**技术价值**:

- 绕过 SQLite 限制，保持数据结构简洁
- 前端接收时自动转换，业务逻辑不受影响
- 迁移到 PostgreSQL 等数据库时可直接改为数组类型

### 9. CSS 层级管理规范

**问题场景**: 按钮被遮罩层覆盖，无法点击

**解决方案**:

```css
/* ✅ 规范化 z-index 层级 */
/* 导航栏 */
.nav {
  position: fixed;
  z-index: 100;
}

/* 弹窗遮罩 */
.overlay {
  z-index: 200;
}

/* 按钮（需要置顶） */
.back-btn {
  z-index: 999;
}
```

**技术价值**:

- 划分 z-index 区间，避免数值混乱
- 使用 CSS 变量统一管理，便于维护
- 开发时主动测试层级，避免遮挡问题

### 10. 空值合并运算符（??）应用

**问题场景**: `||` 和 `??` 的区别

**解决方案**:

```typescript
// ❌ 错误：|| 会把 0、''、false 当作假值
const count = 0;
const displayCount = count || "默认值"; // 结果：'默认值'（错误！）

// ✅ 正确：?? 只判断 null/undefined
const displayCount = count ?? "默认值"; // 结果：0（正确！）
```

**技术价值**:

- 精准判断空值，避免误判 0、''、false
- ES2020 标准，现代浏览器原生支持
- 适用于默认值场景，如配置项、可选参数

---

## 🏗️ 项目架构设计

### 1. 前端架构

```
src/
├── components/          # 公共组件
│   ├── Layout.tsx       # 布局容器
│   ├── ProtectedRoute.tsx  # 路由守卫
│   ├── CoupleRouteGuard.tsx  # 情侣模式守卫
│   ├── BackgroundContext.tsx  # 背景数据上下文
│   └── TodoList/        # 待办事项组件
│       ├── Input/       # 输入框
│       └── List/        # 列表 + 拖拽项
├── pages/               # 页面组件
│   ├── Home.tsx         # 首页
│   ├── Login.tsx        # 登录
│   ├── Register.tsx     # 注册
│   ├── CoupleMode.tsx   # 情侣模式
│   ├── background/      # 背景选择器子页面
│   ├── couple/          # 情侣功能子页面
│   ├── intermy/         # 个人中心子页面
│   └── outermy/         # 辅助功能子页面
├── store/               # 状态管理
│   ├── store.ts         # 待办事项 Store
│   └── coupleStore.ts   # 情侣模式 Store
├── services/            # 服务层
│   ├── api.ts           # API 请求封装
│   ├── socketService.ts # Socket.io 单例
│   └── useDataSync.ts   # 数据同步 Hook
├── hooks/               # 自定义 Hooks
│   ├── useRealtimeCollaboration.ts  # 实时协作
│   └── useWebSocket.ts  # WebSocket 连接
├── utils/               # 工具函数
│   └── errorHandler.ts  # 错误处理
├── router.tsx           # 路由配置
└── main.tsx             # 应用入口
```

### 2. 后端架构

```
memory-backend/
├── prisma/
│   ├── schema.prisma    # 数据库模型
│   ├── migrations/      # 迁移文件
│   ├── seed.js          # 初始数据
│   └── dev.db           # SQLite 数据库文件
├── server.js            # Express 服务器 + Socket.io
├── couple-routes.js     # 情侣功能路由
├── package.json         # 后端依赖
└── .env                 # 环境变量
```

### 3. 数据库设计

```prisma
// 核心表结构
model User {
  id        String   @id @default(uuid())
  name      String   @unique
  password  String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model CoupleRelation {
  id        String        @id @default(uuid())
  user1Id   String
  user2Id   String
  isActive  Boolean       @default(true)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  events    CoupleEvent[]

  @@unique([user1Id, user2Id])  // 防止重复绑定
}

model CoupleRequest {
  id         String   @id @default(uuid())
  fromUserId String
  toUserId   String
  createdAt  DateTime @default(now())

  @@unique([fromUserId, toUserId])  // 防止重复请求
}

model CoupleEvent {
  id             String         @id @default(uuid())
  coupleId       String
  content        String
  type           String         // future/wish/memory
  createdBy      String
  createdAt      DateTime       @default(now())
  coupleRelation CoupleRelation @relation(...)
}

// 个性化资源表
model Theme { ... }
model Font { ... }
model Background { ... }
model Icon { ... }
model Carousel { ... }
model Daily { ... }
```

---

## 🔧 关键技术实现

### 1. 待办事项拖拽排序

```typescript
// Item.tsx - 拖拽源
const [{ isDragging }, drag] = useDrag<DragItem>({
  type: "TODO_ITEM",
  item: { index, id, type: "TODO_ITEM", clientOffset: { x: 0, y: 0 } },
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
});

// List.tsx - 放置目标
const [, drop] = useDrop<DragItem>({
  accept: "TODO_ITEM",
  hover: (draggedItem) => {
    if (draggedItem.index !== index) {
      moveTodo(draggedItem.index, index);
      draggedItem.index = index;
    }
  },
});
```

### 2. 实时协作 Hook

```typescript
export const useRealtimeCollaboration = <T>({
  roomId,
  onAdd,
  onUpdate,
  onDelete,
}: UseRealtimeCollaborationProps<T>) => {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const coupleId = localStorage.getItem("coupleId");

    // 连接 Socket
    socketService.connect(userId, coupleId);

    // 订阅消息
    const unsubscribe = socketService.subscribe((message) => {
      switch (message.type) {
        case "EVENT_ADDED":
          onAdd?.(message.data as T);
          break;
        case "EVENT_UPDATED":
          onUpdate?.(message.data as T);
          break;
        case "EVENT_DELETED":
          onDelete?.(message.data as string);
          break;
      }
    });

    return () => unsubscribe();
  }, [roomId, onAdd, onUpdate, onDelete]);

  const broadcastAdd = useCallback((item: T) => {
    socketService.send({ type: "EVENT_ADDED", data: item });
  }, []);

  return { broadcastAdd, isConnected: socketService.isConnected() };
};
```

### 3. 路由守卫双重校验

```typescript
const CoupleRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isBound, setIsBound] = useState(false);

  useEffect(() => {
    const validateBinding = async () => {
      // 第一重：localStorage 校验
      const isCoupleBound = localStorage.getItem("isCoupleBound");
      const coupleId = localStorage.getItem("coupleId");

      if (isCoupleBound !== "true" || !coupleId) {
        setIsBound(false);
        setIsValidating(false);
        return;
      }

      // 第二重：后端校验
      try {
        const response = await fetch(
          "http://localhost:3001/api/couple/relation",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.ok) {
          const relation = await response.json();
          setIsBound(relation && relation.id === coupleId);
        } else {
          setIsBound(false);
          localStorage.removeItem("coupleId");
          localStorage.removeItem("isCoupleBound");
        }
      } catch (error) {
        setIsBound(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateBinding();
  }, []);

  if (isValidating) return <div>验证绑定状态...</div>;
  if (!isBound)
    return <CoupleBinding onBindingSuccess={() => window.location.reload()} />;
  return <>{children}</>;
};
```

### 4. 情侣绑定接受请求

```typescript
router.post("/accept", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    // 验证请求存在性和权限
    const request = await prisma.coupleRequest.findUnique({
      where: { id: requestId },
      include: {
        fromUser: { select: { id: true, name: true } },
        toUser: { select: { id: true, name: true } },
      },
    });

    if (!request || request.toUserId !== userId) {
      return res.status(403).json({ message: "无权操作此请求" });
    }

    // 防止重复创建（并发安全）
    const existingRelation = await prisma.coupleRelation.findFirst({
      where: {
        OR: [
          { user1Id: request.fromUserId, user2Id: request.toUserId },
          { user1Id: request.toUserId, user2Id: request.fromUserId },
        ],
        isActive: true,
      },
    });

    if (existingRelation) {
      await prisma.coupleRequest.delete({ where: { id: requestId } });
      return res.status(200).json(existingRelation);
    }

    // 创建情侣关系（ID 排序确保唯一性）
    const coupleRelation = await prisma.coupleRelation.create({
      data: {
        user1Id:
          request.fromUserId < request.toUserId
            ? request.fromUserId
            : request.toUserId,
        user2Id:
          request.fromUserId < request.toUserId
            ? request.toUserId
            : request.fromUserId,
        isActive: true,
      },
    });

    // 清理所有相关请求
    await prisma.coupleRequest.deleteMany({
      where: {
        OR: [
          { fromUserId: request.fromUserId, toUserId: request.toUserId },
          { fromUserId: request.toUserId, toUserId: request.fromUserId },
        ],
      },
    });

    // Socket.io 实时通知双方
    const io = req.app.get("io");
    if (io) {
      io.emit("couple-bound", {
        coupleId: coupleRelation.id,
        user1: request.fromUser,
        user2: request.toUser,
      });
    }

    res.status(200).json(coupleRelation);
  } catch (error) {
    console.error("[接受请求] 失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});
```

---

## 📝 开发过程中的问题与解决

### 问题 1: TypeScript 类型检查错误

**现象**: `todoList.find(...)` 报错，提示类型不匹配

**原因**: 使用 `{} as InputProps` 临时赋值，实际值是空对象

**解决**: 正确接收 Props 参数

```typescript
const Input = ({ addTodo, todoList }: InputProps) => {
  const isExist = todoList.find((item) => item.content === val);
};
```

### 问题 2: React DnD 拖拽类型不匹配

**现象**: `useDrag` 泛型与 `item` 类型不一致

**原因**: `item` 缺少 `clientOffset` 字段

**解决**: 完善 `DragItem` 类型定义

```typescript
type DragItem = {
  index: number;
  id: number;
  type: "TODO_ITEM";
  clientOffset: { x: number; y: number } | null;
};
```

### 问题 3: 路由匹配优先级问题

**现象**: 点击主题后再点击推荐显示页面出错

**原因**: 路由配置中 `index: true` 与嵌套路由冲突

**解决**: 调整路由配置，确保默认页路径正确

```typescript
{
  path: "background",
  element: <BackgroundSelector />,
  children: [
    { index: true, element: <RecommendContent /> },  // 推荐内容作为默认页
    { path: "theme", element: <ThemePage /> },
  ]
}
```

### 问题 4: CSS 层级导致按钮无法点击

**现象**: 按钮被遮罩层覆盖，点击无反应

**原因**: `z-index` 管理混乱，遮罩层 z-index 高于按钮

**解决**: 规范化 z-index 层级

```css
.overlay {
  z-index: 200;
}
.back-btn {
  z-index: 999; /* 确保按钮在最上层 */
}
```

### 问题 5: 输入框无法输入

**现象**: 输入框点击后无法输入内容

**原因**: 未正确绑定 `value` 和 `onChange`

**解决**: 双向绑定状态

```typescript
const [value, setValue] = useState("");
<input type="text" value={value} onChange={(e) => setValue(e.target.value)} />;
```

### 问题 6: SQLite 不支持数组类型

**现象**: Prisma 迁移失败，提示 `String[]` 不支持

**原因**: SQLite 没有原生数组类型

**解决**: 用逗号分隔字符串存储

```prisma
model Icon {
  format String  // "svg,png"
}

// 后端转换
const formattedIcons = icons.map(icon => ({
  ...icon,
  format: icon.format.split(',')
}));
```

### 问题 7: Prisma Studio 无法启动

**现象**: 提示 `Missing required environment variable: DATABASE_URL`

**原因**: `.env` 文件未被正确读取

**解决**: 手动指定环境变量

```powershell
$env:DATABASE_URL="file:./dev.db"; npx prisma studio
```

### 问题 8: HTTP 请求头中文编码错误

**现象**: 请求返回 "非 ISO-8859-1 编码" 错误

**原因**: HTTP 头不支持中文字符

**解决**: 改用查询参数传递

```typescript
// 前端
getBackgrounds: (category?: string) =>
  request<BackgroundItem[]>("/backgrounds", {
    params: { category: category || "all" },
  });

// 后端
app.get("/api/backgrounds", async (req, res) => {
  const { category } = req.query;
  // ...
});
```

### 问题 9: Socket.io 通知失效

**现象**: 接受绑定请求后，对方无法收到通知

**原因**: `io` 实例未挂载到 Express app

**解决**: 正确挂载 io 实例

```javascript
// server.js
const io = new Server(server, { cors: { ... } });
app.set("io", io);  // 关键：挂载到 app

// couple-routes.js
const io = req.app.get("io");
if (io) {
  io.emit("couple-bound", { ... });
}
```

### 问题 10: 认证失败 401

**现象**: 绑定接受请求返回 401 Unauthorized

**原因**: 前端请求缺少 `Authorization` 头

**解决**: 统一添加认证头

```typescript
const response = await fetch("http://localhost:3001/api/couple/relation", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});
```

---

## 🚀 项目启动指南

### 1. 环境准备

**前置要求**:

- Node.js >= 16.x
- npm >= 8.x

### 2. 后端启动

```bash
# 进入后端目录
cd memory-backend

# 安装依赖
npm install

# 配置环境变量
echo 'DATABASE_URL="file:./dev.db"' > .env

# 执行数据库迁移
npx prisma migrate dev --name init

# 启动后端服务
node server.js
```

后端服务运行在 `http://localhost:3001`

### 3. 前端启动

```bash
# 返回项目根目录
cd ..

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端服务运行在 `http://localhost:5173`

### 4. 数据库管理

```bash
# 打开 Prisma Studio（可视化数据库管理）
cd memory-backend
$env:DATABASE_URL="file:./dev.db"; npx prisma studio
```

Prisma Studio 运行在 `http://localhost:5555`

---

## 📊 项目数据流

### 1. 待办事项数据流

```
用户操作 → 组件事件 → Zustand Store → localStorage → UI 更新
   ↓
拖拽排序 → react-dnd → moveTodo → 更新 todos 数组 → 重新渲染
```

### 2. 情侣协作数据流

```
用户A操作 → 本地Store更新 → Socket.io发送 → 后端广播 → 用户B接收 → 更新UI
   ↓
数据持久化 → Prisma → SQLite → 后端API → 前端请求 → 初始化数据
```

### 3. 认证授权流程

```
注册/登录 → 后端验证 → 生成JWT Token → 前端存储 → 请求携带Token → 后端验证 → 返回数据
   ↓
路由守卫 → ProtectedRoute → 检查Token → 有效则渲染 → 无效则跳转登录
```

---

## 🎨 项目亮点总结

### 技术创新点

1. **TypeScript 全栈类型安全**: 前后端统一类型定义，Prisma 自动生成类型
2. **WebSocket 单例模式**: 全局唯一连接 + 发布订阅，支持多组件协作
3. **防重复机制**: 数据库约束 + 应用层检查 + 并发控制，三重防护
4. **拖拽交互优化**: react-dnd + @dnd-kit 双库结合，兼顾功能和性能
5. **路由守卫双重校验**: 前端 localStorage + 后端 API，确保安全性

### 工程化实践

1. **模块化架构**: 组件、页面、服务、工具分层清晰
2. **状态管理规范**: Zustand 轻量级方案，避免 Redux 复杂度
3. **API 请求封装**: 统一错误处理、认证头、查询参数
4. **数据库迁移管理**: Prisma 版本化迁移，支持团队协作
5. **日志系统**: 结构化日志，便于问题排查

### 用户体验优化

1. **实时协作**: Socket.io 实现毫秒级同步
2. **拖拽排序**: 直观的交互方式
3. **路由懒加载**: 按需加载，提升首屏速度（注：目前不知道懒加载的实现逻辑）
4. **错误边界**: 优雅处理异常，避免白屏
5. **加载状态**: 骨架屏、Loading 提示（注：目前尚不清楚是否用到骨架屏）

---

## 📚 技术文档参考

### 核心技术文档

- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Zustand 文档](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Router 文档](https://reactrouter.com/)
- [Socket.io 文档](https://socket.io/docs/v4/)
- [Prisma 文档](https://www.prisma.io/docs)
- [React DnD 文档](https://react-dnd.github.io/react-dnd/)

### 项目相关文档

- `TECHNICAL_ANALYSIS.md`: 情侣协作功能技术分析
- `COUPLE_COLLABORATION_GUIDE.md`: 情侣协作开发指南
- `IMPLEMENTATION_SUMMARY.md`: 实现总结
- `OPTIMIZATION_SUMMARY.md`: 优化总结

---

## 🔮 未来扩展方向

### 功能扩展

1. **多设备同步**: 将 localStorage 替换为后端 API，支持跨设备访问
2. **图片云存储**: 集成 OSS/S3，支持大容量照片存储
3. **消息推送**: 集成 WebPush，支持浏览器通知
4. **数据导出**: 支持导出待办事项、回忆相册为 PDF/Excel
5. **主题商店**: 用户可上传和分享自定义主题

### 技术优化

1. **性能优化**: React.memo、useMemo、虚拟列表
2. **PWA 支持**: Service Worker、离线缓存
3. **国际化**: i18n 多语言支持
4. **单元测试**: Jest + React Testing Library
5. **CI/CD**: GitHub Actions 自动化部署

### 数据库迁移

1. **PostgreSQL**: 支持更复杂的查询和数据类型
2. **Redis**: 缓存热点数据，提升性能
3. **MongoDB**: 存储非结构化数据（如日记、回忆）

---

## 📝 开发规范

### 代码规范

1. **命名规范**: 组件 PascalCase，函数 camelCase，常量 UPPER_CASE
2. **文件组织**: 一个文件一个组件，相关文件放在同一目录
3. **类型定义**: 优先使用 `interface`，复杂类型用 `type`
4. **注释规范**: 复杂逻辑必须注释，公共函数写 JSDoc

### Git 规范

1. **分支管理**: main（生产）、dev（开发）、feature/xxx（功能）
2. **提交信息**: `feat:`、`fix:`、`docs:`、`style:`、`refactor:`
3. **代码审查**: PR 必须经过 Review 才能合并

### 测试规范

1. **单元测试**: 覆盖核心业务逻辑
2. **集成测试**: 测试组件间交互
3. **E2E 测试**: 测试关键用户流程

---

## 🙏 致谢

本项目在开发过程中参考了以下优秀开源项目和技术文章：

- React 官方示例
- Zustand 官方示例
- Prisma 官方教程
- Socket.io 官方示例
- React DnD 官方示例

感谢所有开源社区的贡献者！

---

## 📄 许可证



---

**文档版本**: v1.0  
**最后更新**: 2025-12-18  
**维护者**: TodoList 开发者赵明园
