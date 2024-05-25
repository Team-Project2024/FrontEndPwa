import axios from "../api/axios";
import useAuth from "./useAuth";
import cookie from "react-cookies";
import { useCookies } from "react-cookie";


const useLogout = () => {
    const {setAuth} = useAuth();
    const [cookies,setCookie,removeCookie] = useCookies(['Refresh_Token']);

    const logout = async () => {
        setAuth({}); //auth state를 모두 비움
        
        try {
            const response = await axios.post('/logout',null, {
                withCredentials: true
            });
            removeCookie('Refresh_Token'); //저장된 쿠키중 RefreshToken 삭제
             window.location.reload(); //삭제 적용을 위해 페이지 강제 새로고침
           
        }catch (err) {
            console.error(err);
        }
    }


    return logout;
}

export default useLogout