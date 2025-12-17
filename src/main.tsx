import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./router.tsx";
import { Container } from "./components/Container.tsx";
import AuthInitializer from "./components/AuthInitializer.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Container>
      <AuthInitializer>
        <AppRouter />
      </AuthInitializer>
    </Container>
  </StrictMode>
);
