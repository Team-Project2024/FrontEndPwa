import 'react-tooltip/dist/react-tooltip.css';
import React, { useState } from "react";
import { FaBars, FaTimes, FaSignOutAlt, FaComments } from "react-icons/fa";
import Major from "./Major";
import Graduation from "./Graduation";
import Class from "./Class";
import useLogout from "../hooks/useLogout";
import AdminMain from './AdminMain';
import { Tooltip } from 'react-tooltip';
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
    <div className="flex xl:h-screen h-auto xl:pr-32 pr-0 xl:bg-gray-600 bg-transparent xl:py-6 py-0">
      {/* 사이드바 열기 버튼 (작은 화면에서) */}
      <div className="flex w-screen h-screen xl:shadow-[0px_0px_15px_0px_rgba(0,0,0,0.5)] xl:h-auto bg-white rounded-tr-3xl rounded-br-3xl">
        <div className="xl:hidden block p-4 absolute top-2 left-4 z-10">
          <FaBars
            onClick={() => setIsSidebarVisible(true)}
            className="text-2xl text-gray-800 cursor-pointer"
          />
        </div>

        {/* 사이드바 */}
        <div
          className={`xl:block bg-white shadow-[4px_0px_10px_0px_rgba(0,0,0,0.3)] dark:bg-gray-800 overflow-y-scroll scrollbar-hide xl:relative absolute inset-0 w-72 min-w-72 max-w-72 border-r border-gray-300 dark:border-gray-600 z-20 flex flex-col justify-between h-full ${isSidebarVisible ? "w-full" : "hidden"}`}
        >
          <div className="xl:hidden pt-2 pr-2 flex justify-end mb-4">
            <FaTimes
              onClick={() => setIsSidebarVisible(false)}
              className="text-2xl text-red-500 hover:text-red-600 dark:text-red-700 cursor-pointer"
            />
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4">
              <div className="flex justify-between items-center">
                <div className="text-4xl mb-10 dark:text-gray-200 font-gmarket">
                  LUMOS
                </div>
              </div>
            </div>
            <div className="pl-4 pr-4 xl:mt-0 flex flex-col flex-grow justify-around">
              <div
                className={`cursor-pointer ml-4 sm:ml-16 text-2xl font-gmarket mb-2 hover:text-gray-400 ${selectedMenu === "MajorManagement" ? "font-bold" : ""}`}
                onClick={() => handleMenuClick("MajorManagement")}
              >
                전공 관리
              </div>
              <div
                className={`cursor-pointer ml-4 sm:ml-16 text-2xl font-gmarket mb-2 hover:text-gray-400 ${selectedMenu === "GraduationManagement" ? "font-bold" : ""}`}
                onClick={() => handleMenuClick("GraduationManagement")}
              >
                졸업요건 추가
              </div>
              <div
                className={`cursor-pointer ml-4 sm:ml-16 text-2xl font-gmarket mb-2 hover:text-gray-400 ${selectedMenu === "ClassManagement" ? "font-bold" : ""}`}
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
        <div
          className={`flex-grow p-4 flex flex-col rounded-tr-3xl rounded-br-3xl xl:overflow-hidden ${isSidebarVisible ? "hidden xl:block" : "block"}`}
        >
          <div
            className="flex-grow mb-4 p-2 xl:p-8 overflow-y-auto items-center justify-center scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300"
          >
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
