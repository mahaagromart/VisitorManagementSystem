// [file name]: src/services/notificationService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const notificationService = {
  // Save FCM token to backend
  saveFCMToken: async (token, userToken) => {
    try {
      const response = await axios.post(
        `${API_URL}fcm/token`,
        { token },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error saving FCM token:", error);
      throw error;
    }
  },

  // Remove FCM token on logout
  removeFCMToken: async (userToken) => {
    try {
      const response = await axios.delete(`${API_URL}fcm/token`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing FCM token:", error);
      throw error;
    }
  },

  // Check FCM token status
  checkFCMTokenStatus: async (userToken) => {
    try {
      const response = await axios.get(`${API_URL}fcm/token/status`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error checking FCM token status:", error);
      throw error;
    }
  },
};