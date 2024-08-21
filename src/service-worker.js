/* eslint-disable no-restricted-globals */

// 서비스 워커가 모든 클라이언트를 제어하도록 설정
import { clientsClaim } from 'workbox-core';

clientsClaim();

// Precache와 관련된 모든 코드 제거
// 기존의 precacheAndRoute 등 캐싱 관련 기능 비활성화

// App Shell-style routing과 같은 기능도 사용하지 않도록 설정
// 만약 이를 사용하고 싶다면, 네트워크에서 항상 최신 데이터를 가져오도록 해야 합니다.

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

// 추가적인 커스텀 로직이 있다면 여기에 추가할 수 있습니다.