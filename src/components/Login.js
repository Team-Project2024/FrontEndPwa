import { useRef, useState, useEffect, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import base64 from "base-64";
import axios from "../api/axios";
import Switch from '@mui/material/Switch';
import React from "react";
import TextAni from "./TextAni";
import { BrowserView, MobileView } from "react-device-detect";
import AuthContext from "../context/AuthProvider";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import useLogout from "../hooks/useLogout";
import Button from '@mui/material/Button';

const LOGIN_URL = "/login";

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const userReff = useRef();
  const [id, setUser] = useState("");  //학번/교번 state
  const [password, setPwd] = useState(""); // 비밀번호 state
  const [errMsg, setErrMsg] = useState(""); // 에러메세지 state
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const { auth } = useContext(AuthContext);


  useEffect(() => {

    sessionStorage.clear();

    setAuth(null);
  }, [setAuth]);


  useEffect(() => {
    userReff.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [id, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ID 유효성 검사 추가하기
    // Password 유효성 검사 추가하기

    try {
      const response = await axios.post(   // spring 서버의 /login url로 id, password state를 담아 post 요청
        LOGIN_URL,
        JSON.stringify({ id, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      const accessToken = response?.data?.Access_Token; // 성공시 전달받은 AccessToken을 변수에 저장

      let payload = accessToken.substring(  // AccessToken의 payload를 추출하기위한 코드
        accessToken.indexOf(".") + 1,
        accessToken.lastIndexOf(".")
      );
      let dec = base64.decode(payload); // 토큰의 payload를 base64로 디코딩

      const obj = JSON.parse(dec);
      const role = obj.role;  // role를 빼와서 변수에 저장

      setAuth({ id, password, role, accessToken }); // auth state에 id, 비밀번호, 역할, AccessToken 저장
      console.log("setAuth:", { id, role, accessToken });

      setUser(""); // auth에 담고나서 id state 초기화
      setPwd(""); // 비밀번호 state 초기화
      togglePersist();

      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }

    } catch (err) {  // 에러 캐치하는 부분
      if (!err?.response) {
        setErrMsg("서버 응답 없음");
      } else if (err.response?.status === 400) {
        setErrMsg("학번이나 비밀번호가 일치하지 않습니다.");
      } else if (err.response?.status === 401) {
        setErrMsg("등록된 회원이 아닙니다");
      } else {
        setErrMsg("로그인 실패");
      }
      setOpen(true); //모달창 열기
    }
  };

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem("persist", persist); // persist state 상태변화시 로컬스토리지에 persist 추가
  }, [persist]);

  const handleClose = () => {
    setOpen(false);
  }

  return (

    <React.Fragment>
      <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
        <div className='w-full h-full grid md:grid-cols-10'>
          <div className='bg-left-main  md:h-screen flex flex-col justify-center items-center  p-6 col-span-6 hidden md:flex'> {/* Hidden on small screens */}
            <TextAni />
          </div>
          <div className="flex flex-col justify-center md:shadow-[-4px_0px_15px_0px_rgba(0,0,0,0.3)] items-center bg-right-main col-span-10 md:col-span-4 w-full md:w-90"> {/* Full width on small screens */}
            <h2 className='text-4xl p-6 font-gmarket mb-3 font-bold'>LUMOS</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <div className="mt-2">
                  <input id="username" type="text" placeholder='학번/교번'
                    ref={userReff}
                    onChange={(e) => setUser(e.target.value)}
                    value={id}
                    required className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset pl-3
                     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between"></div>
                <div className="mt-2 mb-8">
                  <input id="password" name="password" type="password" autoComplete="current-password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={password}
                    placeholder='비밀번호'
                    required className="block w-full sm:w-80 rounded-md border-0 py-3 pl-3
                     text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                     focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "></input>
                </div>
              </div>

              <div className='items-center flex justify-center mb-4'>
                <button type="submit" className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  로그인</button>
              </div>
            </form>
            <div className='flex justify-between'>
              <Link to="/findid" className="sm:mr-16 mr-8 font-gmarket text-sm sm:text-sm hover:text-gray-500">학번/교번찾기</Link>
              <h2 className="sm:mr-16 mr-8 text-gray-500 font-gmarket text-sm sm:text-sm">|</h2>
              <Link to="/findpassword" className="font-gmarket text-sm sm:text-sm hover:text-gray-500">비밀번호찾기</Link>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>로그인 실패</DialogTitle>
        <DialogContent>
          {errMsg}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default Login;
