self.addEventListener('notificationclick', event => {
  event.notification.close();
  const slug = event.notification.data?.slug;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CHECKIN', slug });
          return client.focus();
        }
      }
      return clients.openWindow(slug ? `/explore?checkin=${slug}` : '/explore');
    })
  );
});
