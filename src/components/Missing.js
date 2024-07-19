import React from 'react';
import { Link } from 'react-router-dom';

const Missing = () => {
    return (
        <article className="flex flex-col items-center justify-center h-screen bg-gray-100 p-10">
            <h1 className="text-4xl font-bold text-black mb-4">존재하지않는 페이지입니다!</h1>
            <p className="text-lg text-gray-700 mb-6">Page Not Found</p>
            <div className="flex justify-center">
                <Link
                    to="/"
                    className="flex w-60 justify-center rounded-md bg-gray-600 px-3 py-3 sm:w-80 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    로그인화면으로 이동
                </Link>
            </div>
        </article>
    );
}

export default Missing;
