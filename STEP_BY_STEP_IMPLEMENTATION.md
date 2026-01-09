# 表格改造分步实现计划

## 项目概述

将现有的周评价表改造为 Excel 风格的可编辑表格，支持本地存储、后端 API 和实时同步。

## 现有资源分析

### 已有组件

1. **ExcelTable.tsx** - 完整的 Excel 风格表格组件

   - 支持单元格编辑
   - 键盘导航（方向键、Enter、Tab）
   - 添加/删除行列
   - 完善的 UI 和交互

2. **tableStorage.ts** - 完整的 localStorage 工具

   - 保存/读取表格数据
   - 版本控制
   - 数据合并策略
   - 导入/导出功能

3. **TableStyle.tsx** - 现有周评价表页面

   - 使用 textarea 实现
   - 已集成 WebSocket 实时协作
   - 需要改造为使用 ExcelTable

4. **useRealtimeCollaboration.ts** - WebSocket 实时协作 Hook
   - 已实现双方数据同步
   - 可直接复用

## 分步实现计划

### 第一步：集成 ExcelTable 到 TableStyle（最小改动）

**目标**：用 ExcelTable 替换现有的 textarea 表格
**时间**：15 分钟
**步骤**：

1. 在 TableStyle 中导入 ExcelTable 组件
2. 将周评价数据转换为 ExcelTable 的数据格式
3. 替换现有的 table 标签为 ExcelTable 组件
4. 保持现有的实时协作功能

**改动文件**：

- `src/pages/couple/TableStyle.tsx`

---

### 第二步：添加 localStorage 持久化（独立功能）

**目标**：表格数据自动保存到本地
**时间**：10 分钟
**步骤**：

1. 在 TableStyle 中导入 tableStorage 工具
2. 组件加载时从 localStorage 读取数据
3. 数据变化时自动保存到 localStorage
4. 添加保存状态提示

**改动文件**：

- `src/pages/couple/TableStyle.tsx`

---

### 第三步：创建活跃度数据 API（后端）

**目标**：提供活跃度数据接口
**时间**：20 分钟
**步骤**：

1. 在 Prisma schema 中添加 ActivityLog 模型
2. 创建数据库迁移
3. 在 couple-routes.js 中添加活跃度 API
   - GET /api/couple/activity - 获取活跃度数据
   - POST /api/couple/activity - 记录活跃度
4. 添加自动记录用户活跃度的中间件

**改动文件**：

- `memory-backend/prisma/schema.prisma`
- `memory-backend/couple-routes.js`

---

### 第四步：前端集成活跃度 API（前端）

**目标**：在热力图中显示真实数据
**时间**：15 分钟
**步骤**：

1. 在 api.ts 中添加活跃度 API 调用方法
2. 在 TableStyle 的 OnlineChart 组件中调用 API
3. 替换模拟数据为真实数据
4. 添加加载状态和错误处理

**改动文件**：

- `src/services/api.ts`
- `src/pages/couple/TableStyle.tsx`

---

### 第五步：增强 WebSocket 实时同步（优化）

**目标**：表格编辑实时同步到对方
**时间**：10 分钟
**步骤**：

1. 修改 ExcelTable 的 onChange 回调
2. 通过 useRealtimeCollaboration 广播表格变化
3. 接收对方的表格更新并应用
4. 添加冲突处理（基于时间戳）

**改动文件**：

- `src/pages/couple/TableStyle.tsx`

---

### 第六步：测试和优化（验证）

**目标**：确保所有功能正常工作
**时间**：15 分钟
**步骤**：

1. 测试表格编辑功能
2. 测试 localStorage 持久化
3. 测试实时同步（双浏览器）
4. 测试活跃度数据显示
5. 性能优化和 bug 修复

---

## 技术要点

### 数据格式转换

```typescript
// 旧格式（周评价）
interface WeeklyEvaluationData {
  id: string;
  weekNumber: number;
  user1Comment: string;
  user2Comment: string;
  lastEditBy: string | number;
}

// 新格式（ExcelTable）
interface TableData {
  headers: string[]; // ["周数", "我的评价", "对方的评价"]
  rows: string[][]; // [["第1周", "...", "..."], ...]
}
```

### WebSocket 消息格式

```typescript
{
  type: "couple-weekly-evaluation-table",
  action: "update",
  data: TableData,
  timestamp: number,
  userId: string
}
```

### localStorage 键名

```
couple_table_weekly-evaluation_{userId}
```

### API 端点

```
GET  /api/couple/activity?startDate=xxx&endDate=xxx
POST /api/couple/activity
```

## 预期效果

1. ✅ Excel 风格的可编辑表格
2. ✅ 本地数据持久化
3. ✅ 双方实时同步
4. ✅ 活跃度热力图显示真实数据
5. ✅ 流畅的用户体验

## 风险控制

1. **数据丢失风险**：localStorage + 后端双重保存
2. **同步冲突**：基于时间戳的冲突解决
3. **性能问题**：防抖处理频繁保存
4. **兼容性**：保留旧数据格式的迁移逻辑

## 下一步行动

**立即开始第一步**：集成 ExcelTable 到 TableStyle

- 最小改动
- 快速见效
- 为后续步骤打基础
