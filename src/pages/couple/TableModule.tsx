/** @jsxImportSource @emotion/react */

import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";
import { useCoupleStore } from "../../store/coupleStore";
import { useUserStore } from "../../store";

// 在线天数数据类型
interface OnlineDaysData {
  date: string;
  user1Hours: number;
  user2Hours: number;
}

// 评价表数据类型
interface EvaluationData {
  date: string;
  user1Score: number;
  user2Score: number;
  user1Comment: string;
  user2Comment: string;
}

const TableModule = () => {
  const { user } = useUserStore();
  const { coupleRelation, partnerId } = useCoupleStore();
  
  // 导航状态
  const [activeTab, setActiveTab] = useState<'table' | 'store' | 'onlineDays'>('table');
  
  // 在线天数弹窗状态
  const [showOnlineDaysModal, setShowOnlineDaysModal] = useState(false);
  
  // 模拟一周在线天数数据
  const [onlineDaysData] = useState<OnlineDaysData[]>([
    { date: '2025-12-15', user1Hours: 8, user2Hours: 6 },
    { date: '2025-12-16', user1Hours: 7, user2Hours: 8 },
    { date: '2025-12-17', user1Hours: 9, user2Hours: 5 },
    { date: '2025-12-18', user1Hours: 6, user2Hours: 7 },
    { date: '2025-12-19', user1Hours: 8, user2Hours: 9 },
    { date: '2025-12-20', user1Hours: 7, user2Hours: 6 },
    { date: '2025-12-21', user1Hours: 8, user2Hours: 8 },
  ]);

  // 模拟一周评价表数据
  const [evaluationData, setEvaluationData] = useState<EvaluationData[]>([
    { date: '2025-12-15', user1Score: 0, user2Score: 0, user1Comment: '', user2Comment: '' },
    { date: '2025-12-16', user1Score: 0, user2Score: 0, user1Comment: '', user2Comment: '' },
    { date: '2025-12-17', user1Score: 0, user2Score: 0, user1Comment: '', user2Comment: '' },
    { date: '2025-12-18', user1Score: 0, user2Score: 0, user1Comment: '', user2Comment: '' },
    { date: '2025-12-19', user1Score: 0, user2Score: 0, user1Comment: '', user2Comment: '' },
    { date: '2025-12-20', user1Score: 0, user2Score: 0, user1Comment: '', user2Comment: '' },
    { date: '2025-12-21', user1Score: 0, user2Score: 0, user1Comment: '', user2Comment: '' },
  ]);

  // 更新评价数据
  const updateEvaluation = (date: string, field: keyof EvaluationData, value: string | number) => {
    setEvaluationData(prev => 
      prev.map(item => 
        item.date === date ? { ...item, [field]: value } : item
      )
    );
  };

