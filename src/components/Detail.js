import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Tooltip } from 'react-tooltip';
import { FaArrowLeft } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2'; // Bar 차트
import 'chart.js/auto'; 
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const DetailPage = () => {
  const { itemType, itemId } = useParams();
  const [detailInfo, setDetailInfo] = useState(null);
  const [weekInfo, setWeekInfo] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();  
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [open, setOpen] = useState(false);
  const [checkopen, setCheckOpen] = useState(false);

  useEffect(() => {
    const dataString = sessionStorage.getItem("contentData");
    console.log(dataString)
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

  useEffect(() => {
    const fetchDetailInfo = async () => {
      try {
        const response = await axiosPrivate.get(`/api/lecture/detail/${itemId}`);
       
        setWeekInfo(response.data.responseLectureDetailDTOS || []); 
      } catch (error) {
        console.error("Error fetching lecture detail:", error);
      }
    };

    fetchDetailInfo();
  }, [itemId, axiosPrivate]);

  if (!detailInfo) {
    return <p>해당 항목을 찾을 수 없습니다.</p>;
  }

  const techData = {
    labels: ['T영역', 'E영역', 'C영역', 'H영역'],
    datasets: [
      {
        label: '점수', // label 속성을 추가합니다.
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
    indexAxis: 'y', // 가로막대그래프를 위해 추가합니다.
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        max: 5, // x축 최대값을 10으로 설정합니다.
        ticks: {
          color: isDarkMode ? '#FFFFFF' : '#000000' ,
          stepSize: 1,
            min: 0
        },
        grid: {
          color: 'transparent',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          stepSize: 1,
            min: 0 
        },
        grid: {
          color: 'transparent',
        },
      }
    },
    plugins: {
      legend: {
        display: false, // 레전드를 표시하지 않음
        position: 'top',
      
       
      },
      datalabels: {
        color: isDarkMode ? '#FFFFFF' : '#000000', // Change this to the desired color based on the theme
        font: {
          family: 'GmarketSans', // Set the font family
          weight: 'bold', // Set the font weight to bold
          size: 20 // Set the font size, adjust as needed
        },
        formatter: (value, context) => {
          return value;
        }
      }
    }
  };

  const handleClickOpen = () => {
    if (detailInfo.room === 'OCU') {
      alert('수업계획표는 OCU 강의실에서만 열 수 있습니다.');
    } else {
     setOpen(true)
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckkOpen = () => {
    setCheckOpen(true);
  };

  const handleCheckClose = () => {
    setCheckOpen(false);
  };

  const gradeRatioArray = detailInfo.gradeRatio.split('\n').map((line) => {
    const [label, value] = line.split(' ');
    return { label, value: parseInt(value.replace('%', '')) };
  });



  return (
    <div className={`min-h-screen flex flex-col items-center p-4 justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-300 text-black'}`}>
      <div className={`rounded-lg w-full max-w-6xl p-8 items-center justify-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{detailInfo.lectureName}</h1>
          <button  
          onClick={handleClickOpen}
          className="py-2.5 px-5 me-2 mb-2 text-sm  text-gray-900 focus:outline-none bg-slate-300 rounded-full border
           border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100
           dark:focus:ring-gray-700 dark:bg-gray-800
            dark:text-white dark:border-gray-600
             dark:hover:text-white dark:hover:bg-gray-700 font-gmarket font-bold">수업계획표 보기</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4 font-gmarket text-center">
            {[
              { label: "이수구분", value: detailInfo.classification },
              { label: "강의실", value: detailInfo.room },
              { label: "학점", value: detailInfo.credit },
              { label: "분반", value: detailInfo.division },
              { label: "개설 학년", value: detailInfo.grade },
              { label: "교수", value: detailInfo.memberName },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="font-semibold">{item.label}</span>
                <span className={`p-2 rounded-md w-2/3 font-semibold ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-4 font-gmarket text-center">
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
                <span className={`p-2 rounded-md w-2/3  font-semibold ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          {/* 강의소개 */}
          <div className="col-span-1 md:col-span-2 overflow-auto" > 
            <h2 className="text-2xl font-bold mb-4">강의소개</h2>
            <div className={`p-4 rounded-lg w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
              <div className="relative h-64 w-full">
               <h2 className="font-gmarket">
               {detailInfo.introduction}
               </h2>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TECH 차트 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center">T.E.C.H</h2>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <div className="relative h-64 w-full">
                  <Bar data={techData} options={techOptions}  />
                </div>
              </div>
            </div>
         
        {/* 성적 비율 */}
        <div className=" items-center justify-center">
              <h2 className="text-2xl font-bold mb-4">성적 비율</h2>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <div className="relative h-64 w-full">
                  <div className="font-gmarket font-bold text-xl items-center justify-center text-center ">
                    {detailInfo.gradeRatio.split('\n').map((line, index) => (
                      <p key={index} className="mb-8">{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        
        </div>
        <div className="flex justify-end w-full mt-4">
          <button 
            className={`p-2 rounded-md bg-gray-300 hover:bg-blue-300 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-300 text-black'}`}
            data-tooltip-id="my-tooltip" data-tooltip-content="챗봇페이지로 이동"
            onClick={() => navigate(-1)}  // 뒤로가기
          >
            <FaArrowLeft />
          </button>
        </div>
        <Tooltip id="my-tooltip"/>
        <Dialog open={open} onClose={handleClose}>
         
          <DialogContent className="p-5 flex flex-col items-center justify-center dark:bg-gray-600 dark:text-white bg-gray-100 text-black">
            <div className="overflow-x-auto w-full">
              <table className="min-w-full  divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs   font-bold font-gmarket whitespace-nowrap text-gray-500 uppercase tracking-wider dark:text-white">
                      주차
                    </th>
                    <th className="px-6 py-3 text-left text-xs  text-center font-bold font-gmarket text-gray-500 uppercase tracking-wider dark:text-white">
                      수업내용
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-600 divide-y divide-gray-200">
                  {weekInfo.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold font-gmarket text-center text-gray-900 dark:text-white">
                        {row.week}
                      </td>
                      <td className="px-6 py-4 whitespace-pre-wrap text-sm font-bold dark:font-semibold font-gmarket text-gray-900 dark:text-white">
                        {row.content}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
            </div>  
          </DialogContent>
          <DialogActions className="p-4 dark:bg-gray-800 bg-gray-100">
          <button 
          onClick={handleClose}
          className="py-2.5 px-5 me-2 mb-2 text-sm  text-gray-900 focus:outline-none bg-gray-200 rounded-full border
           border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100
           dark:focus:ring-gray-700 dark:bg-gray-800
            dark:text-white dark:border-gray-600
             dark:hover:text-white dark:hover:bg-gray-700 font-gmarket font-bold justify-end ">닫기</button>
      

          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default DetailPage;
