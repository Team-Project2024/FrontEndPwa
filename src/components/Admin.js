import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Event from "./Event";
import Major from "./Major";
import Graduation from "./Graduation";
import Class from "./Class";



const Admin= () => {
    const [selectedMenu, setSelectedMenu] = useState(""); // 현재 선택된 메뉴 상태

    // 행사관리 버튼 클릭 시
    const handleEventManagementClick = () => {
      setSelectedMenu("eventManagement"); // 행사관리 메뉴 선택
    };
  
   
    const handleMajorManagementClick = () => {
      setSelectedMenu("MajorManagement"); 
    };

    const handleGraduationManagementClick = () => {
      setSelectedMenu("GraduationManagement"); 
    };

    const handleClassManagementClick = () => {
      setSelectedMenu("ClassManagement"); 
    };
  
    return (
      <React.Fragment>
        <div className="bg-left-main flex flex-row h-screen justify-center items-center">
          {/* 왼쪽 메뉴 */}
          <div className="absolute left-0 h-5/6 bg-chat-date w-1/5  rounded-[5px] drop-shadow-xl z-10 items-center justify-center flex flex-col">
            <h2 className="text-5xl font-gmarket   ">LUMOS</h2>
            {/* 행사관리 버튼 */}
            <button className="mt-5 mb-5  font-gmarket text-4xl" onClick={handleEventManagementClick}>행사관리</button>
            {/* 수업관리 버튼 */}
            <button className="mt-5 mb-5 font-gmarket text-4xl"onClick={handleMajorManagementClick}>전공관리</button>

            <button className="mt-5 mb-5 font-gmarket text-4xl"onClick={handleGraduationManagementClick}>졸업요건관리</button>

            <button className="mt-5 mb-5 font-gmarket text-4xl"onClick={handleClassManagementClick}>강의관리</button>
          </div>
          {/* 오른쪽 컨텐츠 */}
          <div className="h-5/6 w-4/5 bg-chat-ui rounded-[50px] flex flex-col justify-center relative items-center " >
            {/* 선택된 메뉴에 따라 다른 컴포넌트 표시 */}
            {selectedMenu === "eventManagement" && (
              <Event/>
            )}
            {selectedMenu === "MajorManagement" && (
             <Major/>
            )}
              {selectedMenu === "GraduationManagement" && (
             <Graduation/>
            )}
             {selectedMenu === "ClassManagement" && (
             <Class/>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  };
export default Admin