/* eslint-disable no-restricted-globals */

import { clientsClaim } from 'workbox-core';

clientsClaim();

// 네트워크 우선으로 모든 요청 처리 (캐싱 없이)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// 서비스 워커 활성화 시 기존 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// 모든 탭을 닫지 않더라도 업데이트된 서비스 워커가 즉시 활성화되도록 설정
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});