import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Avatar, Card, Badge, Tooltip, Modal, Descriptions, Image, message } from "antd";
import {
  UserOutlined, CheckCircleOutlined, CloseCircleOutlined,
  EyeOutlined, ReloadOutlined
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const ListOfUser = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailModal, setDetailModal] = useState({ open: false, visitor: null });

  const { token, role } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch correct endpoint based on role
  const fetchVisitors = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (role === 'SECURITYOFFICER') endpoint = 'visitors/my-visitors';
      else if (role === 'MANAGEMENTOFFICER') endpoint = 'visitors/assigned';
      else if (role === 'ADMIN') endpoint = 'visitors/all';

      const res = await axios.get(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVisitors(res.data.data);
    } catch (error) {
      message.error('Failed to fetch visitor list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // ✅ Approve / Reject (only for MANAGEMENTOFFICER)
  const handleAction = async (visitorId, status) => {
    try {
      await axios.patch(
        `${API_URL}visitors/action/${visitorId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`Visitor ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully`);
      fetchVisitors();
    } catch (error) {
      message.error(error.response?.data?.message || 'Action failed');
    }
  };

  const getStatusTag = (status) => {
    const config = {
      PENDING: { color: 'gold', text: 'Pending' },
      APPROVED: { color: 'green', text: 'Approved' },
      REJECTED: { color: 'red', text: 'Rejected' },
    };
    const c = config[status] || { color: 'default', text: status };
    return <Tag color={c.color} style={{ borderRadius: 20, padding: '2px 12px' }}>{c.text}</Tag>;
  };

  const columns = [
    {
      title: "Visitor",
      key: "visitor",
      render: (_, record) => (
        <Space size="middle">
          <Avatar
            size={48}
            icon={<UserOutlined />}
            src={record.profileImage ? `${import.meta.env.VITE_BASE_URL}${record.profileImage}` : null}
            style={{ backgroundColor: "#1890ff", boxShadow: "0 2px 8px rgba(24,144,255,0.2)" }}
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{record.username}</div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {record.identityType}: {record.identityNo}
            </div>
            {record.documentName && (
              <div style={{ fontSize: 12, color: "#aaa" }}>Doc: {record.documentName}</div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: "Division",
      key: "division",
      render: (_, record) => (
        <Tag color="purple" style={{ borderRadius: 20, padding: '2px 10px' }}>
          {record.division?.name}
        </Tag>
      ),
    },
    {
      title: "Person to Meet",
      key: "personToMeet",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.personToMeet?.name}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.designation?.name}</div>
        </div>
      ),
    },
    {
      title: "Added By",
      key: "addedBy",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.addedBy?.username}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.addedBy?.email}</div>
        </div>
      ),
    },
    {
      title: "Assigned To",
      key: "assignedTo",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.assignedTo?.username}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.assignedTo?.designation}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: 'Pending', value: 'PENDING' },
        { text: 'Approved', value: 'APPROVED' },
        { text: 'Rejected', value: 'REJECTED' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => getStatusTag(status),
    },
    {
      title: "Requested At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span style={{ color: "#888", fontSize: 13 }}>
          {new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })}
        </span>
      ),
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* View Details */}
          <Tooltip title="View Details">
            <Button
              shape="circle"
              icon={<EyeOutlined />}
              size="middle"
              onClick={() => setDetailModal({ open: true, visitor: record })}
            />
          </Tooltip>

          {/* Approve / Reject — only for management officer on PENDING */}
          {role === 'MANAGEMENTOFFICER' && record.status === 'PENDING' && (
            <>
              <Tooltip title="Approve">
                <Button
                  shape="circle"
                  icon={<CheckCircleOutlined />}
                  size="middle"
                  style={{ backgroundColor: "#52c41a", borderColor: "#52c41a", color: "white" }}
                  onClick={() => handleAction(record._id, 'APPROVED')}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  shape="circle"
                  icon={<CloseCircleOutlined />}
                  size="middle"
                  danger
                  onClick={() => handleAction(record._id, 'REJECTED')}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        bordered={false}
        style={{ borderRadius: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              {role === 'SECURITYOFFICER' ? 'My Submitted Visitors' :
               role === 'MANAGEMENTOFFICER' ? 'Visitor Approval Requests' :
               'All Visitors'}
            </span>
            <Button icon={<ReloadOutlined />} onClick={fetchVisitors} loading={loading}>
              Refresh
            </Button>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={visitors}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total) => `Total ${total} visitors`,
          }}
          scroll={{ x: 1100 }}
        />
      </Card>

      {/* ✅ Detail Modal */}
      <Modal
        title="Visitor Details"
        open={detailModal.open}
        onCancel={() => setDetailModal({ open: false, visitor: null })}
        footer={null}
        width={600}
      >
        {detailModal.visitor && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Visitor Name" span={2}>
              <Space>
                {detailModal.visitor.profileImage && (
                  <Image
                    width={60}
                    height={60}
                    src={`${import.meta.env.VITE_BASE_URL}${detailModal.visitor.profileImage}`}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                )}
                <span style={{ fontWeight: 600 }}>{detailModal.visitor.username}</span>
              </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Identity Type">
              {detailModal.visitor.identityType}
            </Descriptions.Item>
            <Descriptions.Item label="Identity Number">
              {detailModal.visitor.identityNo}
            </Descriptions.Item>

            {detailModal.visitor.documentName && (
              <Descriptions.Item label="Document Name" span={2}>
                {detailModal.visitor.documentName}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Division">
              {detailModal.visitor.division?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Designation">
              {detailModal.visitor.designation?.name}
            </Descriptions.Item>

            <Descriptions.Item label="Person to Meet" span={2}>
              {detailModal.visitor.personToMeet?.name} ({detailModal.visitor.personToMeet?.email})
            </Descriptions.Item>

            <Descriptions.Item label="Added By">
              {detailModal.visitor.addedBy?.username}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned To">
              {detailModal.visitor.assignedTo?.username}
            </Descriptions.Item>

            <Descriptions.Item label="Status" span={2}>
              {getStatusTag(detailModal.visitor.status)}
            </Descriptions.Item>

            {detailModal.visitor.remarks && (
              <Descriptions.Item label="Remarks" span={2}>
                {detailModal.visitor.remarks}
              </Descriptions.Item>
            )}

            {detailModal.visitor.actionAt && (
              <Descriptions.Item label="Action Taken At" span={2}>
                {new Date(detailModal.visitor.actionAt).toLocaleString()}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="Requested At" span={2}>
              {new Date(detailModal.visitor.createdAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default ListOfUser;
