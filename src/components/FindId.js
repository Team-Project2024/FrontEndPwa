import React from "react";
import { useState, useRef, useEffect } from "react";
import axios from '../api/axios';
import { Link } from "react-router-dom";
import TextAni from "./TextAni";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const FINDID_URL = '/find-id';

const FindId = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [errMsg, setErrMsg] = useState(""); 
    const [userId, setUserId] = useState("");
    const [open, setOpen] = useState(false); // Modal open state
    const [isSuccess, setIsSuccess] = useState(false); // Success state
    const userReff = useRef();

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
                setIsSuccess(true);
                setOpen(true); // Show success modal
            } else {
                setErrMsg('요청이 실패했습니다.');
                setIsSuccess(false);
                setOpen(true); // Show error modal
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('실패');
            } else if (err.response?.status === 405) {
                setErrMsg('클라이언트->서버 권한 없음');
            } else {
                setErrMsg('요청이 실패했습니다.');
            }
            setIsSuccess(false);
            setOpen(true); // Show error modal
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <section className="h-screen flex flex-col md:flex-row justify-center items-center my-2 mx-5 md:mx-0 md:my-0 bg-blue-200">
                <div className='w-full h-full grid md:grid-cols-10'>
                    <div className='bg-left-main md:h-screen flex flex-col justify-center items-center p-6 col-span-6 hidden md:flex'>
                        <TextAni />
                    </div>
                    <div className="flex flex-col justify-center items-center bg-right-main col-span-10 md:col-span-4 w-full md:w-90">
                        <h2 className='text-4xl p-6 mb-6 font-gmarket'>학번/교번 찾기</h2>
                        <form onSubmit={handleFindId}>
                            <div>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        ref={userReff}
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        placeholder='이메일'
                                        required
                                        className="block w-full sm:w-80 rounded-md border-0 py-3 text-gray-900 pl-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between"></div>
                                <div className="mt-2 mb-5">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder='이름'
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        required
                                        className="block w-full sm:w-80 rounded-md border-0 py-3 pl-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className='items-center flex justify-center mb-6'>
                                <button type="submit" className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    찾기
                                </button>
                            </div>
                        </form>
                        <div className='flex justify-start'>
                            <Link to="/">로그인창으로 돌아가기</Link>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isSuccess ? '성공' : '실패'}</DialogTitle>
                <DialogContent>
                    {isSuccess ? `찾으시는 학번/교번: ${userId}` : errMsg}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

export default FindId;
