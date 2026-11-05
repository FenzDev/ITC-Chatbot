import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import { ChatPage } from "@/pages/ChatPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { AdminEventsPage } from "@/pages/AdminEventsPage";

// "/" is the home page (with events). The children render as a sheet over it.
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "chat", element: <ChatPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "admin/events", element: <AdminEventsPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
