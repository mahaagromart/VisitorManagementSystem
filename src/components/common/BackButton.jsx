import React from "react";
import { Button } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import "./BackButton.css";

const BackButton = ({ onClick }) => {
  return (
    <Button 
      type="link" 
      onClick={onClick}
      icon={<AppstoreAddOutlined />}
      className="backButton"
    >
      Back to Options
    </Button>
  );
};

export default BackButton;