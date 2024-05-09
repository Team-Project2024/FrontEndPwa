import React, { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import MainLottie from '../image/Animation - 1712815297760.json'
import TextAnimation from './TextAnimation';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import TextAni from './TextAni';
import { BrowserView, MobileView } from 'react-device-detect';

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

          <React.Fragment>
            <BrowserView>
            
            <React.Fragment>
            <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
            <div className='w-full h-full grid md:grid-cols-10'> {/* md:grid-cols-10으로 수정 */}
        <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6'> {/* col-span-6으로 수정 */}
         
          <TextAni/>
        </div>
        
        <div className="md:h-screen flex flex-col justify-center items-center bg-right-main col-span-4 w-90"> {/* col-span-4으로 수정 */}
          <h2 className='text-4xl p-6 mb-6 font-gmarket' >비밀번호 찾기</h2>
          <form onSubmit={handleFindPassword}>
          <div>
            <div class="mt-2">
              <input id="id"  type="text"  placeholder='학번/교번' 
              ref={userRef}
              value={id}
              onChange={(e)=>setId(e.target.value)}
              required class="block w-full sm:w-80  rounded-md border-0 py-3 pl-3
               text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                 focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
            </div>
          </div>
      
          <div>
            <div className="flex items-center justify-between">
            </div>
            <div className="mt-2 ">
              <input id="email"  type="text"  placeholder='이메일' 
              ref={userRef}
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required class="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset pl-3
               ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                focus:ring-indigo-600 sm:text-sm sm:leading-6 "></input>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
            </div>
            <div className="mt-2 mb-5">
              <input id="name"  type="text"  placeholder='이름' 
              ref={userRef}
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required class="block w-full sm:w-80 rounded-md border-0 py-3 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "></input>
            </div>
          </div>
         
      
          <div className='items-center flex justify-center mb-6'>
            <button type="submit" class="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">코드요청</button>
          </div>
      
          <div className='flex  justify-center '>
          <Link to="/">로그인창으로돌아가기</Link>
         
           
      
          </div>
          </form>
         
        </div>
      </div>
            
            </section>
          </React.Fragment>
            </BrowserView>


          <MobileView>



            <h2>모바일임</h2>
          </MobileView>

          </React.Fragment>

        
        )
    }

    const renderStep2 = () => {
        return (
        //     <div>
        //     <input
        //         type="text"
        //         id="verifycode"
        //         placeholder='인증코드입력'
        //         value={code}
        //         onChange={(e) => setVerifyCode(e.target.value)}
        //         required
        //     />
        //     <button type="submit" onClick={VerifyCation}>코드 인증</button>
        //     <button>코드 재전송</button>
        //     <p>
        //        <br />
        //        <button><Link to="/"style={{ color: 'black', textDecoration: 'none' }}>로그인창으로돌아가기</Link></button>
        //     </p>
        // </div>
        <React.Fragment>
        <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
        <div className='w-full h-full grid md:grid-cols-10'> {/* md:grid-cols-10으로 수정 */}
    <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6'> {/* col-span-6으로 수정 */}
     
      <TextAni/>
    </div>
    
    <div className="md:h-screen flex flex-col justify-center items-center bg-right-main col-span-4 w-90"> {/* col-span-4으로 수정 */}
      <h2 className='text-4xl p-6 mb-6 font-gmarket' >비밀번호 찾기</h2>
      
      <div>
        <div class="mt-2">
          <input id="verifycode"  type="text"  placeholder='인증코드입력' 
          ref={userRef}
          value={code}
          onChange={(e)=>setVerifyCode(e.target.value)}
          required class="block w-full sm:w-80  rounded-md border-0 py-3
           text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset
             focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
        </div>
      </div>

      
  
     
  
      <div className='items-center flex justify-center mb-6'>
        <button onClick={VerifyCation} type="submit" class="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">코드요청</button>
      </div>
  
      <div className='flex justify-start '>
      <Link to="/">로그인창으로돌아가기</Link>
     
       
  
      </div>
     
     
    </div>
  </div>
        
        </section>
      </React.Fragment>
        )
    }

    const renderStep3 =() => {
        return (
            // <div>
            //     <input
            //     type='text'
            //     id='password'
            //     placeholder='비밀번호 입력'
            //     value={password}
            //     onChange={(e) => setNewPassword(e.target.value)}
            //     required
            //    />

            // <input
            //     type='text'
            //     id='checkPw'
            //     placeholder='비밀번호 확인'
            //     value={checkPw}
            //     onChange={(e) => setcheckPw(e.target.value)}
            //     required
            //    />

            //    <button type='submit' onClick={ChangePassword}>비밀번호 변경 </button>
            //    <p>
            //    <br />
            //    <button><Link to="/"style={{ color: 'black', textDecoration: 'none' }}>로그인창으로돌아가기</Link></button>
            // </p>
            // </div>
            <React.Fragment>
            <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
            <div className='w-full h-full grid md:grid-cols-10'> {/* md:grid-cols-10으로 수정 */}
        <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6'> {/* col-span-6으로 수정 */}
        
          <TextAni/>
        </div>
        
        <div className="md:h-screen flex flex-col justify-center items-center bg-right-main col-span-4 w-90"> {/* col-span-4으로 수정 */}
          <h2 className='text-4xl p-6 mb-6 font-gmarket' >비밀번호 찾기</h2>
          
          <div>
            <div class="mt-2">
              <input id="password"  type="text"  placeholder='비밀번호 입력' 
              ref={userRef}
              value={code}
              onChange={(e)=>setVerifyCode(e.target.value)}
              required class="block w-full sm:w-80  rounded-md border-0 py-3
               text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                 focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
            </div>
            <div className="mt-2 ">
              <input id="checkPw"  type="text"  placeholder='비밀번호 확인' 
              ref={userRef}
              value={checkPw}
              onChange={(e)=>setcheckPw(e.target.value)}
              required class="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset
               ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                focus:ring-indigo-600 sm:text-sm sm:leading-6 "></input>
            </div>
          </div>
      
         
      
          <div className='items-center flex justify-center mb-6'>
            <button onClick={ChangePassword}type="submit" class="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">코드요청</button>
          </div>
      
          <div className='flex justify-start '>
          <Link to="/">로그인창으로돌아가기</Link>
         
           
      
          </div>
         
         
        </div>
      </div>
            
            </section>
          </React.Fragment>
        )
    }

    const renderStep4 = () => {
        return (

            <React.Fragment>
            <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
            <div className='w-full h-full grid md:grid-cols-10'> {/* md:grid-cols-10으로 수정 */}
        <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6'> {/* col-span-6으로 수정 */}
          
          <TextAni/>
        </div>
        
        <div className="md:h-screen flex flex-col justify-center items-center bg-right-main col-span-4 w-90"> {/* col-span-4으로 수정 */}
          <h2 className='text-4xl p-6 mb-6 font-gmarket' >비밀번호변경이 완료되었습니다!</h2>
          
        
      
          <div className='flex justify-start '>
          <Link to="/">로그인창으로돌아가기</Link>
         
           
      
          </div>
         
         
        </div>
      </div>
            
            </section>
          </React.Fragment>


        )
           

        
    }

  

   

   
    
    return (

        <section>
             {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>비밀번호</h1> */}
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
