import React from "react";
import { Row, Col, Card, Typography } from "antd";
import { HiUserAdd } from "react-icons/hi";
import { IoListCircleOutline } from "react-icons/io5";
import PendingBadge from "./PendingBadge";
import QuickStats from "./QuickStats";
import "./OptionCards.css";

const { Title, Text } = Typography;

const OptionCards = ({ onSelect, stats, role }) => {
  return (
    <Row gutter={[24, 24]} justify="center" style={{ marginBottom: "20px" }}>

      {/* ✅ Show Add Visitor ONLY for SECURITYOFFICER */}
      {role === 'SECURITYOFFICER' && (
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => onSelect('add')}
            className="optionCard"
            styles={{ body: { padding: "30px 20px" } }}
          >
            <div
              className="optionIconWrapper"
              style={{ background: "linear-gradient(135deg, #1890ff20 0%, #1890ff40 100%)" }}
            >
              <HiUserAdd className="optionIcon" style={{ color: "#1890ff" }} />
            </div>
            <Title level={4} className="optionTitle">Add New Visitor</Title>
            <Text type="secondary" className="optionDescription">
              Submit a new visitor request
            </Text>
          </Card>
        </Col>
      )}

      {/* ✅ View Requests — shown for both roles */}
      <Col xs={24} sm={12} md={8}>
        <Card
          hoverable
          onClick={() => onSelect('view')}
          className="optionCard"
          styles={{ body: { padding: "30px 20px" } }}
        >
          <div
            className="optionIconWrapper"
            style={{ background: "linear-gradient(135deg, #52c41a20 0%, #52c41a40 100%)" }}
          >
            <IoListCircleOutline className="optionIcon" style={{ color: "#52c41a" }} />
          </div>
          <Title level={4} className="optionTitle">
            {role === 'MANAGEMENTOFFICER' ? 'Approval Requests' : 'View Requests'}
          </Title>
          <Text type="secondary" className="optionDescription">
            {role === 'MANAGEMENTOFFICER'
              ? 'Review and approve visitor requests'
              : 'Check and manage visitor requests'}
          </Text>
          <PendingBadge count={stats?.pending || 0} />
        </Card>
      </Col>

      {/* Quick Stats */}
      <Col xs={24} sm={12} md={8}>
        <QuickStats
          total={stats?.total || 0}
          approved={stats?.approved || 0}
          rejected={stats?.rejected || 0}
          pending={stats?.pending || 0}
        />
      </Col>

    </Row>
  );
};

export default OptionCards;