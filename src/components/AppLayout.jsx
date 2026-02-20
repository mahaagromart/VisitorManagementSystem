import React ,{useEffect} from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ManagementOfficerRoute from "../routes/ManagementOfficerRoute";
import SecurityOfficerRoute from "../routes/SecurityOfficerRoute";
import { login, logout } from "../redux/Features/AuthSlice";
import { Navigate } from "react-router-dom";

const { Content } = Layout;

const AppLayout = () => {
  const { role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/login");
  };


  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Navbar
        title="Approval Management System"
        userName={user}
        onLogout={handleLogout}
      />
      <Content>
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