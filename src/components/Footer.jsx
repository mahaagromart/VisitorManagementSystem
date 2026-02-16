import React from "react";
import { Layout, Typography } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  RightOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  GithubOutlined
} from "@ant-design/icons";
import { FaShieldAlt } from "react-icons/fa";
import "./Footer.css";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = ({
  companyName = "Mahaagomart",
  onNavigate,
  showNewsletter = true,
  showSocial = true
}) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (link) => {
    onNavigate?.(link);
  };

  const quickLinks = [
    { label: "Dashboard", key: "dashboard", icon: <RightOutlined /> },
    { label: "Profile", key: "profile", icon: <RightOutlined /> },
    { label: "Settings", key: "settings", icon: <RightOutlined /> },
    { label: "Help Center", key: "help", icon: <RightOutlined /> },
  ];

  const supportLinks = [
    { label: "Privacy Policy", key: "privacy", icon: <RightOutlined /> },
    { label: "Terms of Service", key: "terms", icon: <RightOutlined /> },
    { label: "Cookie Policy", key: "cookies", icon: <RightOutlined /> },
    { label: "Contact Us", key: "contact", icon: <RightOutlined /> },
  ];

  const contactInfo = [
    { icon: <EnvironmentOutlined />, text: "123 Business Ave, Tech Park, Mumbai - 400001" },
    { icon: <PhoneOutlined />, text: "+91 98765 43210" },
    { icon: <MailOutlined />, text: "support@mahaagomart.com" },
  ];

  const socialIcons = [
    { icon: <FacebookOutlined />, link: "https://facebook.com", label: "Facebook" },
    { icon: <TwitterOutlined />, link: "https://twitter.com", label: "Twitter" },
    { icon: <LinkedinOutlined />, link: "https://linkedin.com", label: "LinkedIn" },
    { icon: <InstagramOutlined />, link: "https://instagram.com", label: "Instagram" },
    { icon: <GithubOutlined />, link: "https://github.com", label: "GitHub" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    if (email) {
      // Handle newsletter subscription
      console.log("Newsletter subscription:", email);
      // You can add your API call here
      alert("Thank you for subscribing to our newsletter!");
      e.target.reset();
    }
  };

  return (
    <AntFooter className="footer">
      <div className="footerContainer">
        {/* Main Footer Content */}
        <div className="footerContent">
          {/* Brand Section */}
          <div className="footerBrand">
            <div className="brandLogo">
              <FaShieldAlt className="brandIcon" />
              <div className="brandText">
                <Text className="brandName">SecureDash</Text>
                <Text className="brandTagline">by {companyName}</Text>
              </div>
            </div>
            <p className="brandDescription">
              Secure, reliable, and innovative dashboard solution for modern businesses. 
              Empowering your digital journey with cutting-edge technology.
            </p>
            {showSocial && (
              <div className="socialLinks">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="socialIcon"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="footerLinks">
            <Text className="linkTitle">Quick Links</Text>
            <ul className="linkList">
              {quickLinks.map((link) => (
                <li
                  key={link.key}
                  className="linkItem"
                  onClick={() => handleLinkClick(link.key)}
                >
                  <span className="linkIcon">{link.icon}</span>
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="footerLinks">
            <Text className="linkTitle">Support</Text>
            <ul className="linkList">
              {supportLinks.map((link) => (
                <li
                  key={link.key}
                  className="linkItem"
                  onClick={() => handleLinkClick(link.key)}
                >
                  <span className="linkIcon">{link.icon}</span>
                  {link.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="contactInfo">
            <Text className="linkTitle">Contact Us</Text>
            {contactInfo.map((item, index) => (
              <div key={index} className="contactItem">
                <span className="contactIcon">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}

            {/* Newsletter Section */}
            {showNewsletter && (
              <div className="newsletter">
                <Text className="newsletterTitle">Newsletter</Text>
                <p className="newsletterText">
                  Subscribe to get updates on new features and security updates.
                </p>
                <form className="newsletterInput" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    required
                    aria-label="Email for newsletter"
                  />
                  <button type="submit" className="newsletterButton">
                    Subscribe
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footerBottom">
          <p className="copyright">
            © {currentYear} {companyName}. All rights reserved.
          </p>
          <div className="footerBadge">
            <FaShieldAlt style={{ color: '#667eea' }} />
            <span>SecureDash</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;