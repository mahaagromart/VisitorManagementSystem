import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, User, Shield } from "lucide-react";
import "./LoginForm.css";
import axios from 'axios';
import { useDispatch } from "react-redux";
import { login } from "../../redux/Features/AuthSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  // Initial form values
  const initialValues = {
    EmailId: "",
    Password: "",
    Designation: ""
  };

  // Validation schema
  const validationSchema = Yup.object({
    EmailId: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    Password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    Designation: Yup.string()
      .required("Please select your designation")
  });

  // Handle form submission
    // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    //   setLoading(true);
    //   setError('');
    //   setSuccess('');

    //   try {
    //     const response = await axios.post(
    //       `${API_URL}auth/login`,
    //       {
    //         email: values.EmailId,      
    //         password: values.Password
    //       },
    //       {
    //         headers: { 'Content-Type': 'application/json' }
    //       }
    //     );

    //     console.log("Login Response:", response.data);

    //     if (response.data.success) {
    //       const { data } = response.data;

    //       // ✅ Correctly mapped from API response
    //       const userData = {
    //         user: data.user.username,       // was: data.username
    //         token: data.token,              // was: data.accessToken
    //         role: data.role,                // ✅ correct
    //         email: data.user.email,         // was: data.email
    //         UserId: data.UserId,            // was: data.userId
    //         isLogged: true                  // ✅ correct
    //       };

    //       dispatch(login(userData));

    //       // ✅ localStorage correctly mapped
    //       localStorage.setItem('user', data.user.username);
    //       localStorage.setItem('token', data.token);
    //       localStorage.setItem('role', data.role);
    //       localStorage.setItem('email', data.user.email);
    //       localStorage.setItem('UserId', data.UserId);

    //       navigate("/");
    //       setSuccess('Login successful!');
    //       resetForm();
    //     }

    //   } catch (err) {
    //     console.error("Login Error:", err);
    //     setError(
    //       err.response?.data?.message ||
    //       'Login failed. Please check your credentials and try again.'
    //     );
    //   } finally {
    //     setLoading(false);
    //     setSubmitting(false);
    //   }
    // };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    const response = await axios.post(
      `${API_URL}auth/login`,
      {
        email: values.EmailId,
        password: values.Password
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log("Login Response:", response.data);

    if (response.data.success) {
      const { data } = response.data;

      // ✅ Map selected designation to API role
      const designationToRole = {
        'Managing Officer': 'MANAGEMENTOFFICER',
        'Security Officer': 'SECURITYOFFICER',
      };

      const selectedRole = designationToRole[values.Designation];

      // ✅ Role mismatch check
      if (data.role !== selectedRole) {
        setError(
          `Access denied. You selected "${values.Designation}" but your account role is "${data.role}". Please select the correct designation.`
        );
        setLoading(false);
        setSubmitting(false);
        return;
      }

      // ✅ Role matched — proceed with login
      const userData = {
        user: data.user.username,
        token: data.token,
        role: data.role,
        email: data.user.email,
        UserId: data.UserId,
        isLogged: true
      };

      dispatch(login(userData));

      // localStorage.setItem('user', data.user.username);
      // localStorage.setItem('token', data.token);
      // localStorage.setItem('role', data.role);
      // localStorage.setItem('email', data.user.email);
      // localStorage.setItem('UserId', data.UserId);

      // ✅ Navigate based on role
      if (data.role === 'MANAGEMENTOFFICER') {
        navigate('/');
      } else if (data.role === 'SECURITYOFFICER') {
        navigate('/');
      } else if (data.role === 'ADMIN') {
        navigate('/');
      }

      setSuccess('Login successful!');
      resetForm();
    }

  } catch (err) {
    console.error("Login Error:", err);
    setError(
      err.response?.data?.message ||
      'Login failed. Please check your credentials and try again.'
    );
  } finally {
    setLoading(false);
    setSubmitting(false);
  }
};








  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Left side - Image with overlay */}
        <div className="login-image-container">
          <div className="login-image">
            <div className="image-overlay">
              <h2>Welcome Back!</h2>
              <p>Log in to access your personalized dashboard and manage your account</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="login-form">
          <div className="form-header">
            <h1>Login</h1>
            <p>Please enter your credentials to continue</p>
          </div>

          {error && (
            <div className="alert alert-error" style={{ 
              color: '#721c24', 
              marginBottom: '15px', 
              padding: '12px', 
              backgroundColor: '#f8d7da', 
              borderRadius: '4px',
              border: '1px solid #f5c6cb'
            }}>
              <strong>Error: </strong> {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" style={{ 
              color: '#155724', 
              marginBottom: '15px', 
              padding: '12px', 
              backgroundColor: '#d4edda', 
              borderRadius: '4px',
              border: '1px solid #c3e6cb'
            }}>
              <strong>Success: </strong> {success}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form autoComplete="off">
                {/* Designation Label */}
                <div className="designation-label">SELECT DESIGNATION *</div>
                
                {/* Designation Selection Field */}
                <div className="form-group">
                  <div className="designation-options">
                    {/* Managing Officer Card */}
                    <button
                      type="button"
                      className={`designation-card ${values.Designation === 'Managing Officer' ? 'selected' : ''}`}
                      onClick={() => setFieldValue('Designation', 'Managing Officer')}
                      disabled={loading}
                      style={{ 
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <div className="designation-icon-wrapper">
                        <div className="designation-icon">
                          <User />
                        </div>
                      </div>
                      <div className="designation-info">
                        <div className="designation-title">Managing</div>
                        <div className="designation-subtitle">Officer</div>
                        <div className="designation-description">Administrative & Management Access</div>
                      </div>
                    </button>

                    {/* Security Officer Card */}
                    <button
                      type="button"
                      className={`designation-card ${values.Designation === 'Security Officer' ? 'selected' : ''}`}
                      onClick={() => setFieldValue('Designation', 'Security Officer')}
                      disabled={loading}
                      style={{ 
                        opacity: loading ? 0.6 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <div className="designation-icon-wrapper">
                        <div className="designation-icon">
                          <Shield />
                        </div>
                      </div>
                      <div className="designation-info">
                        <div className="designation-title">Security</div>
                        <div className="designation-subtitle">Officer</div>
                        <div className="designation-description">Security & Surveillance Access</div>
                      </div>
                    </button>
                  </div>
                  <ErrorMessage
                    name="Designation"
                    component="div"
                    className="error-message"
                  />
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="EmailId">EMAIL ADDRESS *</label>
                  <Field
                    type="email"
                    name="EmailId"
                    id="EmailId"
                    placeholder="Enter your email address"
                    className={`form-input ${errors.EmailId && touched.EmailId ? 'error' : ''}`}
                    autoComplete="off"
                    disabled={loading}
                  />
                  <ErrorMessage
                    name="EmailId"
                    component="div"
                    className="error-message"
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="Password">PASSWORD *</label>
                  <div className="password-field">
                    <div className="password-input-wrapper">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="Password"
                        id="Password"
                        placeholder="Enter your password"
                        className={`form-input ${errors.Password && touched.Password ? 'error' : ''}`}
                        autoComplete="new-password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="password-toggle"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <ErrorMessage
                    name="Password"
                    component="div"
                    className="error-message"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="submit-button"
                  style={{
                    opacity: (isSubmitting || loading) ? 0.7 : 1,
                    cursor: (isSubmitting || loading) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? (
                    <span className="spinner">Logging in...</span>
                  ) : (
                    "Login"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Role information note */}
          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center', 
            fontSize: '12px', 
            color: '#666',
            borderTop: '1px solid #eee',
            paddingTop: '15px'
          }}>
            <p>Please select your correct designation. You will only be able to login if your registered role matches the selected designation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;