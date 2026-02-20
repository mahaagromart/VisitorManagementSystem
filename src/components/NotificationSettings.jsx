// [file name]: src/components/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import { Button, Card, Switch, message, Space, Typography } from 'antd';
import { BellOutlined, NotificationOutlined } from '@ant-design/icons';
import { useFCM } from '../hooks/useFCM';
import { notificationService } from '../services/notificationService';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

const NotificationSettings = () => {
  const { token: userToken, role } = useSelector((state) => state.auth);
  const { notificationPermission, retryFCMSetup, isNotificationSupported } = useFCM();
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = async () => {
    if (!userToken || !(role === "MANAGEMENTOFFICER" || role === "ADMIN")) return;
    
    try {
      const response = await notificationService.checkFCMTokenStatus(userToken);
      setHasToken(response.data?.hasToken || false);
    } catch (error) {
      console.error("Error checking token status:", error);
    }
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      await retryFCMSetup();
      await checkTokenStatus();
    } catch (error) {
      console.error("Error enabling notifications:", error);
      message.error("Failed to enable notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    try {
      await notificationService.removeFCMToken(userToken);
      setHasToken(false);
      message.success("Notifications disabled");
    } catch (error) {
      console.error("Error disabling notifications:", error);
      message.error("Failed to disable notifications");
    } finally {
      setLoading(false);
    }
  };

  if (!(role === "MANAGEMENTOFFICER" || role === "ADMIN")) {
    return null;
  }

  if (!isNotificationSupported) {
    return (
      <Card size="small">
        <Space>
          <NotificationOutlined style={{ color: '#faad14' }} />
          <Text type="secondary">Your browser doesn't support notifications</Text>
        </Space>
      </Card>
    );
  }

  return (
    <Card 
      size="small" 
      title={
        <Space>
          <BellOutlined />
          <span>Push Notifications</span>
        </Space>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Receive notifications for new visitor requests</Text>
          <Switch
            checked={hasToken && notificationPermission}
            onChange={hasToken ? handleDisableNotifications : handleEnableNotifications}
            loading={loading}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        </div>
        {!notificationPermission && (
          <Text type="danger" style={{ fontSize: '12px' }}>
            Browser notification permission is blocked. Please enable it in your browser settings.
          </Text>
        )}
      </Space>
    </Card>
  );
};

export default NotificationSettings;