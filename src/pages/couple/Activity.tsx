/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { useCoupleStore } from "../../store/coupleStore";
import { useUserStore } from "../../store";
import {
  getCoupleActivityData,
  calculateAverageActivity,
  scoreToPercentage,
  getActivityLevel,
  getActivityColor,
} from "../../utils/activityTracker";

interface ActivityData {
  date: string;
  myActivity: number;
  partnerActivity: number;
}

const Activity: React.FC = () => {
  const { coupleRelation } = useCoupleStore();
  const { user } = useUserStore();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [myAverage, setMyAverage] = useState(0);
  const [partnerAverage, setPartnerAverage] = useState(0);

  // 获取实时活跃度数据
  useEffect(() => {
    const loadActivityData = () => {
      if (!user?.id) return;

      const myUserId = String(user.id);
      const partnerId = coupleRelation?.partner?.id ? String(coupleRelation.partner.id) : undefined;

      // 获取双方最近7天的活跃度数据
      const data = getCoupleActivityData(myUserId, partnerId, 7);
      setActivityData(data);

      // 计算平均活跃度
      const myAvg = calculateAverageActivity(myUserId, 7);
      const partnerAvg = partnerId ? calculateAverageActivity(partnerId, 7) : 0;

      setMyAverage(scoreToPercentage(myAvg));
      setPartnerAverage(scoreToPercentage(partnerAvg));
    };

    loadActivityData();

    // 每30秒刷新一次数据
    const interval = setInterval(loadActivityData, 30000);
    return () => clearInterval(interval);
  }, [user?.id, coupleRelation?.partner?.id]);

  const partnerName = coupleRelation?.partner?.name || "对方";

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

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

      {/* 热力图 */}
      <div css={styles.heatmapContainer}>
        <h3 css={styles.chartTitle}>活跃度热力图</h3>
        <div css={styles.heatmapGrid}>
          {activityData.map((item, index) => (
            <div key={index} css={styles.heatmapDay}>
              <div css={styles.heatmapLabel}>{formatDate(item.date)}</div>
              <div css={styles.heatmapCells}>
                <div
                  css={styles.heatmapCell}
                  style={{ backgroundColor: getActivityColor(item.myActivity) }}
                  title={`我: ${item.myActivity}% - ${getActivityLevel(item.myActivity)}`}
                >
                  <span css={styles.heatmapValue}>{item.myActivity}%</span>
                </div>
                <div
                  css={styles.heatmapCell}
                  style={{ backgroundColor: getActivityColor(item.partnerActivity) }}
                  title={`${partnerName}: ${item.partnerActivity}% - ${getActivityLevel(item.partnerActivity)}`}
                >
                  <span css={styles.heatmapValue}>{item.partnerActivity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div css={styles.heatmapLegendContainer}>
          <span css={styles.heatmapLegendLabel}>活跃度等级：</span>
          <div css={styles.heatmapLegend}>
            <div css={styles.heatmapLegendItem}>
              <div css={styles.heatmapLegendColor} style={{ backgroundColor: "#ecf0f1" }} />
              <span>很少</span>
            </div>
            <div css={styles.heatmapLegendItem}>
              <div css={styles.heatmapLegendColor} style={{ backgroundColor: "#ffd32a" }} />
              <span>较低</span>
            </div>
            <div css={styles.heatmapLegendItem}>
              <div css={styles.heatmapLegendColor} style={{ backgroundColor: "#ffa502" }} />
              <span>一般</span>
            </div>
            <div css={styles.heatmapLegendItem}>
              <div css={styles.heatmapLegendColor} style={{ backgroundColor: "#ff6348" }} />
              <span>活跃</span>
            </div>
            <div css={styles.heatmapLegendItem}>
              <div css={styles.heatmapLegendColor} style={{ backgroundColor: "#ff4757" }} />
              <span>非常活跃</span>
            </div>
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

    @media (max-width: 768px) {
      padding: 15px;
    }

    @media (max-width: 480px) {
      padding: 10px;
    }
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

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 15px;
    }
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
  chartTitle: css`
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0 0 30px 0;
    text-align: center;
  `,
  heatmapContainer: css`
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
  `,
  heatmapGrid: css`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      gap: 10px;
    }
  `,
  heatmapDay: css`
    display: flex;
    align-items: center;
    gap: 15px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  `,
  heatmapLabel: css`
    min-width: 60px;
    font-size: 14px;
    color: #666;
    font-weight: 500;
  `,
  heatmapCells: css`
    display: flex;
    gap: 10px;
    flex: 1;
  `,
  heatmapCell: css`
    flex: 1;
    height: 60px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  `,
  heatmapValue: css`
    font-size: 14px;
    font-weight: 600;
    color: #333;
    text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
  `,
  heatmapLegendContainer: css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
  `,
  heatmapLegendLabel: css`
    font-size: 14px;
    color: #666;
    font-weight: 500;
  `,
  heatmapLegend: css`
    display: flex;
    gap: 15px;
  `,
  heatmapLegendItem: css`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #666;
  `,
  heatmapLegendColor: css`
    width: 24px;
    height: 16px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
