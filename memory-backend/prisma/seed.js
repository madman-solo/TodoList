const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seed() {
  // 添加测试主题
  await prisma.theme.createMany({
    data: [
      {
        title: "简约白",
        preview: "/images/themes/simple-white.jpg",
        category: "简约",
        isNew: true,
      },
      {
        title: "活力橙",
        preview: "/images/themes/energetic-orange.jpg",
        category: "活力",
        downloadCount: 120,
      },
    ],
  });

  // 添加测试背景
  await prisma.background.createMany({
    data: [
      {
        title: "情侣海边",
        preview: "/images/backgrounds/couple-beach.jpg",
        category: "真人",
        resolution: "1920x1080",
        size: 2048,
      },
    ],
  });

  console.log("初始数据添加完成");
}

seed().catch(console.error);
