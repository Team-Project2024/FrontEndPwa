import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import base64 from "base-64";
import axios from "../api/axios";
import Switch from '@mui/material/Switch';


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
      navigate(from, { replace: true }); //성공시 home으로 이동
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



  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"} //에러메세지 존재할시 렌더링 아니면 가리기
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">학번/교번:</label>
        <input
          type="text"
          id="username"
          ref={userReff}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={id}
          required
        />
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={password}
          required
        />
        <button>로그인</button>
        <div>
      <Switch
        checked={persist}
        onChange={togglePersist}
        inputProps={{ 'aria-label': '로그인 유지' }} 
        sx={{
          '& .MuiSwitch-thumb': {
            backgroundColor: '#4CAF50', 
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#A5D6A7', 
          },
        }}
      />
      <label htmlFor="persist">로그인 유지</label>
    </div>
      </form>
    

        <div> 

         <button>
          <Link to="/findid" style={{ color: 'black', textDecoration: 'none' }}>학번/교번찾기</Link>
        </button>
     
        
       <button>
        <Link to="/findpassword"style={{ color: 'black', textDecoration: 'none' }}>비밀번호찾기</Link>
       </button>
      </div>
      
     
    </section>
  );
};
export default Login;