// [file name]: src/hooks/useFCM.js
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { requestNotificationPermission, getFCMToken, onMessageListener } from "../firebase";
import { notificationService } from "../services/notificationService";
import { message } from "antd";

export const useFCM = () => {
  const { token: userToken, role, isLogged, user } = useSelector((state) => state.auth);
  const tokenSavedRef = useRef(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    const initializeFCM = async () => {
      // Only initialize for MANAGEMENTOFFICER and ADMIN when logged in
      if (!isLogged || !userToken) {
        tokenSavedRef.current = false;
        return;
      }

      // Check if user has appropriate role
      if (!(role === "MANAGEMENTOFFICER" || role === "ADMIN")) {
        console.log("User role not eligible for notifications:", role);
        return;
      }

      try {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
          console.log("This browser does not support notifications");
          return;
        }

        // Check current permission status
        if (Notification.permission === "denied") {
          console.log("Notification permission denied");
          return;
        }

        // Request permission if not already granted
        if (Notification.permission !== "granted") {
          const hasPermission = await requestNotificationPermission();
          if (!hasPermission) return;
        }

        setNotificationPermission(true);

        // Get FCM token
        const fcmToken = await getFCMToken();
        if (!fcmToken) {
          console.log("No FCM token received");
          return;
        }

        // Check if token is already saved in this session
        if (tokenSavedRef.current) {
          console.log("FCM token already saved in this session");
          return;
        }

        // Check if token is already saved in backend (optional)
        try {
          const status = await notificationService.checkFCMTokenStatus(userToken);
          if (status.data?.hasToken) {
            console.log("FCM token already exists in backend");
            tokenSavedRef.current = true;
            return;
          }
        } catch (error) {
          console.log("Error checking token status, will try to save new token");
        }

        // Save token to backend
        await notificationService.saveFCMToken(fcmToken, userToken);
        tokenSavedRef.current = true;
        console.log("FCM token saved successfully for user:", user?.username || role);

        // Listen for foreground messages
        const unsubscribe = onMessageListener()
          .then((payload) => {
            console.log("Received foreground message:", payload);
            
            // Show notification in UI using Ant Design message (without JSX)
            if (payload.notification) {
              // Create a simple string notification instead of JSX
              const notificationText = `${payload.notification.title}\n${payload.notification.body}`;
              
              message.info({
                content: notificationText,
                duration: 5,
                style: {
                  marginTop: '60px',
                  whiteSpace: 'pre-line', // This will handle the newline
                },
              });

              // Also show browser notification if supported
              if (Notification.permission === "granted") {
                new Notification(payload.notification.title, {
                  body: payload.notification.body,
                  icon: "/logo192.png",
                });
              }
            }
          })
          .catch((err) => console.log("Failed to receive foreground message:", err));

        return () => {
          // Cleanup if needed
          if (unsubscribe) unsubscribe();
        };

      } catch (error) {
        console.error("FCM initialization error:", error);
        tokenSavedRef.current = false;
      }
    };

    initializeFCM();
  }, [isLogged, role, userToken, user]);

  // Function to manually retry FCM setup
  const retryFCMSetup = async () => {
    tokenSavedRef.current = false;
    if (isLogged && (role === "MANAGEMENTOFFICER" || role === "ADMIN")) {
      try {
        const fcmToken = await getFCMToken();
        if (fcmToken && userToken) {
          await notificationService.saveFCMToken(fcmToken, userToken);
          tokenSavedRef.current = true;
          message.success("Notification setup successful!");
        }
      } catch (error) {
        console.error("Retry failed:", error);
        message.error("Failed to setup notifications");
      }
    }
  };

  return {
    notificationPermission,
    retryFCMSetup,
    isNotificationSupported: "Notification" in window,
  };
};