/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { useCoupleStore } from "../../store/coupleStore";

interface ActivityData {
  date: string;
  myActivity: number;
  partnerActivity: number;
}

const Activity: React.FC = () => {
  const { coupleRelation } = useCoupleStore();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);

  // 生成最近7天的活跃度数据（模拟数据）
  useEffect(() => {
    const generateActivityData = () => {
      const data: ActivityData[] = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;

        // 生成随机活跃度数据（0-100）
        data.push({
          date: dateStr,
          myActivity: Math.floor(Math.random() * 100),
          partnerActivity: Math.floor(Math.random() * 100),
        });
      }

      setActivityData(data);
    };

    generateActivityData();
  }, []);

  // 计算平均活跃度
  const calculateAverage = (type: "my" | "partner") => {
    if (activityData.length === 0) return 0;
    const sum = activityData.reduce(
      (acc, item) =>
        acc + (type === "my" ? item.myActivity : item.partnerActivity),
      0
    );
    return Math.round(sum / activityData.length);
  };

  const myAverage = calculateAverage("my");
  const partnerAverage = calculateAverage("partner");
  const partnerName = coupleRelation?.partner?.name || "对方";

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <h2 css={styles.title}>📈 活跃度统计</h2>
        <p css={styles.subtitle}>查看你们的互动活跃度，共同成长</p>
      </div>

      {/* 统计卡片 */}
      <div css={styles.statsGrid}>
        <div css={[styles.statCard, styles.myCard]}>
          <div css={styles.statIcon}>👤</div>
          <div css={styles.statContent}>
            <h3 css={styles.statLabel}>我的平均活跃度</h3>
            <div css={styles.statValue}>{myAverage}%</div>
          </div>
        </div>

        <div css={[styles.statCard, styles.partnerCard]}>
          <div css={styles.statIcon}>💑</div>
          <div css={styles.statContent}>
            <h3 css={styles.statLabel}>{partnerName}的平均活跃度</h3>
            <div css={styles.statValue}>{partnerAverage}%</div>
          </div>
        </div>

        <div css={[styles.statCard, styles.totalCard]}>
          <div css={styles.statIcon}>🎯</div>
          <div css={styles.statContent}>
            <h3 css={styles.statLabel}>总体活跃度</h3>
            <div css={styles.statValue}>
              {Math.round((myAverage + partnerAverage) / 2)}%
            </div>
          </div>
        </div>
      </div>

      {/* 活跃度图表 */}
      <div css={styles.chartContainer}>
        <h3 css={styles.chartTitle}>最近7天活跃度趋势</h3>
        <div css={styles.chart}>
          {activityData.map((item, index) => (
            <div key={index} css={styles.chartItem}>
              <div css={styles.bars}>
                <div
                  css={[styles.bar, styles.myBar]}
                  style={{ height: `${item.myActivity}%` }}
                  title={`我: ${item.myActivity}%`}
                />
                <div
                  css={[styles.bar, styles.partnerBar]}
                  style={{ height: `${item.partnerActivity}%` }}
                  title={`${partnerName}: ${item.partnerActivity}%`}
                />
              </div>
              <div css={styles.chartLabel}>{item.date}</div>
            </div>
          ))}
        </div>

        <div css={styles.legend}>
          <div css={styles.legendItem}>
            <div css={[styles.legendColor, styles.myLegend]} />
            <span>我</span>
          </div>
          <div css={styles.legendItem}>
            <div css={[styles.legendColor, styles.partnerLegend]} />
            <span>{partnerName}</span>
          </div>
        </div>
      </div>

      {/* 活跃度说明 */}
      <div css={styles.infoBox}>
        <div css={styles.infoIcon}>💡</div>
        <div css={styles.infoContent}>
          <h4>活跃度是如何计算的？</h4>
          <p>
            活跃度基于你们在情侣模式中的互动行为，包括：
            <br />• 添加和完成未来清单项目
            <br />• 创建和查看回忆相册
            <br />• 编辑和更新表格内容
            <br />• 参与情侣游戏等互动
          </p>
          <p css={styles.infoTip}>💪 保持活跃互动，让你们的关系更加紧密！</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: css`
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  `,
  header: css`
    text-align: center;
    margin-bottom: 40px;
  `,
  title: css`
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `,
  subtitle: css`
    font-size: 16px;
    color: #666;
    margin: 0;
  `,
  statsGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
  `,
  statCard: css`
    background: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-4px);
    }
  `,
  myCard: css`
    border-left: 4px solid #667eea;
  `,
  partnerCard: css`
    border-left: 4px solid #f093fb;
  `,
  totalCard: css`
    border-left: 4px solid #f5576c;
  `,
  statIcon: css`
    font-size: 48px;
  `,
  statContent: css`
    flex: 1;
  `,
  statLabel: css`
    font-size: 14px;
    color: #666;
    margin: 0 0 8px 0;
  `,
  statValue: css`
    font-size: 32px;
    font-weight: 700;
    color: #333;
  `,
  chartContainer: css`
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
  `,
  chartTitle: css`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 30px 0;
    text-align: center;
  `,
  chart: css`
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 300px;
    padding: 20px 0;
    border-bottom: 2px solid #e0e0e0;
  `,
  chartItem: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    flex: 1;
  `,
  bars: css`
    display: flex;
    gap: 8px;
    align-items: flex-end;
    height: 100%;
  `,
  bar: css`
    width: 20px;
    min-height: 10px;
    border-radius: 4px 4px 0 0;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  `,
  myBar: css`
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  `,
  partnerBar: css`
    background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
  `,
  chartLabel: css`
    font-size: 12px;
    color: #666;
    text-align: center;
  `,
  legend: css`
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-top: 20px;
  `,
  legendItem: css`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
  `,
  legendColor: css`
    width: 20px;
    height: 12px;
    border-radius: 2px;
  `,
  myLegend: css`
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  `,
  partnerLegend: css`
    background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
  `,
  infoBox: css`
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    border-radius: 16px;
    padding: 30px;
    display: flex;
    gap: 20px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  `,
  infoIcon: css`
    font-size: 48px;
  `,
  infoContent: css`
    flex: 1;

    h4 {
      font-size: 20px;
      color: #333;
      margin: 0 0 12px 0;
    }

    p {
      font-size: 14px;
      color: #555;
      line-height: 1.8;
      margin: 0 0 12px 0;
    }
  `,
  infoTip: css`
    font-weight: 600;
    color: #f5576c !important;
    margin-top: 16px !important;
  `,
};

export default Activity;
