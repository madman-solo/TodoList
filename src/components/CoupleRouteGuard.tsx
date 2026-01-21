/**
 * 情侣模式路由守卫
 * 双重校验：localStorage + 后端验证
 */

import { useEffect, useState } from "react";
import { useCoupleStore } from "../store/coupleStore";
import CoupleBinding from "./CoupleBinding";

interface CoupleRouteGuardProps {
  children: React.ReactNode;
}

const CoupleRouteGuard: React.FC<CoupleRouteGuardProps> = ({ children }) => {
  const { coupleRelation, isCoupleBound, coupleId, loadCoupleRelation } =
    useCoupleStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const validateCoupleBinding = async () => {
      try {
        setIsLoading(true);

        // 强制从后端重新加载最新的情侣关系状态
        await loadCoupleRelation();

        // 获取最新的 store 状态
        const storeState = useCoupleStore.getState();

        // 验证是否已绑定
        if (storeState.isCoupleBound && storeState.coupleId && storeState.coupleRelation) {
          console.log("情侣关系验证成功:", {
            coupleId: storeState.coupleId,
            partnerId: storeState.partnerId,
            isCoupleBound: storeState.isCoupleBound,
          });
          setIsValidated(true);
        } else {
          console.log("情侣关系验证失败：未绑定或数据不完整");
          setIsValidated(false);
        }
      } catch (error) {
        console.error("校验情侣关系失败:", error);
        setIsValidated(false);
      } finally {
        setIsLoading(false);
      }
    };

    validateCoupleBinding();
  }, [loadCoupleRelation]);

  // 加载中状态
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
          fontSize: "1.2rem",
          color: "#666",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            💕
          </div>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  // 未通过双重校验，显示绑定页面
  if (!isValidated || !coupleRelation || !isCoupleBound || !coupleId) {
    return (
      <div
        style={{
          maxWidth: "800px",
          margin: "2rem auto",
          padding: "2rem",
        }}
      >
        <CoupleBinding
          onBindingSuccess={() => {
            // 绑定成功后重新验证状态
            setIsLoading(true);
            loadCoupleRelation().then(() => {
              const storeState = useCoupleStore.getState();
              if (storeState.isCoupleBound && storeState.coupleId) {
                setIsValidated(true);
              }
              setIsLoading(false);
            });
          }}
        />
      </div>
    );
  }

  // 已绑定，显示子组件
  return <>{children}</>;
};

export default CoupleRouteGuard;
