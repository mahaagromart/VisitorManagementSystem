import React from "react";
import { Table, Tag, Space, Button, Avatar, Card, Badge, Tooltip } from "antd";
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  EyeOutlined,
  MailOutlined,
  PhoneOutlined
} from "@ant-design/icons";

const ListOfUser = ({ users, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "gold";
      case "Approved": return "success";
      case "Rejected": return "error";
      default: return "default";
    }
  };

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <Space size="middle">
          <Avatar 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: "#1890ff",
              cursor: "pointer",
              transition: "transform 0.3s",
              boxShadow: "0 2px 8px rgba(24,144,255,0.2)"
            }}
            size={48}
            className="hover-scale"
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: "16px" }}>{record.name}</div>
            <div style={{ fontSize: "13px", color: "#666" }}>
              <MailOutlined style={{ marginRight: "4px" }} /> {record.email}
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>
              <PhoneOutlined style={{ marginRight: "4px" }} /> {record.phone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color="blue" style={{ borderRadius: "20px", padding: "4px 12px" }}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (dept) => (
        <Tag color="purple" style={{ borderRadius: "20px", padding: "4px 12px" }}>
          {dept}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge 
          status={getStatusColor(status)} 
          text={status}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      title: "Request Date",
      dataIndex: "requestDate",
      key: "requestDate",
      render: (date) => (
        <span style={{ color: "#666" }}>{date}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              shape="circle" 
              icon={<EyeOutlined />} 
              size="large"
              style={{ 
                borderRadius: "50%",
                width: "40px",
                height: "40px"
              }}
            />
          </Tooltip>
          {record.status === "Pending" && (
            <>
              <Tooltip title="Approve">
                <Button 
                  shape="circle" 
                  icon={<CheckCircleOutlined />} 
                  type="primary"
                  size="large"
                  style={{ 
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a"
                  }}
                  onClick={() => onStatusUpdate(record.id, "Approved")}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  shape="circle" 
                  icon={<CloseCircleOutlined />} 
                  danger
                  size="large"
                  style={{ 
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px"
                  }}
                  onClick={() => onStatusUpdate(record.id, "Rejected")}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  // Custom CSS for hover effects
  const style = document.createElement('style');
  style.innerHTML = `
    .hover-scale:hover {
      transform: scale(1.1);
      transition: transform 0.3s ease;
    }
    .ant-table-row {
      cursor: pointer;
    }
    .ant-table-row:hover {
      background: #f5f5f5 !important;
    }
  `;
  document.head.appendChild(style);

  return (
    <Card 
      bordered={false}
      style={{ 
        borderRadius: "24px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}
    >
      <Table 
        columns={columns} 
        dataSource={users}
        rowKey="id"
        pagination={{ 
          pageSize: 5,
          showTotal: (total) => `Total ${total} requests`,
          style: { borderRadius: "40px" }
        }}
        onRow={(record) => ({
          onClick: () => {
            // Optional: Handle row click
            console.log("Row clicked:", record);
          },
          style: { cursor: "pointer" }
        })}
      />
    </Card>
  );
};

export default ListOfUser;