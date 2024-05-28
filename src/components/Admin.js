import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import AuthContext from "../context/AuthProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Event from "./Event";
import Major from "./Major";
import Graduation from "./Graduation";
import Class from "./Class";
import Navbar from "./Navbar";
import useLogout from "../hooks/useLogout";

const Admin = () => {
  const [selectedMenu, setSelectedMenu] = useState(""); // 현재 선택된 메뉴 상태
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // 사이드바 상태

  const logout = useLogout();

  const handleEventManagementClick = () => {
    setSelectedMenu("eventManagement"); // 행사관리 메뉴 선택
    setIsSidebarVisible(false);
  };

  const handleMajorManagementClick = () => {
    setSelectedMenu("MajorManagement");
    setIsSidebarVisible(false);
  };

  const handleGraduationManagementClick = () => {
    setSelectedMenu("GraduationManagement");
    setIsSidebarVisible(false);
  };

  const handleClassManagementClick = () => {
    setSelectedMenu("ClassManagement");
    setIsSidebarVisible(false);
  };

  return (
    <React.Fragment>
    
      <div className="flex flex-col lg:flex-row h-screen">
        {/* 사이드바 열기 버튼 (작은 화면에서) */}
        <div className="lg:hidden absolute top-2 left-2 z-10">
          <FaBars
            onClick={() => setIsSidebarVisible(true)}
            className="text-2xl text-gray-800 dark:text-gray-200 cursor-pointer"
          />
        </div>

        {/* 왼쪽 메뉴 (사이드바) */}
        <div
          className={`fixed lg:relative top-0 left-0 z-20 bg-gray-900 lg:bg-transparent lg:block ${
            isSidebarVisible ? "block" : "hidden"
          } h-full lg:h-auto w-48 lg:w-1/5 p-4 lg:p-0 shadow-lg lg:shadow-none flex flex-col items-center`}
        >
          <div className="flex justify-between items-center mb-8 w-full">
            <h2 className="text-2xl lg:text-5xl font-gmarket text-white lg:text-black">
              LUMOS
            </h2>
            <FaTimes
              onClick={() => setIsSidebarVisible(false)}
              className="text-2xl text-white lg:hidden cursor-pointer"
            />
          </div>

          <button
            className="mt-5 mb-5 w-full font-gmarket text-lg lg:text-4xl text-white lg:text-black text-center"
            onClick={handleEventManagementClick}
          >
            행사관리
          </button>
          <button
            className="mt-5 mb-5 w-full font-gmarket text-lg lg:text-4xl text-white lg:text-black text-center"
            onClick={handleMajorManagementClick}
          >
            전공관리
          </button>
          <button
            className="mt-5 mb-5 w-full font-gmarket text-lg lg:text-4xl text-white lg:text-black text-center"
            onClick={handleGraduationManagementClick}
          >
            졸업요건관리
          </button>
          <button
            className="mt-5 mb-5 w-full font-gmarket text-lg lg:text-4xl text-white lg:text-black text-center"
            onClick={handleClassManagementClick}
          >
            강의관리
          </button>

          <div className="mt-auto">
            <button onClick={() => setShowSettings(!showSettings)}>
              <img src="/setting.png" alt="Settings" className="w-8 h-8" />
            </button>
          </div>

          {/* 설정 창 */}
          {showSettings && (
            <div className="absolute bottom-16 right-0 mb-4 p-4 bg-white rounded-md shadow-md">
              <h3 onClick={logout} className="cursor-pointer">
                로그아웃
              </h3>
            </div>
          )}
        </div>

        {/* 오른쪽 컨텐츠 */}
        <div
          className={`flex-grow h-full lg:h-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-t-[50px] lg:rounded-[50px] flex flex-col justify-center items-center overflow-auto ${
            isSidebarVisible ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* 선택된 메뉴에 따라 다른 컴포넌트 표시 */}
          {selectedMenu === "eventManagement" && <Event />}
          {selectedMenu === "MajorManagement" && <Major />}
          {selectedMenu === "GraduationManagement" && <Graduation />}
          {selectedMenu === "ClassManagement" && <Class />}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Admin;
