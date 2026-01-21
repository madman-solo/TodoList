// 活跃度追踪工具函数

export interface ActivityRecord {
  date: string; // YYYY-MM-DD 格式
  userId: string;
  actions: {
    futureList: number; // 未来清单操作次数
    memories: number; // 回忆相册操作次数
    tables: number; // 表格操作次数
    games: number; // 游戏互动次数
  };
  totalScore: number; // 当天总活跃度分数
}

export interface DailyActivity {
  date: string;
  myActivity: number;
  partnerActivity: number;
}

// 活跃度权重配置
const ACTIVITY_WEIGHTS = {
  futureList: 10, // 每次操作10分
  memories: 15, // 每次操作15分
  tables: 8, // 每次操作8分
  games: 12, // 每次操作12分
};

// 获取今天的日期字符串 (YYYY-MM-DD)
export const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

// 获取最近N天的日期数组
export const getRecentDates = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

// 记录活跃度操作
export const trackActivity = (
  userId: string,
  actionType: keyof typeof ACTIVITY_WEIGHTS
): void => {
  const dateStr = getTodayDateString();
  const storageKey = `activity_${userId}_${dateStr}`;

  // 获取今天的活跃度记录
  const existingData = localStorage.getItem(storageKey);
  let record: ActivityRecord;

  if (existingData) {
    record = JSON.parse(existingData);
  } else {
    record = {
      date: dateStr,
      userId,
      actions: {
        futureList: 0,
        memories: 0,
        tables: 0,
        games: 0,
      },
      totalScore: 0,
    };
  }

  // 增加对应操作的计数
  record.actions[actionType]++;

  // 重新计算总分
  record.totalScore = calculateTotalScore(record.actions);

  // 保存到 localStorage
  localStorage.setItem(storageKey, JSON.stringify(record));
};

// 计算总分
const calculateTotalScore = (actions: ActivityRecord["actions"]): number => {
  return (
    actions.futureList * ACTIVITY_WEIGHTS.futureList +
    actions.memories * ACTIVITY_WEIGHTS.memories +
    actions.tables * ACTIVITY_WEIGHTS.tables +
    actions.games * ACTIVITY_WEIGHTS.games
  );
};

// 获取用户某一天的活跃度分数
export const getDayActivity = (userId: string, date: string): number => {
  const storageKey = `activity_${userId}_${date}`;
  const data = localStorage.getItem(storageKey);

  if (!data) return 0;

  const record: ActivityRecord = JSON.parse(data);
  return record.totalScore;
};

// 获取用户最近N天的活跃度数据
export const getRecentActivity = (
  userId: string,
  days: number = 7
): number[] => {
  const dates = getRecentDates(days);
  return dates.map((date) => getDayActivity(userId, date));
};

// 计算平均活跃度
export const calculateAverageActivity = (
  userId: string,
  days: number = 7
): number => {
  const activities = getRecentActivity(userId, days);
  if (activities.length === 0) return 0;

  const sum = activities.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / activities.length);
};

// 将活跃度分数转换为百分比 (0-100)
export const scoreToPercentage = (score: number): number => {
  // 假设每天最高分数为 200 分（各种操作的合理上限）
  const maxDailyScore = 200;
  const percentage = Math.min((score / maxDailyScore) * 100, 100);
  return Math.round(percentage);
};

// 获取双方最近7天的活跃度数据（用于图表展示）
export const getCoupleActivityData = (
  myUserId: string,
  partnerUserId: string | undefined,
  days: number = 7
): DailyActivity[] => {
  const dates = getRecentDates(days);

  return dates.map((date) => {
    const myScore = getDayActivity(myUserId, date);
    const partnerScore = partnerUserId
      ? getDayActivity(partnerUserId, date)
      : 0;

    return {
      date,
      myActivity: scoreToPercentage(myScore),
      partnerActivity: scoreToPercentage(partnerScore),
    };
  });
};

// 获取活跃度等级描述
export const getActivityLevel = (percentage: number): string => {
  if (percentage >= 80) return "非常活跃";
  if (percentage >= 60) return "活跃";
  if (percentage >= 40) return "一般";
  if (percentage >= 20) return "较低";
  return "很少活跃";
};

// 获取活跃度颜色（用于热力图）
export const getActivityColor = (percentage: number): string => {
  if (percentage >= 80) return "#ff4757"; // 深红色
  if (percentage >= 60) return "#ff6348"; // 红色
  if (percentage >= 40) return "#ffa502"; // 橙色
  if (percentage >= 20) return "#ffd32a"; // 黄色
  return "#ecf0f1"; // 灰色
};
