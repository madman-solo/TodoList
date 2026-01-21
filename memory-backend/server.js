const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const path = require("path");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

// 初始化
const app = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const PORT = 3001;

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 中间件
app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));

// Socket.io服务器
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 将io实例挂载到app上，供路由使用
app.set("io", io);

// 存储情侣房间的连接
const coupleRooms = new Map();

// Socket.io连接处理
io.on("connection", (socket) => {
  console.log("Socket.io客户端连接:", socket.id);

  // 加入情侣房间
  socket.on("join-couple-room", async ({ userId, coupleId }) => {
    if (!userId || !coupleId) {
      socket.emit("error", { message: "缺少userId或coupleId" });
      return;
    }

    // 验证coupleId有效性
    try {
      const relation = await prisma.coupleRelation.findFirst({
        where: {
          id: coupleId,
          OR: [{ user1Id: userId }, { user2Id: userId }],
          isActive: true,
        },
      });

      if (!relation) {
        socket.emit("error", { message: "无效的coupleId" });
        return;
      }

      // 加入房间
      socket.join(coupleId);
      socket.userId = userId;
      socket.coupleId = coupleId;

      // 记录连接
      if (!coupleRooms.has(coupleId)) {
        coupleRooms.set(coupleId, new Set());
      }
      coupleRooms.get(coupleId).add(socket.id);

      console.log(`用户${userId}加入情侣房间${coupleId}`);
      socket.emit("joined-room", { coupleId, userId });

      // 通知房间内其他用户
      socket.to(coupleId).emit("partner-online", { userId });
    } catch (error) {
      console.error("加入房间失败:", error);
      socket.emit("error", { message: "加入房间失败" });
    }
  });

  // 实时协作更新
  socket.on("collaboration-update", (data) => {
    if (!socket.coupleId) {
      return;
    }

    console.log("收到协作更新:", data);

    // 广播给房间内其他用户（不包括发送者）
    socket.to(socket.coupleId).emit("remote-update", {
      ...data,
      fromUserId: socket.userId,
    });
  });

  // 绑定成功通知
  socket.on("binding-success", ({ coupleId, userId }) => {
    console.log(`绑定成功通知: coupleId=${coupleId}, userId=${userId}`);
    // 通知房间内所有用户（包括发送者）
    io.to(coupleId).emit("couple-bound", { coupleId, userId });
  });

  // 解除绑定通知
  socket.on("unbind-couple", ({ coupleId }) => {
    console.log(`解除绑定通知: coupleId=${coupleId}`);
    // 通知房间内所有用户
    io.to(coupleId).emit("couple-unbound", { coupleId });

    // 清理房间
    if (coupleRooms.has(coupleId)) {
      coupleRooms.delete(coupleId);
    }
  });

  // 断开连接
  socket.on("disconnect", () => {
    console.log("Socket.io客户端断开:", socket.id);

    if (socket.coupleId) {
      // 从房间记录中移除
      const room = coupleRooms.get(socket.coupleId);
      if (room) {
        room.delete(socket.id);
        if (room.size === 0) {
          coupleRooms.delete(socket.coupleId);
        }
      }

      // 通知房间内其他用户
      socket.to(socket.coupleId).emit("partner-offline", {
        userId: socket.userId,
      });
    }
  });
});

// 引入必要的模块
app.use(express.json()); // 确保解析JSON请求体

// 存储绑定请求的内存数据库（假设已存在）
const coupleBindings = new Map();

// 处理绑定请求的接受/拒绝
app.put("/api/couple/bind/:requestId", (req, res) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;
    const currentUserId = req.headers["x-user-id"];

    // 1. 验证必要参数
    if (typeof accept !== "boolean") {
      return res.status(400).json({ error: "参数错误：accept必须为布尔值" });
    }
    if (!currentUserId) {
      return res.status(401).json({ error: "未提供用户身份信息" });
    }

    // 2. 查找绑定请求
    const bindingRequest = coupleBindings.get(requestId);
    if (!bindingRequest) {
      return res.status(404).json({ error: "绑定请求不存在" });
    }

    // 3. 验证请求接收者身份（必须是被请求方）
    if (bindingRequest.partnerId !== currentUserId) {
      return res.status(403).json({ error: "无权处理此请求" });
    }

    // 4. 更新绑定状态
    bindingRequest.status = accept ? "accepted" : "rejected";
    bindingRequest.updatedAt = new Date().toISOString();
    coupleBindings.set(requestId, bindingRequest);

    // 5. 成功响应
    res.status(200).json(bindingRequest);
  } catch (error) {
    // 捕获所有异常，避免返回500错误
    console.error("处理绑定请求失败:", error);
    res.status(500).json({
      error: "服务器处理失败",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});
// 认证相关接口模拟实现：
// 用户注册
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, password } = req.body;

    // 简单验证
    if (!name || !password) {
      return res.status(400).json({ error: "请填写所有必填字段" });
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { name },
    });

    if (existingUser) {
      return res.status(400).json({ error: "该用户名已被注册" });
    }

    // 创建新用户（实际项目中应该加密密码）
    const user = await prisma.user.create({
      data: {
        name,
        password, // 实际项目中应该使用bcrypt等工具加密
        avatar: null, // 【修复】初始化头像为null
      },
    });

    // 生成JWT token
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        password: user.password,
        avatar: user.avatar, // 【修复】返回头像字段
        createdAt: user.createdAt, // 【修复】返回注册时间
      },
    });
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({ error: "注册失败" });
  }
});

