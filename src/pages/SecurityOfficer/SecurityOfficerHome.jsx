import React, { useState, useEffect } from "react";
import { Tabs, Card, Row, Col, Typography, Divider, Space, Button, Statistic } from "antd";
import { HiUserAdd } from "react-icons/hi";
import { IoListCircleOutline } from "react-icons/io5";
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserSwitchOutlined, 
  AppstoreAddOutlined 
} from "@ant-design/icons";
import AddUser from "../../components/dashboard/AddUser";
import ListOfUser from "../../components/dashboard/ListOfUser";
import "./SecurityOfficerHome.css"; 

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const SecurityOfficerHome = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [showOptions, setShowOptions] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Pending",
      phone: "+1 234 567 890",
      department: "Engineering",
      requestDate: "2024-01-15"
    }
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Handle option selection
  const handleOptionSelect = (option) => {
    setShowOptions(false);
    if (option === 'add') {
      setActiveTab("1");
    } else if (option === 'view') {
      setActiveTab("2");
    }
  };

  // Handle back to options
  const handleBackToOptions = () => {
    setShowOptions(true);
  };

  // Handle new user addition
  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: users.length + 1, status: "Pending" }]);
    setActiveTab("2");
  };

  // Handle approval status update
  const handleStatusUpdate = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  return (
    <div className="homeContainer">
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card className="contentCard">
            {/* Header with Date and Time */}
            <div className="dateTimeHeader">
              <Row gutter={[16, 16]} align="middle" justify="space-between">
                <Col xs={24} md={12}>
                  <Space orientation="vertical" size={0} className="dateSection">
                    <Space align="center" className="dateLabel">
                      <CalendarOutlined style={{ fontSize: "20px" }} />
                      <Text>Today's Date</Text>
                    </Space>
                    <Title level={3} className="dateValue">
                      {formattedDate}
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
                      {formattedTime}
                    </Title>
                  </Space>
                </Col>
              </Row>
            </div>

            {/* Main Content */}
            {showOptions ? (
              <>
                <div className="optionsTitle">
                  <Title level={2} className="optionsMainTitle">
                    What would you like to do?
                  </Title>
                  <Text type="secondary" className="optionsSubtitle">
                    Please select an option to continue
                  </Text>
                </div>

                <Row gutter={[24, 24]} justify="center" style={{ marginBottom: "20px" }}>
                  <Col xs={24} sm={12} md={8}>
                    <Card 
                      hoverable
                      onClick={() => handleOptionSelect('add')}
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
                      onClick={() => handleOptionSelect('view')}
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
                      {users.filter(u => u.status === "Pending").length > 0 && (
                        <div className="pendingBadge">
                          <Statistic 
                            value={users.filter(u => u.status === "Pending").length} 
                            suffix="pending"
                            styles={{ fontSize: "14px", color: "#faad14" }}
                          />
                        </div>
                      )}
                    </Card>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
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
                          <strong>{users.length}</strong>
                        </div>
                        <div className="statsItem">
                          <span>Approved:</span>
                          <strong style={{ color: "#52c41a" }}>{users.filter(u => u.status === "Approved").length}</strong>
                        </div>
                        <div className="statsItem">
                          <span>Rejected:</span>
                          <strong style={{ color: "#ff4d4f" }}>{users.filter(u => u.status === "Rejected").length}</strong>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <div>
                  <Button 
                    type="link" 
                    onClick={handleBackToOptions}
                    icon={<AppstoreAddOutlined />}
                    className="backButton"
                  >
                    Back to Options
                  </Button>
                </div>

                <div className="approvalHeader">
                  <Title level={2} className="approvalTitle">
                    Request for New Approval
                  </Title>
                  <Divider className="divider" />
                </div>

                <Tabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab}
                  centered
                  size="large"
                  tabBarStyle={{ 
                    marginBottom: "24px",
                    borderBottom: "none"
                  }}
                  className="tabContainer"
                >
                  <TabPane 
                    tab={
                      <div className={`tabItem ${activeTab === "1" ? "tabItemActive" : ""}`}>
                        <HiUserAdd className="tabIcon" />
                        <span>Add User</span>
                      </div>
                    } 
                    key="1"
                  >
                    <AddUser onAddUser={handleAddUser} />
                  </TabPane>

                  <TabPane 
                    tab={
                      <div className={`tabItem ${activeTab === "2" ? "tabItemActive" : ""}`}>
                        <IoListCircleOutline className="tabIcon" />
                        <span>Approval Requests ({users.filter(u => u.status === "Pending").length})</span>
                      </div>
                    } 
                    key="2"
                  >
                    <ListOfUser 
                      users={users} 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </TabPane>
                </Tabs>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SecurityOfficerHome;