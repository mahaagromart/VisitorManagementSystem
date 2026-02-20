// [file name]: public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDdi4phNMKxOA981oRQ7cqRz3UiuwaKb24",
  authDomain: "visitormanagementsystemmaidc.firebaseapp.com",
  projectId: "visitormanagementsystemmaidc",
  storageBucket: "visitormanagementsystemmaidc.firebasestorage.app",
  messagingSenderId: "108906789419",
  appId: "1:108906789419:web:e2877d65e2519df800086e",
  measurementId: "G-ZDY64Y7H3N"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/logo192.png", // Update with your app's icon
    badge: "/logo192.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  // Open or focus your app
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow("/");
    })
  );
});