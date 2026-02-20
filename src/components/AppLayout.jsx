// [file name]: src/components/AppLayout.jsx
import React from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ManagementOfficerRoute from "../routes/ManagementOfficerRoute";
import SecurityOfficerRoute from "../routes/SecurityOfficerRoute";
import { logout } from "../redux/Features/AuthSlice";
import { Navigate } from "react-router-dom";
// import { notificationService } from "../services/notificationService";
import { notificationService } from "../services/notificationService";
const { Content } = Layout;

const AppLayout = () => {
  const { role, user, token, isLogged } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Remove FCM token on logout (only for management officers and admins)
      if (role === "MANAGEMENTOFFICER" || role === "ADMIN") {
        if (token) {
          await notificationService.removeFCMToken(token);
        }
      }
    } catch (error) {
      console.error("Error removing FCM token:", error);
    } finally {
      dispatch(logout());
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  // Extract username properly from user object
  const userName = typeof user === 'object' && user !== null 
    ? user.username || user.name || user.email || "User"
    : user || "User";

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Navbar
        title="Approval Management System"
        userName={userName}
        onLogout={handleLogout}
      />
      <Content style={{ padding: "24px" }}>
        {role === "MANAGEMENTOFFICER" ? (
          <ManagementOfficerRoute />
        ) : role === "SECURITYOFFICER" ? (
          <SecurityOfficerRoute />
        ) : (
          <Navigate to="/login" replace />
        )}
      </Content>
      <Footer />
    </Layout>
  );
};

export default AppLayout;