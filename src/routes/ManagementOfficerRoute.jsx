import React from 'react'
import { Route, Routes } from 'react-router-dom';
import ManagementOfficerHome from '../pages/ManagementOfficer/MahagementOfficerHome';
import ProtectedRoutes from "../components/ProtectedRoutes";

const ManagementOfficerRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoutes><ManagementOfficerHome/></ProtectedRoutes>} />
      <Route path="*" element={<ProtectedRoutes><ManagementOfficerHome/></ProtectedRoutes>} />
    </Routes>
  )
}

export default ManagementOfficerRoute