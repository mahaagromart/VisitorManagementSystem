import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from './pages/Login/LoginForm';
import AppLayout from './components/AppLayout';
import { login } from './redux/Features/AuthSlice';
// import { Navigate } from 'react-router-dom';
function App() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("UserId");
    const storedEmail = localStorage.getItem("email");

    if (storedToken && storedUserId && !token) {
      dispatch(login({
        user: storedUser,
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