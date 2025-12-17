import React, { useState, useEffect } from "react";
import { useCoupleStore } from "../store/coupleStore";
import { useUserStore } from "../store";
import socketService from "../services/socketService";

interface CoupleBindingProps {
  onBindingSuccess?: () => void;
}

const CoupleBinding: React.FC<CoupleBindingProps> = ({ onBindingSuccess }) => {
  const [partnerIdInput, setPartnerIdInput] = useState("");
  const { user } = useUserStore();
  const {
    coupleRelation,
    partnerId,
    isBinding,
    bindingError,
    pendingRequests,
    isLoadingRequests,
    bindCouple,
    unbindCouple,
    loadPendingRequests,
    loadCoupleRelation,
    acceptRequest,
    rejectRequest,
  } = useCoupleStore();

  // 加载待处理的绑定请求和情侣关系
  useEffect(() => {
    loadPendingRequests();
    loadCoupleRelation();
  }, [loadPendingRequests, loadCoupleRelation]);

  // BUG修复：监听Socket.io绑定成功通知
  useEffect(() => {
    const unsubscribe = socketService.subscribe((message) => {
      if (message.type === "couple-bound") {
        console.log("收到绑定成功通知，重新加载情侣关系");
        // 重新加载情侣关系
        loadCoupleRelation().then(() => {
          alert("绑定成功！现在你们可以共同管理情侣事件了");
          onBindingSuccess?.();
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [loadCoupleRelation, onBindingSuccess]);

  const handleBind = async () => {
    const partnerIdNum = partnerIdInput.trim();

    if (!partnerIdNum) {
      alert("请输入有效的用户ID");
      return;
    }

    if (partnerIdNum === user?.id) {
      alert("不能绑定自己");
      return;
    }

    try {
      await bindCouple(partnerIdNum);
      setPartnerIdInput("");
      alert("请求已发送，请等待对方确认");
      loadPendingRequests();
    } catch {
      // 错误已在store中处理
    }
  };

  const handleUnbind = async () => {
    if (window.confirm("确定要解除情侣绑定吗？这将删除所有共同事件。")) {
      try {
        await unbindCouple();
        alert("已解除绑定");
      } catch {
        alert("解除绑定失败");
      }
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      alert("绑定成功！现在你们可以共同管理情侣事件了");
      onBindingSuccess?.();
    } catch {
      alert("接受请求失败");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      alert("已拒绝绑定请求");
    } catch {
      alert("拒绝请求失败");
    }
  };

  // 如果已经绑定，显示绑定信息
  if (coupleRelation && partnerId) {
    return (
      <div className="couple-binding-status">
        <div className="binding-info">
          <div className="status-header">
            <div className="love-icon">💕</div>
            <h3>情侣模式已激活</h3>
          </div>
          <div className="partner-info">
            <div className="partner-card">
              <div className="partner-avatar">👤</div>
              <div className="partner-details">
                <p className="partner-label">绑定对象</p>
                <p className="partner-id">用户 ID: {partnerId}</p>
              </div>
            </div>
          </div>
          <div className="status-description">
            <p>🎉 现在你们可以共同管理所有情侣事件</p>
            <p>📝 共享未来清单、心愿清单和回忆相册</p>
          </div>
          <button onClick={handleUnbind} className="unbind-btn">
            <span>🔓</span>
            解除绑定
          </button>
        </div>
      </div>
    );
  }

  // 显示绑定界面
  return (
    <div className="couple-binding">
      {/* 待处理的绑定请求 */}
      {pendingRequests.length > 0 && (
        <div className="pending-requests">
          <div className="section-header">
            <h3>💌 待处理的绑定请求</h3>
          </div>
          {isLoadingRequests ? (
            <div className="loading-state">
              <div className="spinner">⏳</div>
              <p>加载中...</p>
            </div>
          ) : (
            <div className="requests-list">
              {pendingRequests.map((request) => (
                <div key={request.id} className="request-item">
                  <div className="request-avatar">👤</div>
                  <div className="request-content">
                    <div className="request-info">
                      <p className="requester-name">
                        <strong>{request.fromUser.name}</strong>
                      </p>
                      <p className="requester-id">ID: {request.fromUser.id}</p>
                      <p className="request-time">
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="request-actions">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="accept-btn"
                      >
                        <span>✅</span>
                        同意
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="reject-btn"
                      >
                        <span>❌</span>
                        拒绝
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="binding-form">
        <div className="form-header">
          <div className="form-icon">💕</div>
          <h3>绑定情侣</h3>
          <p className="form-subtitle">输入对方的用户ID来建立情侣关系</p>
        </div>

        <div className="user-info-card">
          <div className="user-avatar">👤</div>
          <div className="user-details">
            <p className="user-label">你的用户ID</p>
            <p className="user-id">{user?.id}</p>
          </div>
        </div>

        <div className="input-section">
          <div className="input-group">
            <div className="input-wrapper">
              <input
                type="text"
                value={partnerIdInput}
                onChange={(e) => setPartnerIdInput(e.target.value)}
                placeholder="输入对方的用户ID"
                disabled={isBinding}
                className="partner-id-input"
              />
              <div className="input-icon">🔗</div>
            </div>
            <button
              onClick={handleBind}
              disabled={isBinding || !partnerIdInput.trim()}
              className="bind-btn"
            >
              {isBinding ? (
                <>
                  <span className="loading-spinner">⏳</span>
                  发送中...
                </>
              ) : (
                <>
                  <span>💌</span>
                  发送请求
                </>
              )}
            </button>
          </div>

          {bindingError && (
            <div className="error-message">
              <span>⚠️</span>
              {bindingError}
            </div>
          )}
        </div>

        <div className="binding-tips">
          <h4>📋 绑定说明</h4>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">1️⃣</span>
              <span>输入对方的用户ID发送绑定请求</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">2️⃣</span>
              <span>对方需要同意你的请求才能建立情侣关系</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">3️⃣</span>
              <span>绑定成功后，你们可以共同管理所有情侣事件</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">4️⃣</span>
              <span>任何一方都可以添加、修改、删除事件</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">5️⃣</span>
              <span>所有操作都会实时同步给对方</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoupleBinding;
