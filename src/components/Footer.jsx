import React from "react";
import logo from "../assets/logo.webp";
import { Layout, Typography } from "antd";
import { PhoneOutlined, EnvironmentOutlined, MailOutlined } from "@ant-design/icons";
import "./Footer.css";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = ({
  companyName = "MAHAAGOMART",
  tagline = "Powered by Mahaagomart",
  description = "Approval Management System enhances security by ensuring that every request goes through a controlled and authorized review process. It uses role-based access control, authentication . Each approval step is tracked, creating a transparent audit trail that protects sensitive information and ensures accountability within the system.",
  address = "The MAIDC Ltd, Krushi Udyog Bhavan Dinkarrao Desai Marg, Aarey Milk Colony, Goregaon (E), Mumbai – 400065",
  phoneNumber = "+91 88888 42300",
  email = "info@mahaagromart.com",
}) => {
  const currentYear = new Date().getFullYear();

  const contactInfo = [
    { icon: <EnvironmentOutlined />, text: address },
    { icon: <PhoneOutlined />, text: phoneNumber },
    { 
      icon: <MailOutlined />, 
      text: <a href={`mailto:${email}`} className="emailLink">{email}</a> 
    },
  ];

  return (
    <AntFooter className="footer">
      <div className="footerContainer">

        <div className="footerContent">

          {/* Left – Brand */}
          <div className="footerLeft">
           
            <div className="logoText">
              <Text className="logoMainText"> <img src={logo} alt={companyName} className="footerLogo" /></Text>
              <Text className="logoSubText">{tagline}</Text>
            </div>
          </div>

          {/* Center – Description */}
          <div className="footerCenter">
            <p className="brandDescription">{description}</p>
          </div>

          {/* Right – Contact */}
          <div className="footerRight">
            {contactInfo.map((item, index) => (
              <div key={index} className="contactItem">
                <span className="contactIcon">{item.icon}</span>
                <span className="contactText">{item.text}</span>
              </div>
            ))}
          </div>

        </div>

        <div className="footerDivider" />

        <div className="footerBottom">
          <p className="copyright">
            © {currentYear}{" "}
            <a href="https://mahaagromart.com/">{companyName}</a>
            {" & "}
            <a href="https://mahaagromart.com/Team">Meet our team</a>
            {" · "}All rights reserved.
          </p>
        </div>

      </div>
    </AntFooter>
  );
};

export default Footer;