import 'react-tooltip/dist/react-tooltip.css'


import React, { useState } from "react";
import { FaBars, FaTimes, FaSignOutAlt, FaComments } from "react-icons/fa";
import Major from "./Major";
import Graduation from "./Graduation";
import Class from "./Class";
import useLogout from "../hooks/useLogout";
import AdminMain from './AdminMain';
import { Tooltip } from 'react-tooltip';
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState(""); // 현재 선택된 메뉴 상태
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // 사이드바 상태
  const navigate = useNavigate();

  const logout = useLogout();

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setIsSidebarVisible(false);
  };


  const handleNavigation = () => {
    navigate('/chat');
  };

  return (
    <div className="flex lg:h-screen  h-auto lg:pr-32 pr-0 lg:bg-gray-600 bg-transparent lg:py-6 py-0">
      {/* 사이드바 열기 버튼 (작은 화면에서) */}
      <div className="flex w-screen h-screen lg:shadow-[0px_0px_15px_0px_rgba(0,0,0,0.5)] lg:h-auto bg-white rounded-tr-3xl rounded-br-3xl">
        <div className="lg:hidden block p-4 absolute top-2 left-4 z-10">
          <FaBars
            onClick={() => setIsSidebarVisible(true)}
            className="text-2xl text-gray-800  cursor-pointer"
          />
        </div>
        
        {/* 사이드바 */}
        <div
          className={`lg:block bg-white shadow-[4px_0px_10px_0px_rgba(0,0,0,0.3)] dark:bg-gray-800 overflow-y-scroll scrollbar-hide lg:relative absolute inset-0 lg:w-1/4 w-2/5 border-r border-gray-300 dark:border-gray-600 z-20 flex flex-col justify-between h-full ${isSidebarVisible ? "w-full " : "hidden "
            }`}
        >
          <div className="lg:hidden pt-2 pr-2 flex justify-end mb-4">
            <FaTimes
              onClick={() => setIsSidebarVisible(false)}
              className="text-2xl text-red-500 hover:text-red-600 dark:text-red-700 cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 ">
              <div className="flex justify-between items-center">
                <div className="text-4xl mb-10 dark:text-gray-200 font-gmarket">
                  LUMOS
                </div>
                <div className="text-sm mb-14  dark:text-gray-200 font-gmarket">
                  관리자 페이지
                </div>
              </div>
            </div>
            <div className="pl-4 pr-4 lg:mt-0 flex flex-col flex-grow justify-around ">
              <div
                className={`${selectedMenu === "MajorManagement" ? "text-3xl font-bold hover:text-black" : ""
                  } cursor-pointer ml-4 sm:ml-16 text-2xl font-gmarket mb-2 hover:text-gray-400`}
                onClick={() => handleMenuClick("MajorManagement")}
              >
                전공 관리
              </div>
              <div
                className={`${selectedMenu === "GraduationManagement" ? "text-3xl font-bold hover:text-black" : ""
                  } cursor-pointer ml-4 sm:ml-16 text-2xl font-gmarket mb-2 hover:text-gray-400`}
                onClick={() => handleMenuClick("GraduationManagement")}
              >
                졸업요건 추가
              </div>
              <div
                className={`${selectedMenu === "ClassManagement" ? "text-3xl font-bold hover:text-black" : ""
                  } cursor-pointer ml-4 sm:ml-16 text-2xl font-gmarket mb-2 hover:text-gray-400`}
                onClick={() => handleMenuClick("ClassManagement")}
              >
                강의 관리
              </div>
            </div>
            <div className="sticky bottom-0 left-0 p-4 bg-white flex justify-between items-center">

              {/* 로그아웃 버튼 */}
              <div>
                <FaSignOutAlt
                  data-tooltip-id="my-tooltip" data-tooltip-content="로그아웃"
                  onClick={logout}
                  className="text-3xl text-gray-500 hover:text-gray-700 cursor-pointer"
                />
              </div>
              <Tooltip id="my-tooltip" />


              <div>
                <FaComments
                  onClick={handleNavigation}
                  data-tooltip-id="my-tooltip" data-tooltip-content="챗봇 페이지로 이동"
                  className="text-2xl text-gray-500 hover:text-gray-700 cursor-pointer"
                />


              </div>

            </div>
          </div>
        </div>







        {/* 오른쪽 컨텐츠 */}
        <div // lg:bg-gray-400
          className={`flex-grow p-4   flex flex-col rounded-tr-3xl rounded-br-3xl lg:overflow-hidden ${isSidebarVisible ? "hidden lg:block" : "block"
            }`} 
        >  
          <div  // lg:bg-gray-500
          className="flex-grow mb-4 p-2 lg:p-8 overflow-y-auto  items-center justify-center crollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
            {/* 선택된 메뉴에 따라 다른 컴포넌트 표시 */}
            {selectedMenu === "MajorManagement" && <Major />}
            {selectedMenu === "GraduationManagement" && <Graduation />}
            {selectedMenu === "ClassManagement" && <Class />}
            {selectedMenu === "" && <AdminMain />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
