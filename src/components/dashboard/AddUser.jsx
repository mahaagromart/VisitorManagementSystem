import React, { useState } from "react";
import { Form, Input, Button, Select, Space, Card, Row, Col, Avatar, message, Upload, Divider, Typography } from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  TeamOutlined, 
  UploadOutlined, 
  CameraOutlined, 
  IdcardOutlined,
  FileImageOutlined,
  DeleteOutlined,
  EyeOutlined
} from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const AddUser = ({ onAddUser }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Handle profile image upload
  const handleProfileImageUpload = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      // Get the uploaded image URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setUploading(false);
        message.success('Profile image uploaded successfully!');
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error('Profile image upload failed.');
    }
  };

  // Handle document upload
  const handleDocumentUpload = (info) => {
    if (info.file.status === 'uploading') {
      return;
    }
    
    if (info.file.status === 'done') {
      // Read file as data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          uid: info.file.uid,
          name: info.file.name,
          type: info.file.type,
          size: info.file.size,
          url: e.target.result,
          status: 'done'
        };
        
        setDocumentFiles(prev => [...prev, newFile]);
        message.success(`${info.file.name} uploaded successfully!`);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  // Remove document
  const handleRemoveDocument = (file) => {
    setDocumentFiles(prev => prev.filter(f => f.uid !== file.uid));
    message.success(`${file.name} removed`);
  };

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    
    // Prepare documents data
    const documents = documentFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.url,
      uploadDate: new Date().toISOString()
    }));

    // Simulate API call
    setTimeout(() => {
      onAddUser({
        ...values,
        profileImage: profileImage, // Optional profile image
        documents: documents, // Optional documents
        requestDate: new Date().toISOString().split('T')[0]
      });
      
      message.success({
        content: "User request submitted for approval!",
        icon: <UserOutlined style={{ color: '#52c41a' }} />,
        duration: 3
      });
      
      form.resetFields();
      setProfileImage(null); // Reset profile image
      setDocumentFiles([]); // Reset documents
      setIsSubmitting(false);
    }, 500);
  };

  // Custom validation for images
  const beforeImageUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG image files!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    return true;
  };

  // Custom validation for documents (optional - can be any file type)
  const beforeDocumentUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Document must be smaller than 5MB!');
      return false;
    }
    return true;
  };

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={16} lg={14}>
        <Card 
          bordered={false}
          style={{ 
            borderRadius: "24px",
            background: "linear-gradient(145deg, #ffffff, #fafafa)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)"
          }}
        >
          {/* Header Section */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                src={profileImage}
                style={{ 
                  backgroundColor: !profileImage ? "#1890ff" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 6px 16px rgba(24,144,255,0.3)",
                  border: profileImage ? "3px solid #1890ff" : "none"
                }}
                className="hover-scale"
              />
              
              {/* Profile Image Upload Overlay */}
              <Upload
                name="profileImage"
                listType="picture-card"
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                onChange={handleProfileImageUpload}
                beforeUpload={beforeImageUpload}
              >
                <div style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  background: '#1890ff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '3px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s'
                }}
                className="hover-scale-small"
                >
                  <CameraOutlined style={{ color: 'white', fontSize: '18px' }} />
                </div>
              </Upload>
            </div>
            
            <h3 style={{ fontSize: "24px", fontWeight: "700", margin: "8px 0 4px", color: "#1a1a1a" }}>
              New User Request
            </h3>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Fill in the details to create a new user approval request
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            requiredMark="optional"
          >
            <Row gutter={24}>
              {/* Basic Information Section */}
              <Col span={24}>
                <Divider orientation="left" orientationMargin="0">
                  <Space>
                    <UserOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 600 }}>Basic Information</span>
                  </Space>
                </Divider>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter full name" }]}
                  tooltip="Enter the user's complete name"
                >
                  <Input 
                    prefix={<UserOutlined style={{ color: "#1890ff" }} />} 
                    placeholder="Enter full name"
                    style={{ 
                      borderRadius: "12px",
                      padding: "8px 12px"
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter a valid email" }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: "#1890ff" }} />} 
                    placeholder="Enter email"
                    style={{ 
                      borderRadius: "12px",
                      padding: "8px 12px"
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: "Please enter phone number" }]}
                >
                  <Input 
                    prefix={<PhoneOutlined style={{ color: "#1890ff" }} />} 
                    placeholder="Enter phone number"
                    style={{ 
                      borderRadius: "12px",
                      padding: "8px 12px"
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="role"
                  label="Role"
                  rules={[{ required: true, message: "Please select role" }]}
                >
                  <Select 
                    placeholder="Select role"
                    style={{ borderRadius: "12px" }}
                  >
                    <Option value="Admin">Admin</Option>
                    <Option value="Manager">Manager</Option>
                    <Option value="User">User</Option>
                    <Option value="Supervisor">Supervisor</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="department"
                  label="Department"
                  rules={[{ required: true, message: "Please select department" }]}
                >
                  <Select 
                    placeholder="Select department"
                    style={{ borderRadius: "12px" }}
                  >
                    <Option value="Engineering">Engineering</Option>
                    <Option value="Marketing">Marketing</Option>
                    <Option value="Sales">Sales</Option>
                    <Option value="HR">HR</Option>
                    <Option value="Finance">Finance</Option>
                    <Option value="Operations">Operations</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="employeeId"
                  label="Employee ID (Optional)"
                >
                  <Input 
                    prefix={<IdcardOutlined style={{ color: "#1890ff" }} />} 
                    placeholder="Enter employee ID"
                    style={{ 
                      borderRadius: "12px",
                      padding: "8px 12px"
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Documents Section - Optional */}
              <Col span={24}>
                <Divider orientation="left" orientationMargin="0">
                  <Space>
                    <FileImageOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 600 }}>Documents (Optional)</span>
                  </Space>
                </Divider>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px', fontSize: '13px' }}>
                  Upload any supporting documents (ID proofs, certificates, etc.) - Max 5MB per file
                </Text>
              </Col>

              {/* Document Upload Area */}
              <Col span={24}>
                <Upload
                  multiple
                  listType="text"
                  fileList={documentFiles}
                  onRemove={handleRemoveDocument}
                  onChange={handleDocumentUpload}
                  beforeUpload={beforeDocumentUpload}
                  customRequest={({ file, onSuccess }) => {
                    setTimeout(() => {
                      onSuccess("ok");
                    }, 0);
                  }}
                  showUploadList={{
                    showDownloadIcon: true,
                    downloadIcon: <EyeOutlined />,
                    showRemoveIcon: true,
                    removeIcon: <DeleteOutlined />,
                  }}
                >
                  <Button 
                    icon={<UploadOutlined />} 
                    style={{ 
                      borderRadius: "12px",
                      height: "40px",
                      borderStyle: 'dashed'
                    }}
                  >
                    Click to Upload Documents
                  </Button>
                </Upload>
                <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                </Text>
              </Col>

              {/* Alternative document types - Optional Section */}
              <Col span={24} style={{ marginTop: '16px' }}>
                <Space wrap>
                  <Button 
                    icon={<FileImageOutlined />} 
                    size="small"
                    onClick={() => message.info('Upload ID Proof')}
                    style={{ borderRadius: '20px' }}
                  >
                    ID Proof
                  </Button>
                  <Button 
                    icon={<FileImageOutlined />} 
                    size="small"
                    onClick={() => message.info('Upload Address Proof')}
                    style={{ borderRadius: '20px' }}
                  >
                    Address Proof
                  </Button>
                  <Button 
                    icon={<FileImageOutlined />} 
                    size="small"
                    onClick={() => message.info('Upload Certificate')}
                    style={{ borderRadius: '20px' }}
                  >
                    Certificate
                  </Button>
                </Space>
              </Col>

              {/* Submit Button */}
              <Col span={24} style={{ marginTop: '24px' }}>
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={isSubmitting}
                    block
                    size="large"
                    style={{ 
                      height: "48px",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: "600",
                      background: "linear-gradient(90deg, #1890ff, #096dd9)",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(24,144,255,0.3)"
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit for Approval"}
                  </Button>
                </Form.Item>
              </Col>

              {/* Note about optional fields */}
              <Col span={24}>
                <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center', display: 'block' }}>
                  <span style={{ color: '#ff4d4f' }}>*</span> Required fields • Profile image and documents are optional
                </Text>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>

 
    </Row>
  );
};

export default AddUser;