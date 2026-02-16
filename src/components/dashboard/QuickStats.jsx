import React from "react";
import { Card, Typography } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
import "./QuickStats.css";

const { Title, Text } = Typography;

const QuickStats = ({ total, approved, rejected, pending }) => {
  return (
    <Card 
      hoverable
      className="statsCard"
      styles={{ body: { padding: "30px 20px" } }}
    >
      <div className="statsIconWrapper">
        <UserSwitchOutlined className="optionIcon" style={{ color: "white" }} />
      </div>
      <Title level={4} className="statsTitle">Quick Stats</Title>
      <div className="statsContent">
        <div className="statsItem">
          <span>Total Users:</span>
          <strong>{total}</strong>
        </div>
        <div className="statsItem">
          <span>Approved:</span>
          <strong style={{ color: "#52c41a" }}>{approved}</strong>
        </div>
        <div className="statsItem">
          <span>Rejected:</span>
          <strong style={{ color: "#ff4d4f" }}>{rejected}</strong>
        </div>
        <div className="statsItem">
          <span>Pending:</span>
          <strong style={{ color: "#faad14" }}>{pending}</strong>
        </div>
      </div>
    </Card>
  );
};

export default QuickStats;