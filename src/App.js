
import React, { useEffect } from 'react';

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



import { Routes, Route } from 'react-router-dom';



const IgnoreResizeObserverError = () => {
  useEffect(() => {
    const originalError = console.error;

    console.error = (msg, ...args) => {
      if (
        typeof msg === 'string' &&
        msg.includes('ResizeObserver loop completed with undelivered notifications')
      ) {
        return;
      }
      originalError(msg, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
};



 
function App() {
  const { auth } = useAuth(); // useAuth 훅을 사용하여 현재 사용자 정보 가져오기



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