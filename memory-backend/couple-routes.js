const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const router = express.Router();
const prisma = new PrismaClient();

// JWT验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "需要登录" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ message: "无效的token" });
      }
      req.user = user;
      next();
    }
  );
};

// 发送绑定请求
router.post("/bind", authenticateToken, async (req, res) => {
  try {
    const { partnerId } = req.body;
    const userId = req.user.id;

    if (!partnerId) {
      return res.status(400).json({ message: "请提供对方用户ID" });
    }

    if (partnerId === userId) {
      return res.status(400).json({ message: "不能绑定自己" });
    }

    // 检查对方用户是否存在
    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
    });

    if (!partner) {
      return res.status(404).json({ message: "对方用户不存在" });
    }

    // 检查是否已经有情侣关系
    const existingRelation = await prisma.coupleRelation.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: partnerId },
          { user1Id: partnerId, user2Id: userId },
        ],
        isActive: true,
      },
    });

    if (existingRelation) {
      return res.status(400).json({ message: "已经建立了情侣关系" });
    }

    // 创建或更新绑定请求
    const request = await prisma.coupleRequest.upsert({
      where: {
        fromUserId_toUserId: {
          fromUserId: userId,
          toUserId: partnerId,
        },
      },
      update: {
        createdAt: new Date(),
      },
      create: {
        fromUserId: userId,
        toUserId: partnerId,
      },
    });

    res.json({
      message: "绑定请求已发送，等待对方确认",
      request,
    });
  } catch (error) {
    console.error("发送绑定请求失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取待处理的绑定请求
router.get("/requests", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await prisma.coupleRequest.findMany({
      where: { toUserId: userId },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(requests);
  } catch (error) {
    console.error("获取绑定请求失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 接受绑定请求 - 修复500错误：完善错误处理和Socket.io通知
router.post("/accept", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    // 参数验证
    if (!requestId) {
      return res.status(400).json({ message: "缺少requestId参数" });
    }

    // 查找请求
    const request = await prisma.coupleRequest.findUnique({
      where: { id: requestId },
      include: {
        fromUser: { select: { id: true, name: true } },
        toUser: { select: { id: true, name: true } },
      },
    });

    if (!request) {
      return res.status(404).json({ message: "请求不存在" });
    }

    if (request.toUserId !== userId) {
      return res.status(403).json({ message: "无权操作此请求" });
    }

    // 创建情侣关系
    const coupleRelation = await prisma.coupleRelation.create({
      data: {
        user1Id: Math.min(request.fromUserId, request.toUserId),
        user2Id: Math.max(request.fromUserId, request.toUserId),
        isActive: true,
      },
    });

    // 删除所有相关的绑定请求
    await prisma.coupleRequest.deleteMany({
      where: {
        OR: [
          { fromUserId: request.fromUserId, toUserId: request.toUserId },
          { fromUserId: request.toUserId, toUserId: request.fromUserId },
        ],
      },
    });

    // 获取双方用户信息
    const user1 = await prisma.user.findUnique({
      where: { id: request.fromUserId },
      select: { id: true, name: true },
    });
    const user2 = await prisma.user.findUnique({
      where: { id: request.toUserId },
      select: { id: true, name: true },
    });

    // 返回完整的情侣关系信息
    const response = {
      ...coupleRelation,
      user1,
      user2,
      partner: userId === request.fromUserId ? user2 : user1,
    };

    // 修复：通过Socket.io通知双方绑定成功
    const io = req.app.get("io");
    if (io) {
      // 通知双方用户（使用广播方式）
      io.emit("couple-bound", {
        coupleId: coupleRelation.id,
        user1,
        user2,
        fromUserId: request.fromUserId,
        toUserId: request.toUserId,
      });
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("接受绑定请求失败:", error);
    console.error("错误堆栈:", error.stack);
    res.status(500).json({
      message: "服务器错误",
      error: error.message,
    });
  }
});

// 拒绝绑定请求
router.post("/reject", authenticateToken, async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user.id;

    // 查找请求
    const request = await prisma.coupleRequest.findUnique({
      where: { id: requestId },
      include: {
        fromUser: { select: { id: true, name: true } },
      },
    });

    if (!request) {
      return res.status(404).json({ message: "请求不存在" });
    }

    if (request.toUserId !== userId) {
      return res.status(403).json({ message: "无权操作此请求" });
    }

    // 删除请求
    await prisma.coupleRequest.delete({
      where: { id: requestId },
    });

    res.json({
      message: "已拒绝绑定请求",
      fromUserId: request.fromUserId,
    });
  } catch (error) {
    console.error("拒绝绑定请求失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取当前情侣关系
router.get("/relation", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const relation = await prisma.coupleRelation.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
    });

    if (!relation) {
      return res.json(null);
    }

    // 获取对方用户信息
    const partnerId =
      relation.user1Id === userId ? relation.user2Id : relation.user1Id;
    const partner = await prisma.user.findUnique({
      where: { id: partnerId },
      select: { id: true, name: true },
    });

    res.json({
      ...relation,
      partner,
    });
  } catch (error) {
    console.error("获取情侣关系失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 验证coupleId有效性
router.post("/validate", authenticateToken, async (req, res) => {
  try {
    const { coupleId } = req.body;
    const userId = req.user.id;

    if (!coupleId) {
      return res.status(400).json({ valid: false, message: "缺少coupleId" });
    }

    // 查找情侣关系
    const relation = await prisma.coupleRelation.findFirst({
      where: {
        id: coupleId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
    });

    if (!relation) {
      return res.json({ valid: false, message: "coupleId无效或已失效" });
    }

    res.json({ valid: true, coupleId: relation.id });
  } catch (error) {
    console.error("验证coupleId失败:", error);
    res.status(500).json({ valid: false, message: "服务器错误" });
  }
});

// 解除情侣关系
router.post("/unbind", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 查找并删除情侣关系
    const relation = await prisma.coupleRelation.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
    });

    if (!relation) {
      return res.status(404).json({ message: "没有找到情侣关系" });
    }

    // 删除所有相关事件
    await prisma.coupleEvent.deleteMany({
      where: { coupleId: relation.id },
    });

    // 删除情侣关系
    await prisma.coupleRelation.delete({
      where: { id: relation.id },
    });

    res.json({ message: "已解除情侣关系" });
  } catch (error) {
    console.error("解除情侣关系失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 获取情侣事件
router.get("/events", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 查找情侣关系
    const relation = await prisma.coupleRelation.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
    });

    if (!relation) {
      return res.status(404).json({ message: "没有找到情侣关系" });
    }

    // 获取所有事件
    const events = await prisma.coupleEvent.findMany({
      where: { coupleId: relation.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(events);
  } catch (error) {
    console.error("获取事件失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 添加事件
router.post("/events", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, type, position } = req.body;

    if (!content || !type) {
      return res.status(400).json({ message: "内容和类型不能为空" });
    }

    // 查找情侣关系
    const relation = await prisma.coupleRelation.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
        isActive: true,
      },
    });

    if (!relation) {
      return res.status(404).json({ message: "没有找到情侣关系" });
    }

    // 创建事件
    const event = await prisma.coupleEvent.create({
      data: {
        content,
        type,
        position: position ? JSON.stringify(position) : null,
        createdBy: userId,
        coupleId: relation.id,
      },
    });

    res.json(event);
  } catch (error) {
    console.error("添加事件失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 更新事件
router.put("/events/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;
    const { content, position, completed } = req.body;

    // 查找事件
    const event = await prisma.coupleEvent.findUnique({
      where: { id: eventId },
      include: {
        couple: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "事件不存在" });
    }

    // 检查权限
    if (event.couple.user1Id !== userId && event.couple.user2Id !== userId) {
      return res.status(403).json({ message: "没有权限修改此事件" });
    }

    // 更新事件
    const updatedEvent = await prisma.coupleEvent.update({
      where: { id: eventId },
      data: {
        ...(content && { content }),
        ...(position && { position: JSON.stringify(position) }),
        ...(completed !== undefined && { completed }),
        updatedAt: new Date(),
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error("更新事件失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

// 删除事件
router.delete("/events/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const eventId = req.params.id;

    // 查找事件
    const event = await prisma.coupleEvent.findUnique({
      where: { id: eventId },
      include: {
        couple: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "事件不存在" });
    }

    // 检查权限
    if (event.couple.user1Id !== userId && event.couple.user2Id !== userId) {
      return res.status(403).json({ message: "没有权限删除此事件" });
    }

    // 删除事件
    await prisma.coupleEvent.delete({
      where: { id: eventId },
    });

    res.json({ message: "事件已删除" });
  } catch (error) {
    console.error("删除事件失败:", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
