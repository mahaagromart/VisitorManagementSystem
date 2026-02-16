import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './pages/Login/LoginForm';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;