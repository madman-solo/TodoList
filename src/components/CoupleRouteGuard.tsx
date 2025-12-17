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
        // 第一重校验：localStorage
        const localCoupleId = localStorage.getItem("coupleId");
        const localIsCoupleBound = localStorage.getItem("isCoupleBound");

        if (!localCoupleId || localIsCoupleBound !== "true") {
          console.log("localStorage校验失败：未绑定");
          setIsValidated(false);
          setIsLoading(false);
          return;
        }

        // 第二重校验：后端验证
        await loadCoupleRelation();

        // 验证后端返回的数据与localStorage一致
        const storeState = useCoupleStore.getState();
        if (storeState.isCoupleBound && storeState.coupleId === localCoupleId) {
          setIsValidated(true);
        } else {
          console.log("后端校验失败：coupleId不匹配或未绑定");
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
            // 绑定成功后重新加载情侣关系
            loadCoupleRelation();
          }}
        />
      </div>
    );
  }

  // 已绑定，显示子组件
  return <>{children}</>;
};

export default CoupleRouteGuard;
