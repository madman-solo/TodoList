import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCoupleStore } from "../store/coupleStore";
import { useUserStore } from "../store";
import socketService from "../services/socketService";

interface PartnerInfo {
  id: number;
  name: string;
  avatar?: string;
}

const CoupleHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const {
    coupleRelation,
    partnerId,
    wsConnected,
    coupleId,
    unbindCouple,
    clearCoupleData,
  } = useCoupleStore();
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);

  // 获取对方用户信息
  useEffect(() => {
    const fetchPartnerInfo = async () => {
      if (partnerId) {
        try {
          const response = await fetch(`/api/users/${partnerId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          if (response.ok) {
            const partner = await response.json();
            setPartnerInfo(partner);
          }
        } catch (error) {
          console.error("获取对方信息失败:", error);
        }
      }
    };

    fetchPartnerInfo();
  }, [partnerId]);

  // 如果没有情侣关系，不显示
  if (!coupleRelation || !partnerId || !user) {
    return null;
  }

  return (
    <div className="couple-header-compact">
      <div className="couple-avatars-horizontal">
        {/* 当前用户头像 */}
        <div className="user-avatar-item">
          <div className="user-avatar-small">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <span className="user-name-small">{user.name}</span>
        </div>

        {/* 爱心连接 */}
        <div className="love-connector-small">
          <span
            className={`heart-icon-small ${
              wsConnected ? "connected" : "disconnected"
            }`}
          >
            💕
          </span>
        </div>

        {/* 对方头像 */}
        <div className="user-avatar-item">
          <div className="user-avatar-small">
            {partnerInfo?.avatar ? (
              <img src={partnerInfo.avatar} alt={partnerInfo.name} />
            ) : (
              <span>{partnerInfo?.name?.charAt(0).toUpperCase() || "?"}</span>
            )}
          </div>
          <span className="user-name-small">
            {partnerInfo?.name || `用户${partnerId}`}
          </span>
        </div>
      </div>

      {/* 连接状态指示 */}
      <div className="connection-status-small">
        <span
          className={`status-dot-small ${wsConnected ? "online" : "offline"}`}
        ></span>
        <span className="status-text-small">
          {wsConnected ? "同步" : "连接中"}
        </span>
      </div>

      {/* 解除绑定按钮 */}
      <button
        className="unbind-button-small"
        onClick={async () => {
          if (window.confirm("确定要解除情侣绑定吗？这将删除所有共同事件。")) {
            try {
              // 通知Socket服务器解绑
              if (coupleId) {
                socketService.notifyUnbind(coupleId);
              }

              // 断开Socket连接
              socketService.disconnect();

              // 调用解绑API
              await unbindCouple();

              // 清空本地数据
              clearCoupleData();

              // 跳转回绑定页面
              navigate("/couple");
            } catch (error) {
              console.error("解除绑定失败:", error);
              alert("解除绑定失败，请重试");
            }
          }
        }}
        title="解除绑定"
      >
        🔓
      </button>
    </div>
  );
};

export default CoupleHeader;
