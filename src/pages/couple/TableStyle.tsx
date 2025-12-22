import React, { useState, useEffect } from "react";
import { useRealtimeCollaboration } from "../../hooks/useRealtimeCollaboration";
import { useCoupleStore } from "../../store/coupleStore";
import { useUserStore } from "../../store";

// 周评价表数据类型
interface WeeklyEvaluationData {
  id: string;
  weekNumber: number;
  user1Comment: string;
  user2Comment: string;
  lastEditBy: string | number;
}

const TableStyle = () => {
  const [activeTab, setActiveTab] = useState("table");
  const [showOnlineChart, setShowOnlineChart] = useState(false);
  const [weeklyEvaluationData, setWeeklyEvaluationData] = useState<
    WeeklyEvaluationData[]
  >([]);

  const { user } = useUserStore();
  const { coupleRelation, isCoupleBound } = useCoupleStore();

  // 计算绑定时间开始的周数
  const getWeekNumber = () => {
    if (!coupleRelation?.createdAt) return 1;

    const bindingDate = new Date(coupleRelation.createdAt);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - bindingDate.getTime());
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return diffWeeks;
  };

  // 实时协作功能
  const { broadcastUpdate } = useRealtimeCollaboration<WeeklyEvaluationData>({
    roomId: "couple-weekly-evaluation-table",
    onRemoteUpdate: (data) => {
      if (data.action === "update") {
        setWeeklyEvaluationData((prev) =>
          prev.map((item) => (item.id === data.data.id ? data.data : item))
        );
      }
    },
    enabled: isCoupleBound,
  });

  // 初始化周评价表数据
  useEffect(() => {
    const initWeeklyEvaluationData = () => {
      const currentWeek = getWeekNumber();
      const data: WeeklyEvaluationData[] = [];

      // 生成最近4周的数据
      for (let i = Math.max(1, currentWeek - 3); i <= currentWeek; i++) {
        data.push({
          id: `week-${i}`,
          weekNumber: i,
          user1Comment: "",
          user2Comment: "",
          lastEditBy: "",
        });
      }

      setWeeklyEvaluationData(data);
    };

    initWeeklyEvaluationData();
  }, [coupleRelation]);

  // 更新周评价数据
  const updateWeeklyEvaluation = (
    id: string,
    field: string,
    value: string | number
  ) => {
    const updatedData = weeklyEvaluationData.map((item) => {
      if (item.id === id) {
        const updated = {
          ...item,
          [field]: value,
          lastEditBy: user?.id || "",
        };
        // 广播更新给对方
        broadcastUpdate({
          type: "couple-weekly-evaluation-table",
          data: updated,
          action: "update",
        });
        return updated;
      }
      return item;
    });
    setWeeklyEvaluationData(updatedData);
  };

  // 在线天数日历热力图组件 - Calendar Heatmap Style
  const OnlineChart = () => {
    // 生成全年日历数据（以当前日期为基准）
    const generateYearData = React.useMemo(() => {
      const data = [];
      const today = new Date();
      const startDate = new Date(today.getFullYear(), 0, 1); // 今年1月1日

      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        // 模拟在线数据（随机生成，实际应从后端获取）
        const user1Hours = Math.random() > 0.3 ? Math.random() * 12 + 2 : 0;
        const user2Hours = Math.random() > 0.3 ? Math.random() * 12 + 2 : 0;

        data.push({
          date: date.toISOString().split("T")[0],
          user1Hours,
          user2Hours,
          totalHours: user1Hours + user2Hours,
        });
      }
      return data;
    }, []);

    // 按月份分组数据
    const monthlyData = React.useMemo(() => {
      const months = Array.from({ length: 12 }, (_, i) => ({
        month: i,
        weeks: [] as Array<
          Array<{
            date: string;
            user1Hours: number;
            user2Hours: number;
            totalHours: number;
          }>
        >,
      }));

      generateYearData.forEach((day) => {
        const date = new Date(day.date);
        const month = date.getMonth();
        const weekIndex = Math.floor(date.getDate() / 7);

        if (!months[month].weeks[weekIndex]) {
          months[month].weeks[weekIndex] = [];
        }
        months[month].weeks[weekIndex].push(day);
      });

      return months;
    }, [generateYearData]);

    // 获取颜色强度（基于在线时长）
    const getColorIntensity = (hours: number, userType: "user1" | "user2") => {
      if (hours === 0) return userType === "user1" ? "#e5e7eb" : "#fee2e2"; // 灰色/浅红色
      if (hours < 3) return userType === "user1" ? "#bfdbfe" : "#fecaca"; // 浅蓝/浅红
      if (hours < 6) return userType === "user1" ? "#60a5fa" : "#f87171"; // 中蓝/中红
      if (hours < 10) return userType === "user1" ? "#2563eb" : "#dc2626"; // 深蓝/深红
      return userType === "user1" ? "#1e40af" : "#991b1b"; // 最深蓝/最深红
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] backdrop-filter backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-7xl w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
          {/* 标题栏 */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📅</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  在线天数日历热力图
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Daily Step Count - 全年活跃度可视化
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowOnlineChart(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 日历热力图 - 双方数据分开显示 */}
          <div className="space-y-8">
            {/* 用户1的热力图 */}
            <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                  {user?.name || "我"} 的活跃度
                </h4>
              </div>

              {/* 月份标签 */}
              <div className="flex gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month, i) => (
                  <div key={i} className="flex-1 text-center">
                    {month}
                  </div>
                ))}
              </div>

              {/* 热力图网格 */}
              <div className="grid grid-cols-12 gap-2">
                {monthlyData.map((monthData, monthIndex) => (
                  <div key={monthIndex} className="space-y-1">
                    {monthData.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                            style={{
                              backgroundColor: getColorIntensity(
                                day.user1Hours,
                                "user1"
                              ),
                            }}
                            title={`${day.date}: ${day.user1Hours.toFixed(
                              1
                            )}小时`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* 图例 */}
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 3, 6, 10, 14].map((hours, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: getColorIntensity(hours, "user1"),
                      }}
                    />
                  ))}
                </div>
                <span>More</span>
                <span className="ml-4">
                  总计:{" "}
                  {generateYearData
                    .reduce((sum, d) => sum + d.user1Hours, 0)
                    .toFixed(0)}{" "}
                  小时
                </span>
              </div>
            </div>

            {/* 用户2的热力图 */}
            <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-800 border-2 border-red-200 dark:border-red-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-lg text-gray-800 dark:text-white">
                  {coupleRelation?.partner?.name || "对方"} 的活跃度
                </h4>
              </div>

              {/* 月份标签 */}
              <div className="flex gap-2 mb-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month, i) => (
                  <div key={i} className="flex-1 text-center">
                    {month}
                  </div>
                ))}
              </div>

              {/* 热力图网格 */}
              <div className="grid grid-cols-12 gap-2">
                {monthlyData.map((monthData, monthIndex) => (
                  <div key={monthIndex} className="space-y-1">
                    {monthData.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-red-400 transition-all"
                            style={{
                              backgroundColor: getColorIntensity(
                                day.user2Hours,
                                "user2"
                              ),
                            }}
                            title={`${day.date}: ${day.user2Hours.toFixed(
                              1
                            )}小时`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* 图例 */}
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 3, 6, 10, 14].map((hours, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: getColorIntensity(hours, "user2"),
                      }}
                    />
                  ))}
                </div>
                <span>More</span>
                <span className="ml-4">
                  总计:{" "}
                  {generateYearData
                    .reduce((sum, d) => sum + d.user2Hours, 0)
                    .toFixed(0)}{" "}
                  小时
                </span>
              </div>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <div className="text-gray-500 dark:text-gray-400">活跃天数</div>
                <div className="font-bold text-lg text-blue-600">
                  {
                    generateYearData.filter(
                      (d) => d.user1Hours > 0 || d.user2Hours > 0
                    ).length
                  }{" "}
                  天
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <div className="text-gray-500 dark:text-gray-400">
                  总在线时长
                </div>
                <div className="font-bold text-lg text-green-600">
                  {generateYearData
                    .reduce((sum, d) => sum + d.totalHours, 0)
                    .toFixed(0)}{" "}
                  小时
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <div className="text-gray-500 dark:text-gray-400">平均每天</div>
                <div className="font-bold text-lg text-purple-600">
                  {(
                    generateYearData.reduce((sum, d) => sum + d.totalHours, 0) /
                    365
                  ).toFixed(1)}{" "}
                  小时
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <div className="text-gray-500 dark:text-gray-400">最长连续</div>
                <div className="font-bold text-lg text-orange-600">
                  {(() => {
                    let maxStreak = 0;
                    let currentStreak = 0;
                    generateYearData.forEach((d) => {
                      if (d.totalHours > 0) {
                        currentStreak++;
                        maxStreak = Math.max(maxStreak, currentStreak);
                      } else {
                        currentStreak = 0;
                      }
                    });
                    return maxStreak;
                  })()}{" "}
                  天
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800">
      {/* 导航栏 - 现代化设计 */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b-2 border-gradient-to-r from-pink-200 via-purple-200 to-blue-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl">📊</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    情侣表格
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Couple Tables
                  </p>
                </div>
              </div>

              <nav className="flex gap-2">
                <button
                  onClick={() => setActiveTab("table")}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === "table"
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>📋</span>
                    <span>表格</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("store")}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === "store"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🛒</span>
                    <span>商店</span>
                  </span>
                </button>
                <button
                  onClick={() => setShowOnlineChart(true)}
                  className="px-5 py-2.5 text-sm font-semibold rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <span>📈</span>
                    <span>活跃度</span>
                  </span>
                </button>
              </nav>
            </div>

            {/* 实时协作状态指示 */}
            {isCoupleBound && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-full shadow-md">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="text-green-700 dark:text-green-400 text-sm font-semibold">
                  与 {coupleRelation?.partner?.name} 实时同步
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 表格页面 - 现代化设计 */}
      {activeTab === "table" && (
        <div className="max-w-7xl mx-auto p-6 animate-fadeIn">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-purple-200 dark:border-gray-700 overflow-hidden transform hover:shadow-purple-500/20 transition-all duration-300">
            {/* 表格头部 */}
            <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 dark:from-pink-900/30 dark:via-purple-900/30 dark:to-blue-900/30 px-8 py-6 border-b-2 border-purple-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                    <span className="text-white font-bold text-2xl">💕</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                      一周双方评价表
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      记录彼此的感受，增进相互理解 ✨
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {new Date().toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString("zh-CN", {
                      weekday: "long",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 现代化表格设计 */}
            <div className="overflow-x-auto p-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-blue-900/40">
                    <th className="border-2 border-purple-300 dark:border-purple-600 px-8 py-5 text-center text-base font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide bg-gradient-to-br from-purple-200 to-purple-100 dark:from-purple-700 dark:to-purple-800 shadow-lg rounded-tl-2xl">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">📅</span>
                        <span>周数</span>
                      </div>
                    </th>
                    <th className="border-2 border-blue-300 dark:border-blue-600 px-8 py-5 text-center text-base font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wide bg-gradient-to-br from-blue-200 via-blue-100 to-cyan-100 dark:from-blue-800/60 dark:via-blue-900/40 dark:to-cyan-900/40 shadow-lg">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">👤</span>
                        <span>{user?.name || "我"}</span>
                      </div>
                    </th>
                    <th className="border-2 border-pink-300 dark:border-pink-600 px-8 py-5 text-center text-base font-bold text-pink-800 dark:text-pink-300 uppercase tracking-wide bg-gradient-to-br from-pink-200 via-pink-100 to-rose-100 dark:from-pink-800/60 dark:via-pink-900/40 dark:to-rose-900/40 shadow-lg rounded-tr-2xl">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">💕</span>
                        <span>{coupleRelation?.partner?.name || "对方"}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {weeklyEvaluationData.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`group hover:bg-gradient-to-r hover:from-purple-50/50 hover:via-pink-50/50 hover:to-blue-50/50 dark:hover:from-purple-900/10 dark:hover:via-pink-900/10 dark:hover:to-blue-900/10 transition-all duration-300 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gradient-to-r from-gray-50/50 via-purple-50/30 to-gray-50/50 dark:from-gray-700/30 dark:via-purple-900/10 dark:to-gray-700/30"
                      }`}
                    >
                      <td className="border-2 border-purple-200 dark:border-purple-700 px-8 py-6 text-base font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-purple-100/80 to-purple-50/80 dark:from-purple-800/40 dark:to-purple-900/30 group-hover:from-purple-200/90 group-hover:to-purple-100/90 dark:group-hover:from-purple-700/50 dark:group-hover:to-purple-800/40 transition-all duration-300">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-4 h-4 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-md animate-pulse"></div>
                          <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            第 {item.weekNumber} 周
                          </span>
                        </div>
                      </td>
                      <td className="border-2 border-blue-200 dark:border-blue-700 px-5 py-6 bg-gradient-to-br from-blue-50/60 via-white to-cyan-50/40 dark:from-blue-900/15 dark:via-gray-800 dark:to-cyan-900/10 group-hover:from-blue-100/70 group-hover:to-cyan-100/60 dark:group-hover:from-blue-900/25 dark:group-hover:to-cyan-900/20 transition-all duration-300">
                        <textarea
                          value={item.user1Comment}
                          onChange={(e) =>
                            updateWeeklyEvaluation(
                              item.id,
                              "user1Comment",
                              e.target.value
                            )
                          }
                          className="w-full px-5 py-4 text-sm border-2 border-blue-300 dark:border-blue-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400/50 focus:border-blue-500 dark:focus:ring-blue-500/30 dark:focus:border-blue-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 resize-none shadow-md hover:shadow-xl focus:shadow-2xl transform hover:scale-[1.02] focus:scale-[1.02]"
                          placeholder="✍️ 记录这一周的感受和想法..."
                          rows={4}
                        />
                      </td>
                      <td className="border-2 border-pink-200 dark:border-pink-700 px-5 py-6 bg-gradient-to-br from-pink-50/60 via-white to-rose-50/40 dark:from-pink-900/15 dark:via-gray-800 dark:to-rose-900/10 group-hover:from-pink-100/70 group-hover:to-rose-100/60 dark:group-hover:from-pink-900/25 dark:group-hover:to-rose-900/20 transition-all duration-300">
                        <textarea
                          value={item.user2Comment}
                          onChange={(e) =>
                            updateWeeklyEvaluation(
                              item.id,
                              "user2Comment",
                              e.target.value
                            )
                          }
                          className="w-full px-5 py-4 text-sm border-2 border-pink-300 dark:border-pink-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-500 dark:focus:ring-pink-500/30 dark:focus:border-pink-400 hover:border-pink-400 dark:hover:border-pink-500 transition-all duration-300 resize-none shadow-md hover:shadow-xl focus:shadow-2xl transform hover:scale-[1.02] focus:scale-[1.02]"
                          placeholder="✍️ 记录这一周的感受和想法..."
                          rows={4}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 表格底部信息 - 现代化设计 */}
            <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 px-8 py-5 border-t-2 border-purple-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border-2 border-green-300 dark:border-green-700 shadow-md">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      实时同步
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border-2 border-purple-300 dark:border-purple-700 shadow-md">
                    <span className="text-lg">📊</span>
                    <span className="font-semibold text-purple-700 dark:text-purple-400">
                      共 {weeklyEvaluationData.length} 周记录
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border-2 border-pink-300 dark:border-pink-700 shadow-md">
                    <span className="text-lg">💕</span>
                    <span className="font-semibold text-pink-700 dark:text-pink-400">
                      当前第 {getWeekNumber()} 周
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 px-4 py-2 rounded-xl border-2 border-blue-300 dark:border-blue-700 shadow-md">
                  <span className="text-lg">💡</span>
                  <span className="font-semibold">
                    双方可实时编辑，记录每周感受
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 表格商店页面 */}
      {activeTab === "store" && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* 商店头部 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🛒</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    表格商店
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    发现更多情侣专属表格模板
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "恋爱进度表",
                    desc: "记录恋爱各个阶段的重要时刻",
                    price: "免费",
                    icon: "💝",
                  },
                  {
                    name: "约会计划表",
                    desc: "规划和记录每次约会的详细信息",
                    price: "¥9.9",
                    icon: "📅",
                  },
                  {
                    name: "纪念日提醒表",
                    desc: "永远不会忘记重要的纪念日",
                    price: "¥19.9",
                    icon: "🎉",
                  },
                  {
                    name: "情侣目标表",
                    desc: "设定和追踪共同的目标和梦想",
                    price: "¥14.9",
                    icon: "🎯",
                  },
                  {
                    name: "感情温度表",
                    desc: "每日记录感情状态和变化",
                    price: "¥12.9",
                    icon: "🌡️",
                  },
                  {
                    name: "礼物心愿表",
                    desc: "记录彼此想要的礼物和惊喜",
                    price: "¥8.9",
                    icon: "🎁",
                  },
                ].map((template, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-5 hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 bg-white dark:bg-gray-700 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {template.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 min-h-[40px]">
                      {template.desc}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        {template.price}
                      </span>
                      <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                        {template.price === "免费" ? "使用" : "购买"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 在线天数图表弹窗 */}
      {showOnlineChart && <OnlineChart />}
    </div>
  );
};

export default TableStyle;
