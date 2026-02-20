import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Card, Row, Col, Avatar, message, Upload, Typography } from "antd";
import {
  UserOutlined, CameraOutlined, IdcardOutlined, ShopOutlined, TeamOutlined
} from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const { Option } = Select;
const { Text } = Typography;

const divisions = [
  { id: 1, name: 'PA to MD' }, { id: 2, name: 'GM' },
  { id: 3, name: 'E-Commerce (Mahaagromart)' }, { id: 4, name: 'IT' },
  { id: 5, name: 'Noga' }, { id: 6, name: 'Agri Engg' },
  { id: 7, name: 'Fertilizer' }, { id: 8, name: 'Admin' },
  { id: 9, name: 'Finance' }, { id: 10, name: 'RO Thane' },
  { id: 11, name: 'Animal Feed' }, { id: 12, name: 'Pesticide' }
];

const designations = [
  { id: 1, name: 'Honorable Managing Director', level: 1 },
  { id: 2, name: 'General Manager', level: 2 },
  { id: 3, name: 'Deputy General Manager', level: 3 },
  { id: 4, name: 'Manager', level: 4 },
  { id: 5, name: 'Deputy Manager', level: 5 },
  { id: 6, name: 'Assistant Manager', level: 6 },
  { id: 7, name: 'Sr. Assistant Manager', level: 7 }
];

