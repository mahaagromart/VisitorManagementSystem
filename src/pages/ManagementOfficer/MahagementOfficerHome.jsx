import React, { useState, useEffect } from "react";
import { Tabs, Card, Row, Col, Typography, Divider } from "antd";
import { HiUserAdd } from "react-icons/hi";
import { IoListCircleOutline } from "react-icons/io5";
import DateTimeHeader from "../../components/dashboard/DateTimeHeader";
import OptionCards from "../../components/dashboard/OptionCards";
import BackButton from "../../components/common/BackButton";
import AddUser from "../../components/dashboard/AddUser";
import ListOfUser from "../../components/dashboard/ListOfUser";
import "./MahagementOfficerHome.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const MahagementOfficerHome = () => {
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
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Manager",
      status: "Approved",
      phone: "+1 234 567 891",
      department: "Marketing",
      requestDate: "2024-01-14"
    }
  ]);

  // Calculate stats
  const stats = {
    total: users.length,
    approved: users.filter(u => u.status === "Approved").length,
    rejected: users.filter(u => u.status === "Rejected").length,
    pending: users.filter(u => u.status === "Pending").length
  };

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
    setUsers([...users, { 
      ...newUser, 
      id: users.length + 1, 
      status: "Pending",
      requestDate: new Date().toISOString().split('T')[0]
    }]);
    setActiveTab("2");
    setShowOptions(false);
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
            {/* Date and Time Header Component */}
            <DateTimeHeader date={formattedDate} time={formattedTime} />

            {/* Main Content */}
            {showOptions ? (
              <>
                <div className="optionsTitle">
                  <Title level={2} className="optionsMainTitle">
                    What would you like to do?
                  </Title>
                </div>

                {/* Option Cards Component */}
                <OptionCards 
                  onSelect={handleOptionSelect}
                  stats={stats}
                />
              </>
            ) : (
              <>
                {/* Back Button Component */}
                <BackButton onClick={handleBackToOptions} />

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
                        <span>Approval Requests ({stats.pending})</span>
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

export default MahagementOfficerHome;