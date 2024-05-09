import React from "react";
import { useState,useRef,useEffect } from "react"
import axios from '../api/axios';
import { Link } from "react-router-dom"
import Lottie from "lottie-react";
import MainLottie from "../image/Animation - 1712815297760.json"
import TextAnimation from "./TextAnimation";
import TextAni from "./TextAni";
import { BrowserView, MobileView } from "react-device-detect";




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

      <React.Fragment>

      <BrowserView>
      <React.Fragment>
        <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
        <div className='w-full h-full grid md:grid-cols-10'> {/* md:grid-cols-10으로 수정 */}
    <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6'> {/* col-span-6으로 수정 */}
      
     <TextAni></TextAni>
    </div>
    {toggle && <h2>찾으시는 학번/교번{userId}</h2>}
    <div className="md:h-screen block flex flex-col justify-center items-center bg-right-main col-span-4 w-90"> {/* col-span-4으로 수정 */}
    <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
            >
        {errMsg}
       </p>
      <h2 className='text-4xl p-6 mb-6 font-gmarket'>학번/교번 찾기</h2>

      <form onSubmit={handleFindId}> 
      <div>
        <div class="mt-2">
          <input id="email" name="email" type="email" 
          ref={userReff}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
           placeholder='이메일' 
          required class="block w-full sm:w-80  rounded-md border-0 py-3 text-gray-900 pl-3
          shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
          focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
        </div>
      </div>
  
      <div>
        <div className="flex items-center justify-between">
        </div>
        <div className="mt-2 mb-5">
          <input id="name" name="password" type="name"  placeholder='이름' 
          onChange={(e)=> setName(e.target.value)}
          value={name}
          required class="block w-full sm:w-80 rounded-md border-0 py-3 pl-3
           text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset
             focus:ring-indigo-600 sm:text-sm sm:leading-6 "></input>
        </div>
      </div>
     
  
      <div className='items-center flex justify-center mb-6'>
        <button type="submit" class="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">찾기</button>
      </div>
      </form>
  
      <div className='flex justify-start '>
      <Link to="/">로그인창으로돌아가기</Link>
       
  
      </div>
     
    </div>
  </div>
        
        </section>
      </React.Fragment>
      </BrowserView>


<MobileView>

<React.Fragment>

{toggle && <h2>찾으시는 학번/교번{userId}</h2>}
    <div className="md:h-screen block flex flex-col justify-center items-center bg-right-main col-span-4 w-90"> {/* col-span-4으로 수정 */}
      <h2 className='text-4xl p-6 mb-6 font-gmarket'>학번/교번 찾기</h2>

      <form onSubmit={handleFindId}> 
      <div>
        <div class="mt-2">
          <input id="email" name="email" type="email" 
          ref={userReff}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
           placeholder='이메일' 
          required class="block w-full sm:w-80  rounded-md border-0 py-3 text-gray-900 pl-3
          shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
          focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
        </div>
      </div>
  
      <div>
        <div className="flex items-center justify-between">
        </div>
        <div className="mt-2 mb-5">
          <input id="name" name="password" type="password"  placeholder='이름' 
          onChange={(e)=> setName(e.target.value)}
          value={name}
          required class="block w-full sm:w-80 rounded-md border-0 py-3 pl-3
           text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
            placeholder:text-gray-400 focus:ring-2 focus:ring-inset
             focus:ring-indigo-600 sm:text-sm sm:leading-6 "></input>
        </div>
      </div>
     
  
      <div className='items-center flex justify-center mb-6'>
        <button type="submit" class="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">찾기</button>
      </div>
      </form>
  
      <div className='flex justify-start '>
      <Link to="/">로그인창으로돌아가기</Link>
       
  
      </div>
     
    </div>
  





      </React.Fragment>


</MobileView>
  
  
  </React.Fragment>
        






    //     <section>
    //         <p
    //             ref={errRef}
    //             className={errMsg ? "errmsg" : "offscreen"}
    //             aria-live="assertive"
    //         >
    //     {errMsg}
    //   </p>
    //         <h1>학번/교번 찾기</h1>
    //         <form onSubmit={handleFindId}>
    //             <label htmlFor="email">이메일:</label>
    //             <input
    //                 type="text"
    //                 id="email"
    //                 ref={userReff}
    //                 autoComplete="off"
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 value={email}
    //                 required
    //             />

    //             <label htmlFor="name">이름:</label>
    //             <input
    //                 type="text" // type을 text로 수정
    //                 id="name"
    //                 onChange={(e) => setName(e.target.value)}
    //                 value={name}
    //                 required
    //             />
    //             <button type="submit">찾기</button> {/* type="submit" 추가 */}
    //         </form>
        
    //         {toggle && <h2>찾으시는 학번/교번{userId}</h2>}
           
    //         <p>
    //            <br />
    //            <button><Link to="/"style={{ color: 'black', textDecoration: 'none' }}>로그인창으로돌아가기</Link></button>
                    
               
    //         </p>
    //     </section>
    )
}

export default FindId
