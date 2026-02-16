import React, { useState, useEffect } from "react";
import { Layout, Dropdown, Avatar, Space, Typography } from "antd";
import {
  DownOutlined,
  LogoutOutlined,
  UserOutlined,
  ProfileOutlined,
  BellOutlined
} from "@ant-design/icons";
import { FaShieldAlt } from "react-icons/fa";
import "./Navbar.css";

const { Header } = Layout;
const { Text } = Typography;

const Navbar = ({
  title,
  userName,
  onLogout,
  onNavigate,
  userRole = "User",
  notifications = 0
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (tab) => {
    onNavigate?.(tab);
  };

  const dropdownItems = [
    {
      key: "profile",
      icon: <ProfileOutlined />,
      label: "Profile",
      onClick: () => handleNavClick("profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: onLogout,
      danger: true,
    },
  ];

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <Header
      className="navbarHeader"
      style={{
        background: scrolled
          ? 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
          : undefined
      }}
    >
      <div className="navbarContainer">
        {/* Logo Section */}
        <div className="logoContainer" onClick={() => handleNavClick("dashboard")}>
          <FaShieldAlt className="logoIcon" />
          <div className="logoText">
            <Text className="logoMainText">{title || "SecureDash"}</Text>
            <Text className="logoSubText">Power By Mahaagomart</Text>
          </div>
        </div>

        {/* User Section */}
        <Space size="middle">
          {/* Notification Bell */}
          {notifications > 0 && (
            <div className="notificationBell">
              <BellOutlined style={{ color: 'white', fontSize: '20px' }} />
              <span className="notificationBadge">{notifications}</span>
            </div>
          )}

          {/* User Dropdown */}
          <Dropdown
            menu={{ items: dropdownItems }}
            placement="bottomRight"
            trigger={['hover']}
            classNames={{ root: "customDropdown" }}
          >
            <div className="userContainer">
              <Avatar
                icon={<UserOutlined />}
                className="avatarIcon"
                size={40}
              >
                {getInitials(userName)}
              </Avatar>
              <div className="userInfo">
                <Text className="userGreeting">Welcome back,</Text>
                <Text className="userName">{userName || "Guest User"}</Text>
              </div>
              <DownOutlined className="dropdownIcon" />
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;