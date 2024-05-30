import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Navigate } from "react-router-dom";

const DetailPage = () => {
  const { itemType, itemId } = useParams();
  const [detailInfo, setDetailInfo] = useState(null);
  const [professor, setProfessor] = useState([]);
  const axiosPrivate = useAxiosPrivate();

 
 

  
  useEffect(() => {
    const dataString = sessionStorage.getItem("contentData");
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        console.log(data);
        let detail = null;
        if (data.table === "lecture" && itemType === "lecture") {
          const parsedData = data.data; // JSON 배열로 이미 존재
          detail = parsedData.find(
            (lecture) => lecture.lectureId === parseInt(itemId)
          );
        } else if (data.table === "event" && itemType === "event") {
          const parsedData = data.data; // JSON 배열로 이미 존재
          detail = parsedData.find(
            (event) => event.eventId === parseInt(itemId)
          );
        }
        setDetailInfo(detail);
      } catch (error) {
        console.error("Error parsing contentData:", error);
      }
    }
  }, [itemType, itemId]);
  if (!detailInfo) {
    return <p>해당 항목을 찾을 수 없습니다.</p>;
  }
  const getProfessor = async () => {
    try {
      const response = await axiosPrivate.get("/admin/member-professor");
      setProfessor(response.data);
      console.log(professor);
    } catch (error) {
      console.error("에러발생", error);
    }
  };

  
  return (
    <div className="min-h-screen  flex flex-col items-center bg-gray-900 dark:bg-white p-4 justify-center ">
      <div className="bg-gray-800 text-white rounded-lg w-full max-w-4xl p-8 items-center justify-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">LUMOS</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">강의명</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo === null ? "*" : detailInfo.lectureName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">이수구분</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.classification}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">강의실</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.room}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">학점</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.credit}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">분반</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.division}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">개설 학년</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.grade}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">T.E.C.H</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.teamwork +
                  " - " +
                  detailInfo.entrepreneurship +
                  " - " +
                  detailInfo.credit +
                  " - " +
                  detailInfo.harnessingResource}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">교수</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.memberName}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">AISW디그리</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.aiSw ? "O" : "X"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">강의평가</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.course_evaluation}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">수업방식</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.classMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">시험유형</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.testType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">팀플유무</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.teamPlay ? "O" : "X"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">성적산출방식</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.gradeMethod}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">강의 시간</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.lectureTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">교수 학과</span>
              <span className="bg-gray-700 p-2 rounded-md w-2/3">
                {detailInfo.department}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
   
      </div>
    </div>
  );
};
export default DetailPage;