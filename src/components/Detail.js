import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Tooltip } from 'react-tooltip';
import { FaArrowLeft } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; // Chart.js 자동 등록

const DetailPage = () => {
  const { itemType, itemId } = useParams();
  const [detailInfo, setDetailInfo] = useState(null);
  const [professor, setProfessor] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();  
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const dataString = sessionStorage.getItem("contentData");
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        let detail = null;
        if (data.table === "lecture" && itemType === "lecture") {
          const parsedData = data.data;
          detail = parsedData.find(
            (lecture) => lecture.lectureId === parseInt(itemId)
          );
        } else if (data.table === "event" && itemType === "event") {
          const parsedData = data.data;
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

  const techData = {
    labels: ['T영역', 'E영역', 'C영역', 'H영역'],
    datasets: [
      {
        data: [
          detailInfo.teamwork,
          detailInfo.entrepreneurship,
          detailInfo.credit,
          detailInfo.harnessingResource
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0'
        ]
      }
    ]
  };

  const techOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-300 text-black'}`}>
      <div className={`rounded-lg w-full max-w-6xl  p-8 items-center justify-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">강의세부정보</h1>
          <button 
            className={`p-2 rounded-md bg-gray-300 hover:bg-blue-300 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-300 text-black'}`}
            data-tooltip-id="my-tooltip" data-tooltip-content="챗봇페이지로 이동"
            onClick={() => navigate(-1)}  // 뒤로가기
          >
            <FaArrowLeft />
          </button>
          <Tooltip id="my-tooltip"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4 font-gmarket">
            {[
              { label: "강의명", value: detailInfo.lectureName },
              { label: "이수구분", value: detailInfo.classification },
              { label: "강의실", value: detailInfo.room },
              { label: "학점", value: detailInfo.credit },
              { label: "분반", value: detailInfo.division },
              { label: "개설 학년", value: detailInfo.grade },
              { label: "교수", value: detailInfo.memberName },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="font-semibold">{item.label}</span>
                <span className={`p-2 rounded-md w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-4 font-gmarket">
            {[
              { label: "AISW디그리", value: detailInfo.aiSw ? "O" : "X" },
              { label: "수업방식", value: detailInfo.classMethod },
              { label: "시험유형", value: detailInfo.testType },
              { label: "팀플유무", value: detailInfo.teamPlay ? "O" : "X" },
              { label: "성적산출방식", value: detailInfo.gradeMethod },
              { label: "강의 시간", value: detailInfo.lectureTime },
            
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="font-semibold">{item.label}</span>
                <span className={`p-2 rounded-md w-2/3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">T.E.C.H</h2>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
              <div className="relative h-64 w-full">
                <Doughnut data={techData} options={techOptions} />
              </div>
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
