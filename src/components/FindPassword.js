import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const FINDPASSWORD_URL = '/find-pw';
const VERIFYCODEURL = '/code-verification'
const CHANGEPASSWORD_URL = '/change-password'

function FindPassword() {
    const [step,setStep]= useState(1);
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [password, setNewPassword] = useState("");
    const [checkPw, setcheckPw] = useState("");
    const [code, setVerifyCode] = useState("");

    const userRef = useRef();
    const errRef = useRef();


    //정규표현식 추가하기
  

    const handleFindPassword = async (e) => {
        e.preventDefault();
        
        const idRegex = /^\d{6}$|^\d{8}$/;

        if(!idRegex.test(id)) {
            setErrMsg('입력을 확인해주세요');
            errRef.current.focus();
            return;
        }
        

        try {
            const response = await axios.post(FINDPASSWORD_URL,
                JSON.stringify({ id, email, name }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            if (response.status === 200) {
                // 서버응답 성공
                setStep(2);
                renderStep2();
                console.log(id,email,name)
            } else {
                // 응답실패
                setErrMsg('요청이 실패했습니다.');
                errRef.current.focus();
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('실패');
            }
            errRef.current.focus();
           
            console.log(id,email,name)
        }
    }

    const VerifyCation = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post(VERIFYCODEURL,
                JSON.stringify({id,code}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
                );
                if (response.status === 200) {
                  
                    setStep(3);
                    renderStep3();
                } else {
                   
                    setErrMsg('요청이 실패했습니다.');
                    errRef.current.focus();
                }

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('실패');
                console.log({id,code})
            }
            errRef.current.focus();
          
        }

    }

    const ChangePassword = async (e) => {
        e.preventDefault();
       


        try{
            const response = await axios.post(CHANGEPASSWORD_URL,
                JSON.stringify({id,password,checkPw}),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
                );
                if (response.status === 200) {
                   
                    setStep(4);
                    renderStep4();
                } else {
                  
                    setErrMsg('요청이 실패했습니다.');
                    errRef.current.focus();
                }
         
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('실패');
            }
            errRef.current.focus();
            
        }

    }


    

    const renderStep1 = () => {
        return (
            <div>
                 <form onSubmit={handleFindPassword}>
                    <label htmlFor="id">학번/교번:</label>
                    <input
                        type="text"
                        id="id"
                        ref={userRef}
                        autoComplete="off"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="name">이름:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit">이메일 코드 요청</button>
                    <p>
               <br />
                <span className="line">
                    <Link to="/">로그인창으로돌아가기</Link>
                </span>
            </p>
                </form>
            </div>
        )
    }

    const renderStep2 = () => {
        return (
            <div>
            <input
                type="text"
                id="verifycode"
                placeholder='인증코드입력'
                value={code}
                onChange={(e) => setVerifyCode(e.target.value)}
                required
            />
            <button type="submit" onClick={VerifyCation}>코드 인증</button>
            <button>코드 재전송</button>
            <p>
               <br />
                <span className="line">
                    <Link to="/">로그인창으로돌아가기</Link>
                </span>
            </p>
        </div>
        )
    }

    const renderStep3 =() => {
        return (
            <div>
                <input
                type='text'
                id='password'
                placeholder='비밀번호 입력'
                value={password}
                onChange={(e) => setNewPassword(e.target.value)}
                required
               />

            <input
                type='text'
                id='checkPw'
                placeholder='비밀번호 확인'
                value={checkPw}
                onChange={(e) => setcheckPw(e.target.value)}
                required
               />

               <button type='submit' onClick={ChangePassword}>비밀번호 변경 </button>
               <p>
               <br />
                <span className="line">
                    <Link to="/">로그인창으로돌아가기</Link>
                </span>
            </p>
            </div>
        )
    }

    const renderStep4 = () => {
        return (

            <div>
                <h2>비밀변호 변경이 완료되었습니다!</h2>
                <p>
               <br />
                <span className="line">
                    <Link to="/">로그인창으로돌아가기</Link>
                </span>
            </p>

            </div>


        )
           

        
    }

  

   

   
    
    return (

        <section>
             <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>비밀번호</h1>
             <div>
         {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            </div>
        </section>
       




            /* <h1>인증번호 유효 시간: <span style={{ color: 'red' }}>{formatTime(remainingTime)}</span></h1>
            <section>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>비밀번호</h1>
                <form onSubmit={handleFindPassword}>
                    <label htmlFor="id">학번/교번:</label>
                    <input
                        type="text"
                        id="id"
                        ref={userRef}
                        autoComplete="off"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <label htmlFor="email">이메일:</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="name">이름:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <button type="submit">이메일 코드 요청</button>
                </form>
                <div>
                    <input
                        type="text"
                        id="verifycode"
                        value={verifycode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        required
                    />
                    <button type="submit" onClick={VerifyCation}>코드 인증</button>
                </div>
                <p><br /><Link to="/">로그인 창으로 돌아가기</Link></p>
            </section>
            <button onClick={handleResendClick} style={{
                padding: '10px 15px',
                fontSize: '16px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
            }}>재전송</button> */
       
    );
}

export default FindPassword;
