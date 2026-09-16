self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) { data = { body: event.data ? event.data.text() : '' }; }
  const title = data.title || 'Novo Amanhecer';
  const options = {
    body: data.body || 'Seu momento de oração está chegando.',
    icon: './icon-192.png',
    badge: './icon-192.png',
    tag: data.tag || 'novo-amanhecer',
    data: { url: data.url || './' },
    vibrate: [100,50,100]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data?.url || './';
  event.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(list=>{
    for(const client of list){ if('focus' in client){ client.navigate(target); return client.focus(); } }
    return clients.openWindow(target);
  }));
});
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    event.waitUntil(self.registration.showNotification(event.data.title || 'Novo Amanhecer', { body: event.data.body || '' }));
  }
});
