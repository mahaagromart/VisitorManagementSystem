// import { useEffect, useRef } from "react";
// import axios from "axios";
// import { useSelector, useDispatch } from "react-redux";
// import { login } from "../redux/Features/AuthSlice";
// import { useNavigate } from "react-router-dom";


// const ProtectedRoutes = ({ children }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   const { user, token, isLogged } = useSelector((state) => state.auth);
//   const storedToken = token || localStorage.getItem("token");
//   const UserId = localStorage.getItem("UserId");

//   const hasFetched = useRef(false);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!storedToken || !UserId) {
//         navigate("/login");
//         return;
//       }

//       dispatch(startLoading());

//       try {
//         const url = `${apiUrl}Authentication/GetUserProfile`;
//         const response = await axios.post(
//           `${url}?UserId=${UserId}`,
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${storedToken}`,
//             },
//           }
//         );


//         if (response.data && response.data.code === 200) {
//           const userProfile = response.data.userProfilesEntity?.$values?.[0];

//           if (!userProfile) {
//             navigate("/login");
//             return;
//           }

//           dispatch(
//             login({
//               user: `${userProfile.firstName} ${userProfile.lastName}`,
//               role: userProfile.designationName,
//               token: storedToken,
//               UserId: UserId,
//             })
//           );
//         } else {
//           console.warn("Invalid response or unauthorized access");
//           navigate("/login");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error.response?.data || error.message);
//         navigate("/login");
//       } finally {
//         dispatch(stopLoading());
//       }
//     };

//     if (!user && storedToken && UserId && !hasFetched.current) {
//       hasFetched.current = true;
//       fetchUser();
//     }
//   }, [storedToken, UserId, dispatch, navigate, user, apiUrl]);

//   return storedToken && UserId && isLogged ? children : null;
// };

// export default ProtectedRoutes;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ children }) => {
  const { isLogged } = useSelector((state) => state.auth);

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;