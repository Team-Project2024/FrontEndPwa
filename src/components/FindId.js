import { useState,useRef,useEffect } from "react"
import axios from '../api/axios';
import { Link } from "react-router-dom"



const FINDID_URL = '/find-id';

const FindId = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [errMsg, setErrMsg] = useState(""); 
    const [userId,setUserId] = useState("");
    const [toggle,setToggle] = useState(false);
    const userReff = useRef();
    const errRef = useRef();



    useEffect(() => {
        userReff.current.focus();
      }, []);
      useEffect(() => {
        setErrMsg("");
      }, [email, name]);

    const handleFindId = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(FINDID_URL,
                JSON.stringify({ email, name }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (response.status === 200) {
               
                console.log(JSON.stringify(response?.data));
                setUserId(response?.data);
                setToggle(!toggle)
            } else {
                
                setErrMsg('요청이 실패했습니다.');
                errRef.current.focus();
            }
           


        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('실패');
            } else if (err.response?.status ===405) {
                setErrMsg('클라이언트->서버 권한 없음')
            }
    
            errRef.current.focus();
        }
    }

    return (
        <section>
            <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
        {errMsg}
      </p>
            <h1>학번/교번 찾기</h1>
            <form onSubmit={handleFindId}>
                <label htmlFor="email">이메일:</label>
                <input
                    type="text"
                    id="email"
                    ref={userReff}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />

                <label htmlFor="name">이름:</label>
                <input
                    type="text" // type을 text로 수정
                    id="name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                />
                <button type="submit">찾기</button> {/* type="submit" 추가 */}
            </form>
        
            {toggle && <h2>찾으시는 학번/교번{userId}</h2>}
           
            <p>
               <br />
                <span className="line">
                    <Link to="/">로그인창으로돌아가기</Link>
                </span>
            </p>
        </section>
    )
}

export default FindId
