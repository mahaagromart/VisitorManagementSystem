import React from "react";
import { Layout, Dropdown, Avatar, Space, Typography } from "antd";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { FaShieldAlt } from "react-icons/fa";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = ({ title, userName, onLogout }) => {
  const items = [
    {
      key: "1",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: onLogout,
    },
  ];

  return (
    <Header style={{ background: "transparent", padding: 0 }}>
      {/* Center Container */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          background: "#777BD9",   
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "8px",     
        }}
      >
        {/* Left */}
        <Space align="center">
          <FaShieldAlt size={20} color="white" style={{marginTop : "25px"}} />
          <Text style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>
            {title}
          </Text>
        </Space>

        {/* Right */}
        <Dropdown menu={{ items }} placement="bottomRight">
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <Text style={{ color: "white" }}>{userName}</Text>
            <DownOutlined style={{ color: "white" }} />
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
