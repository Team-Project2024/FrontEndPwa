
import React, { useEffect,useState } from 'react';

import Login from './components/Login';
import Chat from './components/Chat';
import Layout from './components/Layout';
import Admin from './components/Admin';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import RequireAuth from './components/RequireAuth';
import FindId from './components/FindId';
import FindPassword from './components/FindPassword';
import useAuth from "./hooks/useAuth";

import PersistLogin from './components/PersistLogin';

import DetailPage from './components/Detail';
import Map from './components/map';
import useRefreshToken from './hooks/useRefreshToken';





import { Routes, Route } from 'react-router-dom';







//IgnoreResizeObserverError 방지
const IgnoreResizeObserverError = () => {
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string' && args[0].includes('ResizeObserver')) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
};



 
function App() {
  const { auth } = useAuth(); // useAuth 훅을 사용하여 현재 사용자 정보 가져오기
  const refresh = useRefreshToken(); // 토큰갱신훅 호출
  const [lastRefresh, setLastRefresh] = useState(Date.now());


  //일정시간마다 자동으로 토큰갱신
  useEffect(() => {
    
    const intervalId = setInterval(async () => {
      await refresh();
    }, 3 * 60 * 1000); // 3분
      console.log('refresh');
      
   
    return () => clearInterval(intervalId);
  }, [refresh]); 


 // 새로고침 연타 방지
  useEffect(() => {
    
    const handleBeforeUnload = (e) => {
      const now = Date.now();
      const timeSinceLastRefresh = now - lastRefresh;
  
      if (timeSinceLastRefresh < 5000) { // 5초 이내에 새로고침 시도시
        e.preventDefault();
        e.returnValue = ''; 
      } else {
        setLastRefresh(now);
      }
    };
  
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [lastRefresh]);
  



  return (
    <>
    <IgnoreResizeObserverError />
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 로그인되지 않아도 접근 가능 */}
        <Route path="login" element={<Login />} />
        <Route path="findid" element={<FindId />} />
        <Route path="findpassword" element={<FindPassword />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="map" element={<Map />} />
       

        {/* 로그인 완료, 권한이 있어야 접근 가능 */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN', 'ROLE_PROFESSOR']} auth={auth} />}>
            <Route path="/" element={<Chat />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['ROLE_PROFESSOR', 'ROLE_STUDENT', 'ROLE_ADMIN']} auth={auth} />}>
            <Route path="chat" element={<Chat />} />
            <Route path='/detail/:itemType/:itemId' element={<DetailPage />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['ROLE_ADMIN']} auth={auth} />}>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  </>
  );
}

export default App;