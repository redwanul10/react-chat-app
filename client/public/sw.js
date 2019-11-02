console.log("Service Worker Loaded...");

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  //self.skipWaiting();
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log(e.data)
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: data.body,
    icon:"/notification.png"
  });
});

self.addEventListener('activate', (event) => {
    
    event.waitUntil(clients.claim());
    // This will be called only once when the service worker is activated.
    console.log('service worker activate')
})

self.addEventListener('notificationclick', function(event) {
  
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://react-chat-appp-herokuapp.com')
  );
});
