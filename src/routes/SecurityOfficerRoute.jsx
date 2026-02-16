import React from 'react'
import { Route, Routes } from 'react-router-dom';
import SecurityOfficerHome from '../pages/SecurityOfficer/SecurityOfficerHome';
import ProtectedRoutes from "../components/ProtectedRoutes";

const SecurityOfficerRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoutes><SecurityOfficerHome/></ProtectedRoutes>} />
      <Route path="*" element={<ProtectedRoutes><SecurityOfficerHome/></ProtectedRoutes>} />
    </Routes>
  )
}

export default SecurityOfficerRoute