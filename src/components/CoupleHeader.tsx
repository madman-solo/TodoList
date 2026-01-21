import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCoupleStore } from "../store/coupleStore";
import { useUserStore } from "../store";
import socketService from "../services/socketService";

interface PartnerInfo {
  id: number | string;
  name: string;
  avatar?: string;
}

const CoupleHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  const {
    coupleRelation,
    partnerId,
    wsConnected,
    coupleId,
    unbindCouple,
    clearCoupleData,
    updatePartnerAvatar,
  } = useCoupleStore();
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null);
  const [showModal, setShowModal] = useState(false); // 控制弹窗显示

  // 头像上传input引用
  const userAvatarInputRef = useRef<HTMLInputElement>(null);

  // 获取对方用户信息 - 优先从coupleRelation获取，包含头像
  useEffect(() => {
    const fetchPartnerInfo = async () => {
      // 优先使用coupleRelation中的partner信息（包含头像）
      if (coupleRelation?.partner) {
        setPartnerInfo({
          id: coupleRelation.partner.id,
          name: coupleRelation.partner.name,
          avatar: coupleRelation.partner.avatar, // 包含头像
        });
        console.log(
          "从coupleRelation获取对方信息成功:",
          coupleRelation.partner
        );
        return;
      }

      // 如果coupleRelation.partner不存在，则通过API获取
      if (partnerId) {
        try {
          const response = await fetch(
            `http://localhost:3001/api/users/${partnerId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );

          if (response.ok) {
            const partner = await response.json();
            setPartnerInfo(partner);
            console.log("通过API获取对方信息成功:", partner);
          } else {
            console.error("获取对方信息失败，状态码:", response.status);
          }
        } catch (error) {
          console.error("获取对方信息失败:", error);
        }
      }
    };

    fetchPartnerInfo();
  }, [partnerId, coupleRelation]);

  // 【头像双向同步】监听WebSocket消息，接收头像更新
  useEffect(() => {
    if (!socketService.isConnected()) return;

    const unsubscribe = socketService.subscribe((message) => {
      // 监听头像更新消息
      if (message.type === "avatar-update" && message.data) {
        const { userId, avatar } = message.data as {
          userId: string | number;
          avatar: string;
        };

        // 如果是对方的头像更新，更新本地显示和coupleStore
        if (userId === partnerId) {
          setPartnerInfo((prev) => (prev ? { ...prev, avatar } : null));
          updatePartnerAvatar(avatar); // 同步更新到coupleStore
          console.log("收到对方头像更新，已同步显示并更新到store");
        }

        // 【头像双向同步】如果是当前用户的头像更新（从个人页面同步过来）
        if (userId === user?.id) {
          updateUser({ avatar });
          console.log("收到个人页面头像更新，已同步到情侣模式");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [partnerId, user?.id, updateUser, updatePartnerAvatar]);

  // 处理当前用户头像上传
  const handleUserAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件");
      return;
    }

    // 验证文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert("图片大小不能超过5MB");
      return;
    }

    try {
      // 转换为Base64或上传到服务器
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // 【修复】先同步到服务器，成功后再更新本地store
        try {
          const response = await fetch(`http://localhost:3001/api/users/${user.id}/avatar`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({ avatar: base64String }),
          });

          if (!response.ok) {
            throw new Error("头像上传失败");
          }

          // 【修复】服务器保存成功后，再更新本地store
          updateUser({ avatar: base64String });

          // 【头像双向同步】通过WebSocket通知对方头像已更新
          if (coupleId && socketService.isConnected()) {
            socketService.send({
              type: "avatar-update",
              data: {
                userId: user.id,
                avatar: base64String,
              },
            });
            console.log("头像更新已通过WebSocket同步给对方");
          }

          alert("头像上传成功");
        } catch (error) {
          console.error("头像上传失败:", error);
          alert("头像上传失败，请重试");
          // 【修复】失败时不更新本地store，保持原头像
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("头像处理失败:", error);
      alert("头像处理失败，请重试");
    }
  };

  // 处理对方头像上传（仅用于展示，实际由对方操作）
  const handlePartnerAvatarClick = () => {
    alert("只能修改自己的头像哦~");
  };

  // 如果没有情侣关系，不显示
  if (!coupleRelation || !partnerId || !user) {
    return null;
  }

  return (
    <>
      {/* 紧凑图标显示 */}
      <div
        className="couple-icon-compact"
        onClick={() => setShowModal(true)}
        title="查看情侣信息"
      >
        <div className="couple-avatars-icon">
          {/* 对方头像 */}
          <div className="avatar-mini">
            {partnerInfo?.avatar ? (
              <img src={partnerInfo.avatar} alt={partnerInfo.name} />
            ) : (
              <span>{partnerInfo?.name?.charAt(0).toUpperCase() || "?"}</span>
            )}
          </div>
          {/* 爱心图标 */}
          <div className="heart-mini">💕</div>
          {/* 当前用户头像 */}
          <div className="avatar-mini">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
        </div>
        {/* 连接状态指示点 */}
        <div
          className={`status-indicator ${wsConnected ? "online" : "offline"}`}
        ></div>
      </div>

      {/* 点击后显示的弹窗 */}
      {showModal && (
        <div
          className="couple-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="couple-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* 情侣容器内容 */}
            <div className="couple-header-compact">
              <div className="couple-avatars-horizontal">
                {/* 对方头像 - 显示对方姓名 */}
                <div className="user-avatar-item">
                  <div
                    className="user-avatar-small"
                    onClick={handlePartnerAvatarClick}
                    style={{ cursor: "not-allowed", opacity: 0.9 }}
                    title="对方的头像"
                  >
                    {partnerInfo?.avatar ? (
                      <img src={partnerInfo.avatar} alt={partnerInfo.name} />
                    ) : (
                      <span>
                        {partnerInfo?.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  {/* 显示对方姓名 */}
                  <span
                    className="user-name-small"
                    title={partnerInfo?.name || "加载中..."}
                  >
                    {partnerInfo?.name || "加载中..."}
                  </span>
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

                {/* 当前用户头像 - 可点击上传 */}
                <div className="user-avatar-item">
                  <div
                    className="user-avatar-small clickable"
                    onClick={() => userAvatarInputRef.current?.click()}
                    title="点击上传头像"
                    style={{ cursor: "pointer" }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {/* 隐藏的文件上传input */}
                  <input
                    ref={userAvatarInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleUserAvatarUpload}
                  />
                  <span className="user-name-small" title={user.name}>
                    {user.name}
                  </span>
                </div>
              </div>

              {/* 连接状态指示 */}
              <div className="connection-status-small">
                <span
                  className={`status-dot-small ${
                    wsConnected ? "online" : "offline"
                  }`}
                ></span>
                <span className="status-text-small">
                  {wsConnected ? "同步" : "连接中"}
                </span>
              </div>

              {/* 解除绑定按钮 */}
              <button
                className="unbind-button-small"
                onClick={async () => {
                  if (
                    window.confirm(
                      "确定要解除情侣绑定吗？这将删除所有共同事件。"
                    )
                  ) {
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

                      // 关闭弹窗
                      setShowModal(false);

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
          </div>
        </div>
      )}
    </>
  );
};

export default CoupleHeader;
