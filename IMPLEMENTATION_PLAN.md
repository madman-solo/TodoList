# 情侣表格功能实现计划

## 目标

将现有的周评价表改造为 Excel 风格的可编辑表格，并添加本地存储、后端 API 和实时同步功能。

## 分步实现计划

### 第一步：创建 Excel 风格的可编辑表格组件 ✅

**目标**: 创建一个类似 Excel 的表格组件，支持单元格编辑、行列操作

#### 1.1 创建基础表格组件结构

- 创建 `src/components/ExcelTable.tsx` 组件
- 实现表格的基本渲染（行、列、单元格）
- 添加表头和行号显示

#### 1.2 添加单元格编辑功能

- 实现单元格点击进入编辑模式
- 支持文本输入和保存
- 添加键盘导航（Tab、Enter、方向键）

#### 1.3 添加行列操作功能

- 添加新增行/列按钮
- 实现删除行/列功能
- 支持拖拽调整列宽

---

### 第二步：实现 localStorage 本地存储 ✅

**目标**: 将表格数据保存到浏览器本地存储，实现离线编辑

#### 2.1 创建存储工具函数

- 创建 `src/utils/tableStorage.ts`
- 实现 `saveTableData()` 函数
- 实现 `loadTableData()` 函数
- 实现 `clearTableData()` 函数

#### 2.2 实现数据保存和读取

- 在表格数据变化时自动保存到 localStorage
- 组件初始化时从 localStorage 读取数据
- 添加数据版本控制（防止数据结构变化导致错误）

#### 2.3 添加数据同步逻辑

- 实现本地数据与服务器数据的合并策略
- 添加冲突检测（基于时间戳）
- 提供手动同步按钮

---

### 第三步：添加后端活跃度数据接口 ✅

**目标**: 创建后端 API 来存储和获取用户活跃度数据

#### 3.1 设计数据库表结构

- 在 `schema.prisma` 中添加 `UserActivity` 表
  ```prisma
  model UserActivity {
    id        String   @id @default(uuid())
    userId    String
    date      DateTime // 日期（精确到天）
    hours     Float    // 在线时长（小时）
    coupleId  String?  // 关联的情侣ID
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@unique([userId, date])
  }
  ```
- 运行数据库迁移

#### 3.2 创建 API 路由

- 在 `couple-routes.js` 中添加以下接口：
  - `POST /api/couple/activity` - 记录活跃度
  - `GET /api/couple/activity` - 获取活跃度数据
  - `GET /api/couple/activity/stats` - 获取统计数据

#### 3.3 实现数据统计逻辑

- 实现按日期范围查询
- 计算总在线时长、平均时长
- 计算最长连续活跃天数

---

### 第四步：实现 WebSocket 实时同步 ✅

**目标**: 利用现有的 WebSocket 实现双方数据实时同步

#### 4.1 集成现有 WebSocket

- 使用现有的 `useRealtimeCollaboration` hook
- 为表格数据创建专用的房间 ID
- 监听远程更新事件

#### 4.2 实现双向数据同步

- 本地修改时广播给对方
- 接收对方修改并更新本地数据
- 添加操作者标识（显示谁在编辑）

#### 4.3 处理冲突解决

- 实现"最后写入优先"策略
- 添加冲突提示 UI
- 提供手动解决冲突的选项

---

## 技术栈

- **前端**: React + TypeScript + TailwindCSS
- **状态管理**: Zustand (现有的 coupleStore)
- **实时通信**: Socket.io (现有的 useRealtimeCollaboration)
- **本地存储**: localStorage API
- **后端**: Express + Prisma + SQLite
- **数据库**: SQLite (现有)

---

## 文件结构

```
src/
├── components/
│   └── ExcelTable.tsx          # Excel风格表格组件
├── utils/
│   └── tableStorage.ts         # 本地存储工具
├── pages/couple/
│   └── TableStyle.tsx          # 主页面（已存在，需改造）
└── services/
    └── activityApi.ts          # 活跃度API调用

memory-backend/
├── couple-routes.js            # 情侣相关路由（需扩展）
└── prisma/
    └── schema.prisma           # 数据库模型（需添加UserActivity）
```

---

## 实现顺序建议

1. **第一步** (1-2 小时): 创建 Excel 表格组件基础功能
2. **第二步** (30 分钟): 实现 localStorage 存储
3. **第三步** (1 小时): 添加后端活跃度 API
4. **第四步** (30 分钟): 集成 WebSocket 实时同步
5. **测试** (30 分钟): 全面测试各功能

---

## 注意事项

1. 保持向后兼容：现有的周评价表数据不能丢失
2. 性能优化：大量数据时使用虚拟滚动
3. 错误处理：网络断开时的降级方案
4. 用户体验：添加加载状态、保存提示等
5. 数据安全：验证用户权限，防止数据泄露

---

## 下一步行动

开始实现第一步：创建 Excel 风格的可编辑表格组件
