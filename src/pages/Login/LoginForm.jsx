import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Eye, EyeOff, User, Shield } from "lucide-react";
import "./LoginForm.css";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

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
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    console.log("Login Data:", values);
    
    // Simulate API call
    setTimeout(() => {
      alert(`Login attempted as ${values.Designation}\nEmail: ${values.EmailId}`);
      setSubmitting(false);
      resetForm();
    }, 1500);
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

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched, setFieldValue, values }) => (
              <Form autoComplete="off">
                {/* Designation Label */}
                <div className="designation-label">SELECT DESIGNATION</div>
                
                {/* Designation Selection Field */}
                <div className="form-group">
                  <div className="designation-options">
                    {/* Managing Officer Card */}
                    <button
                      type="button"
                      className={`designation-card ${values.Designation === 'Managing Officer' ? 'selected' : ''}`}
                      onClick={() => setFieldValue('Designation', 'Managing Officer')}
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
                  <label htmlFor="EmailId">EMAIL ADDRESS</label>
                  <Field
                    type="email"
                    name="EmailId"
                    id="EmailId"
                    placeholder="Enter your email address"
                    className={`form-input ${errors.EmailId && touched.EmailId ? 'error' : ''}`}
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="EmailId"
                    component="div"
                    className="error-message"
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label htmlFor="Password">PASSWORD</label>
                  <div className="password-field">
                    <div className="password-input-wrapper">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="Password"
                        id="Password"
                        placeholder="Enter your password"
                        className={`form-input ${errors.Password && touched.Password ? 'error' : ''}`}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="password-toggle"
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? (
                    <span className="spinner"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;