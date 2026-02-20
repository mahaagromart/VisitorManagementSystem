// [file name]: src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDdi4phNMKxOA981oRQ7cqRz3UiuwaKb24",
  authDomain: "visitormanagementsystemmaidc.firebaseapp.com",
  projectId: "visitormanagementsystemmaidc",
  storageBucket: "visitormanagementsystemmaidc.firebasestorage.app",
  messagingSenderId: "108906789419",
  appId: "1:108906789419:web:e2877d65e2519df800086e",
  measurementId: "G-ZDY64Y7H3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// VAPID key for web push notifications
const VAPID_KEY = "BPjR7fWc-yoEF6R2gWNmRs5VR7Vno56TLALsS317YU38FA6c52UbP7494H86lcD3PJcqxZcNrLtQnbnckWFxThA"; // Get this from Firebase Console > Project Settings > Cloud Messaging

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted");
      return true;
    } else {
      console.log("Notification permission denied");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};

export const getFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log("No registration token available");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Received foreground message:", payload);
      resolve(payload);
    });
  });

export { messaging };