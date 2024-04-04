import axios from '../api/axios';
import useAuth from './useAuth';
import base64 from "base-64";
const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => { 
        const response = await axios.post('/reissue',null, { //post 요청을 null값으로 빈데이터를 넣고 쿠키만 보냄
            withCredentials: true //post 요청시 쿠키를 같이 보내기위한 설정
        });
        setAuth(prev => {
           //성공시 새로운 RefreshToken(쿠키에저장)과 AccessToken 수신
            console.log(response.data.Access_Token);
            const accessToken = response?.data?.Access_Token;
            console.log(JSON.stringify(prev));
           
            let payload = accessToken.substring(
             accessToken.indexOf(".") + 1,
                 accessToken.lastIndexOf(".")
               );
               let dec = base64.decode(payload);
               console.log(dec);
              
            
               const obj = JSON.parse(dec);
               console.log(obj)
               const roles = obj.role;
               const Refreshid = obj.username;
            return { ...prev,
                 id:Refreshid,
                 role:roles,
                 accessToken: response.data.Access_Token } //auth state에 새로 발급받은 토큰,권한으로 덮어쓰기
        });
        return response.data.Access_Token;
    }
    return refresh;
};

export default useRefreshToken;
