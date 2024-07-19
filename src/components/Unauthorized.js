import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section className="flex flex-col items-center justify-center h-screen bg-gray-100 font-gmarket">
            <h1 className="text-4xl font-bold text-black mb-4 ">접근 권한 없음</h1>
            <p className="text-lg text-gray-700 mb-6">권한이 없거나 토큰이 만료되었습니다.</p>
            <div className="flex justify-center">
                <button
                    className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={goBack}
                >
                    메인페이지로 이동
                </button>
            </div>
        </section>
    );
}

export default Unauthorized;
