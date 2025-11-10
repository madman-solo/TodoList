import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.tsx";
import BackgroundSelector from "./pages/BackgroundSelector.tsx";
import CoupleMode from "./pages/CoupleMode.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "background", element: <BackgroundSelector /> },
      { path: "couple", element: <CoupleMode /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
