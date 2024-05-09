import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import base64 from "base-64";
import axios from "../api/axios";
import Switch from '@mui/material/Switch';
import React from "react";
import TextAni from "./TextAni";
import { BrowserView,MobileView} from "react-device-detect";


const LOGIN_URL = "/login";
const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const userReff = useRef();
  const errRef = useRef();
  const [id, setUser] = useState("");  //학번/교번 state
  const [password, setPwd] = useState(""); // 비밀번호 state
  const [errMsg, setErrMsg] = useState(""); // 에러메세지 state

  useEffect(() => {
    userReff.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [id, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ID 유효성 검사  추가하기
   
    // Password 유효성 검사 추가하기
    
    try {
      const response = await axios.post(   // spring 서버의 /login url로  id,password state를 담아 post요청 
        LOGIN_URL,
        JSON.stringify({ id, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials:true
          
        }
      );
      const accessToken = response?.data?.Access_Token; //성공시 전달받은 AccessToken을 변수에 저장
     
      let payload = accessToken.substring(  //AccessToken의 payload를 추출하기위한 코드
        accessToken.indexOf(".") + 1,
        accessToken.lastIndexOf(".")
      );   
      let dec = base64.decode(payload); //토큰의 payload를 base64로 디코딩 
     
      
    
      const obj = JSON.parse(dec);
      const role = obj.role;  // role를 빼와서 변수에 저장
     
      
      //console.log("After setAuth:", { id, password, role, accessToken });
      setAuth({ id, password, role, accessToken }); //auth state에 id,비밀번호,역할,AccessToken 저장
      console.log("setAuth:", { id, role, accessToken });
     
      setUser(""); // auth에 담고나서 id  state 초기화
      setPwd(""); //비밀번호 state 초기화
      
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }

    } catch (err) {  // 에러 캐치하는 부분
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist(prev => !prev); 
}

useEffect(() => {
  localStorage.setItem("persist", persist); //persist state 상태변화시 로컬스토리지에 persist 추가
}, [persist])



  return (  //데스크탑 - 모바일 UI 구분필요

  <React.Fragment>
<BrowserView>
  <React.Fragment>
  <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
  <div className='w-full h-full grid md:grid-cols-10'> {/* md:grid-cols-10으로 수정 */}
<div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6'> {/* col-span-6으로 수정 */}


<TextAni/>

</div>

<div className=" flex flex-col justify-center items-center bg-right-main col-span-4 w-90"> {/* col-span-4으로 수정 */}
<p 
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"} //에러메세지 존재할시 렌더링 아니면 가리기
        aria-live="assertive"
      >
        {errMsg}
      </p>
<h2 className='text-4xl p-6 font-gmarket'>LUMOS</h2>

<form onSubmit={handleSubmit}>
{/* {placeholder 마진 + 아이콘 추가 로그인버튼 텍스트변경 왼쪽 그림 컷 텍스트만하는걸로  대체 } */}
<div>
  <div class="mt-2">
    <input id="username"  type="text"  placeholder='학번/교번' 
    ref={userReff}
    onChange={(e) => setUser(e.target.value)}
    value={id}
    required class="block w-full sm:w-80  rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset pl-3
     ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
  </div>
</div>

<div>
  <div className="flex items-center justify-between">
  </div>
  <div className="mt-2 ">
    <input id="password" name="password" type="password" autocomplete="current-password" 
    onChange={(e)=>setPwd(e.target.value)}
    value={password}
    placeholder='비밀번호' 

    required class="block w-full sm:w-80 rounded-md border-0 py-3 pl-3
     text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
     focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "></input>
  </div>
</div>
<div className='mb-4 mt-4'>

  <Switch
  checked={persist}
  onChange={togglePersist}
   
    inputProps={{ 'aria-label': '로그인 유지' }} 
    sx={{
      '& .MuiSwitch-thumb': {
        backgroundColor: '#FFFFFF', 
      },
      '& .MuiSwitch-track': {
        backgroundColor: '#2B2B2B', 
      },
    }}
  />
  <label className= " font-gmarket"htmlFor="persist" >로그인 유지</label>
</div>

<div className='items-center flex justify-center mb-6'>
  <button type="submit" class="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">로그인</button>
</div>
</form>

<div className='flex justify-start '>
<Link to="/findid" className="mr-20 font-gmarket">학번/교번찾기</Link>
<Link to="/findpassword" className="font-gmarket" >비밀번호찾기</Link>

</div>

</div>
</div>
  
  </section>
</React.Fragment>

</BrowserView>


<MobileView>
  <div className="flex flex-col justify-center items-center h-screen">
    <p 
      ref={errRef}
      className={errMsg ? "errmsg" : "offscreen"}
      aria-live="assertive"
    >
      {errMsg}
    </p>
    <h2 className='text-4xl p-6 font-gmarket'>LUMOS</h2>
    <form onSubmit={handleSubmit} className="items-center">
      <div className="mt-2">
        <input 
          id="username"  
          type="text"  
          placeholder='학번/교번' 
          ref={userReff}
          onChange={(e) => setUser(e.target.value)}
          value={id}
          required 
          className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset pl-3 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="mt-2">
        <input 
          id="password" 
          name="password" 
          type="password" 
          autoComplete="current-password" 
          onChange={(e)=>setPwd(e.target.value)}
          value={password}
          placeholder='비밀번호' 
          required 
          className="block w-full sm:w-80 rounded-md border-0 py-3 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
        />
      </div>
      <div className='mb-4 mt-4'>
        <Switch
          checked={persist}
          onChange={togglePersist}
          inputProps={{ 'aria-label': '로그인 유지' }} 
          sx={{
            '& .MuiSwitch-thumb': {
              backgroundColor: '#FFFFFF', 
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#2B2B2B', 
            },
          }}
        />
        <label className="font-gmarket" htmlFor="persist" >로그인 유지</label>
      </div>
      <div className='items-center flex justify-center mb-6'>
        <button type="submit" className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">로그인</button>
      </div>
    </form>
    <div className='flex justify-start '>
      <Link to="/findid" className="mr-20 font-gmarket">학번/교번찾기</Link>
      <Link to="/findpassword" className="font-gmarket" >비밀번호찾기</Link>
    </div>
  </div>
</MobileView>




    
    </React.Fragment>
  );
};
export default Login;


