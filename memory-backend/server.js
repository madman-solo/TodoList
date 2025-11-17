const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const path = require("path");

// 初始化
const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// 中间件（解决跨域、解析JSON）
app.use(cors());
app.use(express.json());
// 静态文件服务（用于访问图片）
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 1. 推荐内容接口
app.get("/api/recommendations", async (req, res) => {
  try {
    // 从数据库查询各类推荐内容
    const themes = await prisma.theme.findMany({ take: 9 });
    const fonts = await prisma.font.findMany({ take: 6 });
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

// 5. 图标接口
// app.get("/api/icons", async (req, res) => {
//   try {
//     const { category } = req.query;
//     const icons = await prisma.icon.findMany({
//       where: category && category !== "all" ? { category } : {},
//     });
//     res.json(icons);
//   } catch (error) {
//     res.status(500).json({ error: "获取图标失败" });
//   }
// });
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

// 启动服务
app.listen(PORT, () => {
  console.log(`后端接口运行在 http://localhost:${PORT}/api`);
});
