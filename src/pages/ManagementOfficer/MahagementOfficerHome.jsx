import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Divider, message } from "antd";
import DateTimeHeader from "../../components/dashboard/DateTimeHeader";
import OptionCards from "../../components/dashboard/OptionCards";
import BackButton from "../../components/common/BackButton";
import ListOfUser from "../../components/dashboard/ListOfUser";
import AddUser from "../../components/dashboard/AddUser";
import axios from "axios";
import { useSelector } from "react-redux";
import "./MahagementOfficerHome.css";

const { Title } = Typography;

const MahagementOfficerHome = () => {
  const [showOptions, setShowOptions] = useState(true);
  const [activeView, setActiveView] = useState('view'); // 'add' or 'view'
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    total: 0, approved: 0, rejected: 0, pending: 0
  });

  const { token, role } = useSelector((state) => state.auth); // ✅ get role
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch real stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoint = role === 'MANAGEMENTOFFICER'
          ? 'visitors/assigned'
          : 'visitors/my-visitors';

        const res = await axios.get(`${API_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data.data;
        setStats({
          total: data.length,
          approved: data.filter(v => v.status === 'APPROVED').length,
          rejected: data.filter(v => v.status === 'REJECTED').length,
          pending: data.filter(v => v.status === 'PENDING').length,
        });
      } catch {
        message.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  // ✅ Handle option select
  const handleOptionSelect = (option) => {
    setActiveView(option);
    setShowOptions(false);
  };

  return (
    <div className="homeContainer">
      <Row gutter={[24, 24]} justify="center">
        <Col xs={24} sm={22} md={20} lg={18} xl={16}>
          <Card className="contentCard">

            <DateTimeHeader date={formattedDate} time={formattedTime} />

            {showOptions ? (
              <>
                <div className="optionsTitle">
                  <Title level={2} className="optionsMainTitle">
                    What would you like to do?
                  </Title>
                </div>

                {/* ✅ Pass role so OptionCards can hide Add for MANAGEMENTOFFICER */}
                <OptionCards
                  onSelect={handleOptionSelect}
                  stats={stats}
                  role={role}
                />
              </>
            ) : (
              <>
                <BackButton onClick={() => setShowOptions(true)} />

                <div className="approvalHeader">
                  <Title level={2} className="approvalTitle">
                    {activeView === 'add' ? 'Add New Visitor' : 'Visitor Approval Requests'}
                  </Title>
                  <Divider className="divider" />
                </div>

                {/* ✅ Show correct component based on selection */}
                {activeView === 'add' ? <AddUser /> : <ListOfUser />}
              </>
            )}

          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MahagementOfficerHome;