// 用户登录
app.post("/api/auth/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    // 验证输入
    if (!name || !password) {
      return res.status(400).json({ error: "用户名和密码不能为空" });
    }

    // 查找用户（包含头像字段和注册时间）
    const user = await prisma.user.findUnique({
      where: { name },
      select: {
        id: true,
        name: true,
        password: true,
        avatar: true, // 【修复】登录时加载头像
        createdAt: true, // 【修复】登录时加载注册时间
      },
    });

    // 简单验证
    if (!user || user.password !== password) {
      // 实际项目中应该验证加密后的密码
      return res.status(401).json({ error: "用户名或密码错误" });
    }

    // 生成JWT token
    const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        password: user.password,
        avatar: user.avatar, // 【修复】返回头像数据
        createdAt: user.createdAt, // 【修复】返回注册时间
      },
    });
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ error: "登录失败" });
  }
});
// 1. 推荐内容接口
app.get("/api/recommendations", async (req, res) => {
  try {
    // 从数据库查询各类推荐内容
    const themes = await prisma.theme.findMany({ take: 9 });
    const fonts = await prisma.font.findMany({
      take: 6,
      select: {
        id: true,
        name: true,
        isPremium: true,
        previewText: true,
        category: true,
        createdAt: true,
        url: true,
        preview: true, // 必须显式选择preview字段
      },
    });
    const backgrounds = await prisma.background.findMany({ take: 9 });
    const icons = await prisma.icon.findMany({ take: 12 });

    res.json({ themes, fonts, backgrounds, icons });
  } catch (error) {
    res.status(500).json({ error: "获取推荐内容失败" });
  }
});

// 2. 主题接口（支持分类筛选）
app.get("/api/themes", async (req, res) => {
  try {
    const { category } = req.query;
    const themes = await prisma.theme.findMany({
      where: category && category !== "all" ? { category } : {},
    });
    res.json(themes);
  } catch (error) {
    res.status(500).json({ error: "获取主题失败" });
  }
});

// 3. 字体接口
app.get("/api/fonts", async (req, res) => {
  try {
    const { category } = req.query;
    const fonts = await prisma.font.findMany({
      where: category && category !== "all" ? { category } : {},
    });
    res.json(fonts);
  } catch (error) {
    res.status(500).json({ error: "获取字体失败" });
  }
});

// 4. 背景接口
app.get("/api/backgrounds", async (req, res) => {
  try {
    const { category } = req.query;
    const backgrounds = await prisma.background.findMany({
      where: category && category !== "all" ? { category } : {},
    });
    res.json(backgrounds);
  } catch (error) {
    res.status(500).json({ error: "获取背景失败" });
  }
});

// 5.图标接口（修改后）
app.get("/api/icons", async (req, res) => {
  try {
    const { category } = req.query;
    const icons = await prisma.icon.findMany({
      where: category && category !== "all" ? { category } : {},
    });
    // 转换 format 为数组
    const formattedIcons = icons.map((icon) => ({
      ...icon,
      format: icon.format.split(","), // "svg,png" → ["svg", "png"]
    }));
    res.json(formattedIcons);
  } catch (error) {
    res.status(500).json({ error: "获取图标失败" });
  }
});
// 6. 轮播图接口
app.get("/api/carousel/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const carousels = await prisma.carousel.findMany({
      where: { type },
    });
    res.json(carousels);
  } catch (error) {
    res.status(500).json({ error: "获取轮播图失败" });
  }
});
// 7.每日精选轮播图
app.get("/api/dailyCarousel", async (req, res) => {
  try {
    const dailyItems = await prisma.daily.findMany(); // 从 daily 表查询数据
    res.json(dailyItems);
  } catch (err) {
    res.status(500).json({ error: "获取每日精选失败" });
  }
});
// 获取用户信息接口
app.get("/api/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 【修复】查找用户（支持字符串UUID）
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "用户不存在" });
    }

    res.json(user);
  } catch (error) {
    console.error("获取用户信息失败:", error);
    res.status(500).json({ error: "获取用户信息失败" });
  }
});

// 更新用户头像接口
app.put("/api/users/:userId/avatar", async (req, res) => {
  try {
    const { userId } = req.params;
    const { avatar } = req.body;

    console.log("收到头像更新请求:", { userId, avatarLength: avatar?.length });

    if (!avatar) {
      console.log("头像数据为空");
      return res.status(400).json({ error: "头像数据不能为空" });
    }

    // 【修复】更新用户头像（支持字符串UUID）
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        name: true,
        avatar: true,
      },
    });

    console.log("头像更新成功:", { userId, avatarSaved: !!updatedUser.avatar });
    res.json(updatedUser);
  } catch (error) {
    console.error("更新用户头像失败:", error);
    console.error("错误详情:", error.message);
    res.status(500).json({ error: "更新用户头像失败", details: error.message });
  }
});

// 情侣模式相关路由
const coupleRoutes = require("./couple-routes");
app.use("/api/couple", coupleRoutes);

// 启动服务
server.listen(PORT, () => {
  console.log(`后端接口运行在 http://localhost:${PORT}/api`);
  console.log(`WebSocket服务运行在 ws://localhost:${PORT}/ws`);
});
