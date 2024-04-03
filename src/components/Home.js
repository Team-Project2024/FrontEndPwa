import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { useContext,useState,useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";



const Home = () => {
    const { auth,setAuth } = useContext(AuthContext);
    
    const navigate = useNavigate();
    const refresh = useRefreshToken();
    const logout = useLogout();
   


    const signout = async () => {
       
        await logout();
        
        navigate('/login');
       
    }


    const showtoken  = async  () => {
        
        await refresh();
        console.log(auth)
       
    }

    return (
        <section>
            <h1>메인페이지</h1>
            <br />
            <p>로그인 성공</p>
            <br />

            <div className="userInfo">
            <p>학번/교번</p>
            {auth.id}
            
            <p>현재 역할</p>
            {auth.role}

            </div>
           
           
      
          
           
            <br />
            <Link to="/admin">관리자 페이지로 이동</Link>
            <Link to='/student'>학생 페이지로 이동</Link>
            <Link to='/professor'>교수 페이지로 이동</Link>
            <Link to='/chat'>챗봇으로 이동</Link>
            <br />
            
            <br />

            <button onClick={showtoken}>token test</button>
           
            <div className="flexGrow">
                <button onClick={signout}>Sign Out</button>
            </div>
        </section>
    )
}

export default Home


//새로고침 또는 껐다가 다시킬시 auth state의 id가 비어있음 accesccToken과 role만 존재 
