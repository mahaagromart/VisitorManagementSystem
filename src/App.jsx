// [file name]: src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from './pages/Login/LoginForm';
import AppLayout from './components/AppLayout';
import { login } from './redux/Features/AuthSlice';
// Import the FCM hook
import { useFCM } from './hooks/useFCM';
// import { Navigate } from 'react-router-dom';

function App() {
  const { token, role, isLogged } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // Initialize FCM for management officers and admins when user is logged in
  useFCM();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("UserId");
    const storedEmail = localStorage.getItem("email");

    if (storedToken && storedUserId && !token) {
      // Parse storedUser if it's a string
      const userData = storedUser ? JSON.parse(storedUser) : null;
      
      dispatch(login({
        user: userData || { username: storedUser }, // Handle both cases
        token: storedToken,
        role: storedRole,
        email: storedEmail,
        UserId: storedUserId,
      }));
    }
  }, [dispatch, token]);

  const storedToken = token || localStorage.getItem("token");

  if (location.pathname === "/login") {
    return <LoginForm />;
  }

  if (!storedToken) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout />;
}

export default App;