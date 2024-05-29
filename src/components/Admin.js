import React, { useState } from "react";
import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import Major from "./Major";
import Graduation from "./Graduation";
import Class from "./Class";
import useLogout from "../hooks/useLogout";


const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState(""); // 현재 선택된 메뉴 상태
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // 사이드바 상태

  const logout = useLogout();

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setIsSidebarVisible(false);
  };

  return (
    <div className="flex lg:h-screen h-auto lg:pr-32 pr-0 lg:bg-gray-600 bg-transparent lg:py-6 py-0">
      {/* 사이드바 열기 버튼 (작은 화면에서) */}
      <div className="flex w-screen h-screen lg:h-auto bg-white rounded-tr-3xl rounded-br-3xl">
        <div className="lg:hidden block p-4 absolute top-2 left-4 z-10">
          <FaBars
            onClick={() => setIsSidebarVisible(true)}
            className="text-2xl text-blue-500 dark:text-blue-700 cursor-pointer"
          />
        </div>

        {/* 사이드바 */}
        <div
          className={`lg:block dark:bg-gray-800 overflow-y-scroll scrollbar-hide bg-white lg:relative absolute inset-0 lg:w-1/4 w-2/5 border-r border-gray-300 dark:border-gray-600 z-20 flex flex-col h-full bg-red-800 justify-center  ${
            isSidebarVisible ? "w-full" : "hidden"
          }`}
        >
          <div className="lg:hidden pt-2 pr-2 flex justify-end mb-4">
            <FaTimes
              onClick={() => setIsSidebarVisible(false)}
              className="text-2xl text-red-500 dark:text-red-700 cursor-pointer"
            />
          </div>

            {/* 여기에 mb주면 스크롤이됨 */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 "> 
            <div className="text-xl mb-4 dark:text-gray-200 font-gmarket">
              LUMOS
            </div>
           
          </div>

          <div className="pb-4 pl-4 pr-4 h-full flex-grow  mt-4 lg:mt-0 lg:flex-grow ">
            
            <div
              className={`${
                selectedMenu === "MajorManagement" ? "font-bold" : ""
              } mb-20 cursor-pointer text-2xl font-gmarket`}
              onClick={() => handleMenuClick("MajorManagement")}
            >
              전공 추가
            </div>
            <div
              className={`${
                selectedMenu === "GraduationManagement" ? "font-bold" : ""
              } mb-20 cursor-pointer text-2xl font-gmarket`}
              onClick={() => handleMenuClick("GraduationManagement")}
            >
              졸업요건 추가
            </div>
            <div
              className={`${
                selectedMenu === "ClassManagement" ? "font-bold" : ""
              } mb-4 cursor-pointer text-2xl font-gmarket`}
              onClick={() => handleMenuClick("ClassManagement")}
            >
              강의 관리
            </div>
          </div>

          <div className="sticky bottom-0 left-0 p-4 bg-white dark:bg-gray-800 flex justify-between items-center">
           
            {/* 로그아웃 버튼 */}
            <div>
              <FaSignOutAlt
                onClick={logout}
                className="text-3xl text-gray-500 dark:text-gray-200 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 오른쪽 컨텐츠 */}
        <div
          className={`flex-grow p-4 flex flex-col dark:bg-gray-900 dark:text-gray-200 lg:overflow-hidden ${
            isSidebarVisible ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex-grow mb-4 p-16 lg:p-8 overflow-y-auto  items-center justify-center">
            {/* 선택된 메뉴에 따라 다른 컴포넌트 표시 */}
            {selectedMenu === "MajorManagement" && <Major />}
            {selectedMenu === "GraduationManagement" && <Graduation />}
            {selectedMenu === "ClassManagement" && <Class />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