const AddUser = ({ onAddUser }) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [identityType, setIdentityType] = useState('');

  // Persons to meet from API
  const [persons, setPersons] = useState([]);
  const [loadingPersons, setLoadingPersons] = useState(false);

  // Management officers for approval
  const [managementOfficers, setManagementOfficers] = useState([]);

  // Track selected filters
  const [selectedDivisionId, setSelectedDivisionId] = useState(null);
  const [selectedDesignationId, setSelectedDesignationId] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch management officers for approval dropdown on mount
  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const res = await axios.get(`${API_URL}visitors/management-officers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setManagementOfficers(res.data.data);
      } catch {
        message.error('Failed to fetch management officers');
      }
    };
    fetchOfficers();
  }, []);

  // ✅ Fetch persons to meet whenever BOTH division and designation are selected
  useEffect(() => {
    if (selectedDivisionId && selectedDesignationId) {
      fetchPersonsToMeet(selectedDivisionId, selectedDesignationId);
    } else {
      setPersons([]);
      form.setFieldsValue({ personName: undefined });
    }
  }, [selectedDivisionId, selectedDesignationId]);

  const fetchPersonsToMeet = async (divisionId, designationId) => {
    setLoadingPersons(true);
    form.setFieldsValue({ personName: undefined });
    try {
      const res = await axios.get(`${API_URL}visitors/persons-to-meet`, {
        params: { divisionId, designationId },
        headers: { Authorization: `Bearer ${token}` }
      });

      setPersons(res.data.data);

      if (res.data.data.length === 0) {
        message.warning('No persons found for the selected division and designation');
      }
    } catch {
      message.error('Failed to fetch persons to meet');
      setPersons([]);
    } finally {
      setLoadingPersons(false);
    }
  };

  const handleDivisionChange = (value) => {
    setSelectedDivisionId(value);
    setPersons([]);
    form.setFieldsValue({ personName: undefined });
  };

  const handleDesignationChange = (value) => {
    setSelectedDesignationId(value);
    setPersons([]);
    form.setFieldsValue({ personName: undefined });
  };

  const handleProfileImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target.result);
      reader.readAsDataURL(file);
      setImageFile(file);
      message.success('Photo selected successfully!');
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    const selectedPerson = persons.find(p => p._id === values.personName);
    const selectedDivision = divisions.find(d => d.id === values.division);
    const selectedDesignation = designations.find(d => d.id === values.designation);

    // ✅ Use FormData to send image + data together
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('identityType', values.identityType);
    formData.append('identityNo', values.identityNo);
    formData.append('documentName', values.documentName || '');
    formData.append('assignedTo', values.assignedTo);
    formData.append('division', JSON.stringify({
      id: selectedDivision?.id,
      name: selectedDivision?.name
    }));
    formData.append('designation', JSON.stringify({
      id: selectedDesignation?.id,
      name: selectedDesignation?.name
    }));
    formData.append('personToMeet', JSON.stringify({
      id: selectedPerson?._id,
      name: selectedPerson?.username,
      email: selectedPerson?.email
    }));
    if (imageFile) formData.append('profileImage', imageFile);

    try {
      const res = await axios.post(`${API_URL}visitors/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        message.success('Visitor request submitted! Awaiting management approval.');
        form.resetFields();
        setProfileImage(null);
        setImageFile(null);
        setPersons([]);
        setIdentityType('');
        setSelectedDivisionId(null);
        setSelectedDesignationId(null);
        if (onAddUser) onAddUser(res.data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to submit visitor request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Row justify="center" style={{ padding: '24px' }}>
      <Col xs={24} sm={20} md={18} lg={16}>
        <Card bordered={false} style={{ borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "-8px" }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={profileImage}
                style={{
                  backgroundColor: !profileImage ? "#1890ff" : "transparent",
                  boxShadow: "0 4px 12px rgba(24,144,255,0.3)",
                  border: profileImage ? "3px solid #1890ff" : "none"
                }}
              />
              <Upload
                name="profileImage"
                showUploadList={false}
                customRequest={({ file, onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                onChange={handleProfileImageUpload}
                beforeUpload={(file) => {
                  const ok = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type);
                  if (!ok) { message.error('JPG/PNG only!'); return false; }
                  const isLt2M = file.size / 1024 / 1024 < 2;
                  if (!isLt2M) { message.error('Image must be under 2MB!'); return false; }
                  return true;
                }}
              >
                <div style={{
                  position: 'absolute', bottom: '0px', right: '0px',
                  background: '#1890ff', borderRadius: '50%', width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <CameraOutlined style={{ color: 'white', fontSize: '16px' }} />
                </div>
              </Upload>
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: "700", margin: "0 0 4px", color: "#1a1a1a" }}>
              New Visitor Request
            </h2>
            <Text type="secondary" style={{ fontSize: "15px" }}>
              Fill in the details to submit a visitor request
            </Text>
          </div>

          <Form form={form} layout="vertical" onFinish={handleSubmit} size="middle" requiredMark="optional">
            <Row gutter={[16, 0]}>

              {/* Visitor Name */}
              <Col span={24}>
                <Form.Item name="username" label="Visitor Name"
                  rules={[{ required: true, message: "Please enter visitor name" }]}>
                  <Input prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Enter visitor full name" style={{ borderRadius: "8px" }} />
                </Form.Item>
              </Col>

              {/* Identity Type */}
              <Col xs={24} md={12}>
                <Form.Item name="identityType" label="Identity Type"
                  rules={[{ required: true, message: "Please select identity type" }]}>
                  <Select placeholder="Select identity type" style={{ borderRadius: "8px" }}
                    onChange={(val) => { setIdentityType(val); form.setFieldsValue({ documentName: '' }); }}>
                    <Option value="AADHAR">Aadhar Card</Option>
                    <Option value="PAN">PAN Card</Option>
                    <Option value="VOTER_ID">Voter ID</Option>
                    <Option value="DRIVING_LICENSE">Driving License</Option>
                    <Option value="PASSPORT">Passport</Option>
                    <Option value="COMPANY_ID">Company ID</Option>
                    <Option value="OTHERS">Others</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Identity Number */}
              <Col xs={24} md={12}>
                <Form.Item name="identityNo" label="Identity Number"
                  rules={[{ required: true, message: "Please enter identity number" }]}>
                  <Input prefix={<IdcardOutlined style={{ color: "#bfbfbf" }} />}
                    placeholder="Enter identity number" style={{ borderRadius: "8px" }} />
                </Form.Item>
              </Col>

              {/* Document Name — only for OTHERS */}
              {identityType === 'OTHERS' && (
                <Col span={24}>
                  <Form.Item name="documentName" label="Document Name"
                    rules={[{ required: true, message: "Please enter document name" }]}>
                    <Input prefix={<IdcardOutlined style={{ color: "#bfbfbf" }} />}
                      placeholder="e.g. Employee ID, Club Card" style={{ borderRadius: "8px" }} />
                  </Form.Item>
                </Col>
              )}

              {/* ✅ Division — triggers API fetch */}
              <Col span={24}>
                <Form.Item name="division" label="Division to Visit"
                  rules={[{ required: true, message: "Please select division" }]}>
                  <Select
                    placeholder="Select division to visit"
                    style={{ borderRadius: "8px" }}
                    suffixIcon={<ShopOutlined />}
                    showSearch
                    optionFilterProp="children"
                    onChange={handleDivisionChange}
                  >
                    {divisions.map(d => (
                      <Option key={d.id} value={d.id}>{d.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* ✅ Designation — triggers API fetch */}
              <Col xs={24} md={12}>
                <Form.Item name="designation" label="Designation of Person to Meet"
                  rules={[{ required: true, message: "Please select designation" }]}>
                  <Select
                    placeholder="Select designation"
                    style={{ borderRadius: "8px" }}
                    suffixIcon={<TeamOutlined />}
                    showSearch
                    optionFilterProp="children"
                    onChange={handleDesignationChange}
                  >
                    {designations.sort((a, b) => a.level - b.level).map(d => (
                      <Option key={d.id} value={d.id}>{d.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* ✅ Person to Meet — populated from API */}
              <Col xs={24} md={12}>
                <Form.Item
                  name="personName"
                  label="Person to Meet"
                  rules={[{ required: true, message: "Please select person to meet" }]}
                  extra={
                    !selectedDivisionId || !selectedDesignationId
                      ? <span style={{ color: '#faad14', fontSize: 12 }}>
                          Select division and designation first
                        </span>
                      : persons.length === 0 && !loadingPersons
                      ? <span style={{ color: '#ff4d4f', fontSize: 12 }}>
                          No persons found for this selection
                        </span>
                      : null
                  }
                >
                  <Select
                    placeholder={
                      !selectedDivisionId || !selectedDesignationId
                        ? "Select division & designation first"
                        : loadingPersons
                        ? "Loading persons..."
                        : persons.length === 0
                        ? "No persons found"
                        : "Select person to meet"
                    }
                    style={{ borderRadius: "8px" }}
                    loading={loadingPersons}
                    disabled={!selectedDivisionId || !selectedDesignationId || loadingPersons}
                    showSearch
                    optionFilterProp="children"
                    notFoundContent={
                      loadingPersons
                        ? "Loading..."
                        : "No persons found for this division & designation"
                    }
                  >
                    {persons.map(p => (
                      <Option key={p._id} value={p._id}>
                        {p.username} — {p.designations?.[0]?.designationName || p.designation} ({p.email})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* ✅ Send Approval To — management officer */}
              <Col span={24}>
                <Form.Item name="assignedTo" label="Send Approval Request To"
                  rules={[{ required: true, message: "Please select a management officer for approval" }]}>
                  <Select
                    placeholder="Select management officer for approval"
                    showSearch
                    optionFilterProp="children"
                    notFoundContent="No management officers found"
                  >
                    {managementOfficers.map(o => (
                      <Option key={o._id} value={o._id}>
                        {o.username} — {o.designation} ({o.email})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* Submit */}
              <Col span={24} style={{ marginTop: '16px' }}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    block
                    size="large"
                    style={{
                      height: "46px", borderRadius: "8px",
                      fontSize: "16px", fontWeight: "600",
                      background: "#1890ff", border: "none"
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Visitor Request"}
                  </Button>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Text type="secondary" style={{ fontSize: '12px', textAlign: 'center', display: 'block' }}>
                  <span style={{ color: '#ff4d4f' }}>*</span> All fields are required
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