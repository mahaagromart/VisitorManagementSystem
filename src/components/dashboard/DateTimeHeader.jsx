import React from "react";
import { Row, Col, Space, Typography } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import "./DateTimeHeader.css";

const { Title, Text } = Typography;

const DateTimeHeader = ({ date, time }) => {
  return (
    <div className="dateTimeHeader">
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col xs={24} md={12}>
          <Space orientation="vertical" size={0} className="dateSection">
            <Space align="center" className="dateLabel">
              <CalendarOutlined style={{ fontSize: "20px" }} />
              <Text>Today's Date</Text>
            </Space>
            <Title level={3} className="dateValue">
              {date}
            </Title>
          </Space>
        </Col>
        <Col xs={24} md={12}>
          <Space orientation="vertical" size={0} className="timeSection" style={{ textAlign: "right", float: "right" }}>
            <Space align="center" className="timeLabel" style={{ justifyContent: "flex-end" }}>
              <ClockCircleOutlined style={{ fontSize: "20px" }} />
              <Text>Current Time</Text>
            </Space>
            <Title level={3} className="timeValue">
              {time}
            </Title>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default DateTimeHeader;