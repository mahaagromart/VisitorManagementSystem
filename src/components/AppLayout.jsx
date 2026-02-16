import React, { useEffect } from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import ManagementOfficerRoute from "../routes/ManagementOfficerRoute";
import SecurityOfficerRoute from "../routes/SecurityOfficerRoute";
import { logout } from "../redux/Features/AuthSlice";

const { Content } = Layout;
const AppLayout = () => {
  const { role, user, isLogged } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  // Don't render content if not logged in
  if (!isLogged) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Navbar
        title="Approval Management System"
        userName={user}
        onLogout={handleLogout}
      />
      <Content>
        {role === "ManagementOfficer" ? (
          <ManagementOfficerRoute />
        ) : (
          <SecurityOfficerRoute />
        )}
      </Content>
    </Layout>
  );
};

export default AppLayout;