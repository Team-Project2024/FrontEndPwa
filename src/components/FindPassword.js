import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import TextAni from './TextAni';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import useLogout from "../hooks/useLogout";

const FINDPASSWORD_URL = '/find-pw';
const VERIFYCODEURL = '/code-verification';
const CHANGEPASSWORD_URL = '/change-password';

function FindPassword() {
  const [step, setStep] = useState(1);
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [password, setNewPassword] = useState("");
  const [checkPw, setcheckPw] = useState("");
  const [code, setVerifyCode] = useState("");
  const [open, setOpen] = useState(false);
  const [trimOpen, settrimOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [count, setCount] = useState(60); // 3 minutes countdown
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);
  const [isResendVisible, setIsResendVisible] = useState(false); 
  const logout = useLogout();
  const userRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [id, email, name, password, checkPw, code]);

  useEffect(() => {
    let timer;
    if (step === 2 && count > 0) {
      timer = setTimeout(() => setCount(count - 1), 1000);
    } else if (count === 0) {
      setIsVerifyDisabled(true);
      setIsResendVisible(true); 
    }
    return () => clearTimeout(timer);
  }, [count, step]);

  const handleClose = () => {
    setOpen(false);
    navigate('/');
  }

  const handleTrimClose = () => {
    settrimOpen(false);
  }

  const handleErrorClose = () => {
    setErrorOpen(false);
  }

  const handleFindPassword = async (e) => {
    e.preventDefault();
    const idRegex = /^\d{6}$|^\d{8}$/;
    if (!idRegex.test(id)) {
      setErrMsg('입력을 확인해주세요');
      setErrorOpen(true);
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
        setStep(2);
        setCount(180); 
        setIsVerifyDisabled(false);
        setIsResendVisible(false);
      } else {
        setErrMsg('요청이 실패했습니다.');
        setErrorOpen(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('틀리게 입력한요소가있는지 확인해주세요');
      }
      setErrorOpen(true);
    }
  }

  const VerifyCation = async (e) => {
    e.preventDefault();
    if (isVerifyDisabled) return; 

    try {
      const response = await axios.post(VERIFYCODEURL,
        JSON.stringify({ id, code }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setStep(3);
      } else {
        setErrMsg('요청이 실패했습니다.');
        setErrorOpen(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('인증코드를 다시확인해주세요');
      }
      setErrorOpen(true);
    }
  }

  const ChangePassword = async (e) => {
    e.preventDefault();
    if(password !== checkPw){
       settrimOpen(true);
       return;
    }
    try {
      const response = await axios.post(CHANGEPASSWORD_URL,
        JSON.stringify({ id, password, checkPw }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setOpen(true);
      } else {
        setErrMsg('요청이 실패했습니다.');
        setErrorOpen(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('실패');
      }
      setErrorOpen(true);
    }
  }

  const handleResend = async () => {
    try {
      const response = await axios.post(FINDPASSWORD_URL,
        JSON.stringify({ id, email, name }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      if (response.status === 200) {
        setIsVerifyDisabled(false);
        setIsResendVisible(false);
        setCount(180); 
      } else {
        setErrMsg('요청이 실패했습니다.');
        setErrorOpen(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('실패');
      }
      setErrorOpen(true);
    }
  }

  const renderStep1 = () => {
    return (
      <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
        <div className='w-full h-full grid md:grid-cols-10'>
          <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6 hidden md:flex'>
            <TextAni />
          </div>
          <div className="flex flex-col justify-center items-center bg-right-main col-span-10 md:col-span-4 w-full md:w-90">
            <h2 className='text-xl sm:text-4xl p-6 mb-6 font-gmarket'>비밀번호 찾기</h2>
            <form onSubmit={handleFindPassword}>
              <div>
                <div className="mt-2">
                  <input id="id" type="text" placeholder='학번/교번'
                    ref={userRef}
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required className="block w-full sm:w-80 rounded-md border-0 py-3 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
                </div>
              </div>
              <div className="mt-2">
                <input id="email" type="text" placeholder='이메일'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset pl-3 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
              <div className="mt-2 mb-5">
                <input id="name" type="text" placeholder='이름'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required className="block w-full sm:w-80 rounded-md border-0 py-3 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
              <div className='items-center flex justify-center mb-6'>
                <button type="submit" className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">코드요청</button>
              </div>
              <div className='flex justify-center font-bold'>
                <Link onClick={logout} to="/login">로그인창으로돌아가기</Link>
              </div>
            </form>
          </div>
        </div>
        <Dialog open={errorOpen} onClose={handleErrorClose}>
          <DialogTitle>요청 실패</DialogTitle>
          <DialogContent>{errMsg}</DialogContent>
          <DialogActions>
            <Button onClick={handleErrorClose} color="primary">닫기</Button>
          </DialogActions>
        </Dialog>
      </section>
    );
  }

  const renderStep2 = () => {
    return (
      <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
        <div className='w-full h-full grid md:grid-cols-10'>
          <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6 hidden md:flex'>
            <TextAni />
          </div>
          <div className="flex flex-col justify-center items-center bg-right-main col-span-10 md:col-span-4 w-full md:w-90">
          <h2 className='text-xl sm:text-4xl p-6 mb-6 font-gmarket'>비밀번호 찾기</h2>
            <div>
            <div className='mt-2 justify-center items-center flex flex-row'>
              <p className="text-red-500 justify-center">{Math.floor(count / 60)}:{(count % 60).toString().padStart(2, '0')}</p>
            </div>
              <div className="mt-2">
                <input id="verifycode" type="text" placeholder='인증코드입력'
                  ref={userRef}
                  value={code}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  required className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
              </div>
            </div>
           
            <div className='items-center flex justify-center mb-6 mt-6'>
              <button onClick={VerifyCation} type="submit" disabled={isVerifyDisabled} className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">코드인증</button>
            </div>
            {isVerifyDisabled && (
              <div className='items-center flex justify-center mb-6'>
                <button onClick={handleResend} className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">코드 재요청</button>
              </div>
            )}
            <div className='flex justify-center font-bold font-gmarket'>
              <Link onClick={logout} to="/login">로그인창으로돌아가기</Link>
            </div>
          </div>
        </div>
        <Dialog open={errorOpen} onClose={handleErrorClose} className='w-full'>
          <DialogTitle>요청 실패</DialogTitle>
          <DialogContent>{errMsg}</DialogContent>
          <DialogActions>
            <Button onClick={handleErrorClose} color="primary">닫기</Button>
          </DialogActions>
        </Dialog>
      </section>
    );
  }

  const renderStep3 = () => {
    return (
      <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
        <div className='w-full h-full grid md:grid-cols-10'>
          <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6 hidden md:flex'>
            <TextAni />
          </div>
          <div className="flex flex-col justify-center items-center bg-right-main col-span-10 md:col-span-4 w-full md:w-90">
          <h2 className='text-xl sm:text-4xl p-6 mb-6 font-gmarket'>비밀번호 찾기</h2>
            <div className="mt-2">
              <input id="password" type="password" placeholder='비밀번호 입력'
                ref={userRef}
                value={password}
                onChange={(e) => setNewPassword(e.target.value)}
                required className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
            </div>
            <div className="mt-2 mb-5">
              <input id="checkPw" type="password" placeholder='비밀번호 확인'
                ref={userRef}
                value={checkPw}
                onChange={(e) => setcheckPw(e.target.value)}
                required className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></input>
            </div>
            <div className='items-center flex justify-center mb-6'>
              <button onClick={ChangePassword} type="submit" className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">변경</button>
            </div>
            <div className='flex justify-center font-bold'>
              <Link onClick={logout} to="/login">로그인창으로돌아가기</Link>
            </div>
          </div>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>비밀번호 변경 성공!</DialogTitle>
          <DialogContent>비밀번호 변경이 완료되었습니다.</DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">확인</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={errorOpen} onClose={handleErrorClose}>
          <DialogTitle>요청 실패</DialogTitle>
          <DialogContent>{errMsg}</DialogContent>
          <DialogActions>
            <Button onClick={handleErrorClose} color="primary">닫기</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={trimOpen} onClose={handleTrimClose}>
          <DialogTitle>비밀번호 불일치</DialogTitle>
          <DialogContent>새 비밀번호와 확인비밀번호가 일치하지 않습니다.</DialogContent>
          <DialogActions>
            <Button onClick={handleTrimClose} color="primary">닫기</Button>
          </DialogActions>
        </Dialog>
      </section>
    );
  }

  return (
    <section>
      <div>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </section>
  );
}

export default FindPassword;
