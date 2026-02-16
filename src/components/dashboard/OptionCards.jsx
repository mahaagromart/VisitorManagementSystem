import React from "react";
import { Row, Col, Card, Typography, Space } from "antd";
import { HiUserAdd } from "react-icons/hi";
import { IoListCircleOutline } from "react-icons/io5";
import PendingBadge from "./PendingBadge";
import QuickStats from "./QuickStats";
import "./OptionCards.css";

const { Title, Text } = Typography;

const OptionCards = ({ onSelect, stats }) => {
  return (
    <Row gutter={[24, 24]} justify="center" style={{ marginBottom: "20px" }}>
      <Col xs={24} sm={12} md={8}>
        <Card 
          hoverable
          onClick={() => onSelect('add')}
          className="optionCard"
          styles={{ body: { padding: "30px 20px" } }}
        >
          <div className="optionIconWrapper" style={{ background: "linear-gradient(135deg, #1890ff20 0%, #1890ff40 100%)" }}>
            <HiUserAdd className="optionIcon" style={{ color: "#1890ff" }} />
          </div>
          <Title level={4} className="optionTitle">Add New User</Title>
          <Text type="secondary" className="optionDescription">
            Create a new user approval request
          </Text>
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card 
          hoverable
          onClick={() => onSelect('view')}
          className="optionCard"
          styles={{ body: { padding: "30px 20px" } }}
        >
          <div className="optionIconWrapper" style={{ background: "linear-gradient(135deg, #52c41a20 0%, #52c41a40 100%)" }}>
            <IoListCircleOutline className="optionIcon" style={{ color: "#52c41a" }} />
          </div>
          <Title level={4} className="optionTitle">View Requests</Title>
          <Text type="secondary" className="optionDescription">
            Check and manage approval requests
          </Text>
          <PendingBadge count={stats.pending} />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <QuickStats 
          total={stats.total}
          approved={stats.approved}
          rejected={stats.rejected}
          pending={stats.pending}
        />
      </Col>
    </Row>
  );
};

export default OptionCards;