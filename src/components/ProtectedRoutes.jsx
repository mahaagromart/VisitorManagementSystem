// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { login, logout } from "../redux/Features/AuthSlice";
// import { useNavigate } from "react-router-dom";

// const ProtectedRoutes = ({ children }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { user, role, token, isLogged, UserId } = useSelector((state) => state.auth);

//   useEffect(() => {
//     // Check localStorage and populate Redux if needed
//     const checkAndPopulateFromStorage = () => {
//       const storedToken = localStorage.getItem("token");
//       const storedUser = localStorage.getItem("user");
//       const storedRole = localStorage.getItem("role");
//       const storedUserId = localStorage.getItem("UserId");
//       const storedEmail = localStorage.getItem("email");

//       // If we have token and userId in localStorage
//       if (storedToken && storedUserId) {
//         // Check if Redux state is empty or mismatched
//         const isReduxEmpty = !user || !role || !token || !isLogged;
//         const isReduxMismatched = 
//           (token && token !== storedToken) || 
//           (UserId && UserId !== storedUserId);

//         if (isReduxEmpty || isReduxMismatched) {
//           console.log("Populating Redux from localStorage");
//           dispatch(login({
//             user: storedUser || "",
//             token: storedToken,
//             role: storedRole || "",
//             email: storedEmail || "",
//             UserId: storedUserId
//           }));
//         }
        
//         // User is authenticated, stay on current page
//         return true;
//       } else {
//         // No valid localStorage data, redirect to login
//         console.log("No valid localStorage data, redirecting to login");
//         dispatch(logout());
//         navigate("/login");
//         return false;
//       }
//     };

//     checkAndPopulateFromStorage();
//   }, [dispatch, navigate, user, role, token, isLogged, UserId]);

//   // Get current auth state
//   const currentToken = token || localStorage.getItem("token");
//   const currentUserId = UserId || localStorage.getItem("UserId");
//   const isUserLoggedIn = isLogged || (currentToken && currentUserId);

//   return isUserLoggedIn ? children : null;
// };

// export default ProtectedRoutes;

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoutes;