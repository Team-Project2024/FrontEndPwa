import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Tooltip } from 'react-tooltip';
import { FaArrowLeft } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto'; 
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const DetailPage = () => {
  const { itemType, itemId } = useParams();
  const [detailInfo, setDetailInfo] = useState(null);
  const [professor, setProfessor] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();  
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [open, setOpen] = useState(false);

  const rows = [
    { week: 1, content: '전력산업 변화(2) : 가격결정발전계획과 함께 계통한계가격 결정, 가격결정발전계획의 정의, 가격결정발전계획의 수요예측, 가격결정발전계획의 수립원칙, 한계비용 및 한계가격' },
    { week: 2, content: '수업1' },
    { week: 3, content: '수업2' },
    // ...더 많은 데이터
  ];

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-slate-300 text-black'}`}>
      <div className={`rounded-lg w-full max-w-6xl p-8 items-center justify-center ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
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
          {/* 강의소개 */}
          <div className="col-span-1 md:col-span-2 overflow-auto" > 
            <h2 className="text-2xl font-bold mb-4">강의소개</h2>
            <div className={`p-4 rounded-lg w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
              <div className="relative h-64 w-full">
               <h2>
                {/* 더미데이터 */}
                                [교과목 목적]
                  본 교과목의 목적은 대학생활 적응을 돕기 위한 교과목으로, 대학생활에 필요한 기본적이고 다양한 정보와 지식을 학습하고 대학생활의 참된 방향의 모색과 자기개발 및 이를 위한 실천적 방법을 습득하도록 하는 것에 있다.

                  [수업 운영 방침]
                  1) 매주 해당 수업시간에 대면 수업으로 진행
                  2) 학교 이해, 교육과정 이해하기, 자신 이해하기 등의 다양한 주제와 활동지를 활용하여 진행 
                  3) 1주차는 ‘ICAN WEEK’ 몰입주간‘이므로 총 5번의 출결확인이 이루어지며, 출결결과는 1주차와 12~15주차에 출결 반영됨.
               </h2>
              </div>
            </div>
          </div>
          {/* TECH차트 */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">T.E.C.H</h2>
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
              <div className="relative h-64 w-full">
                <Doughnut data={techData} options={techOptions} />
              </div>
            </div>
          </div>
        
        </div>
        <Button variant="outlined" onClick={handleClickOpen}>
          수업계획표 보기
        </Button>
        <Dialog open={open} onClose={handleClose}>
      <DialogTitle className=" text-black text-center font-gmarket">수업계획표</DialogTitle>
      <DialogContent className="bg-gray-100 p-5">
        <TableContainer component={Paper}>
          <Table className="min-w-full" aria-label="schedule table">
            <TableHead className="bg-gray-300">
              <TableRow>
                <TableCell className="text-white font-bold text-center">주차</TableCell>
                <TableCell className="text-white font-bold text-center">수업내용</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.week} className="last:border-0 text-center font-gmarket">
                  <TableCell component="th" scope="row">
                    {row.week}
                  </TableCell>
                  <TableCell>{row.content}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions className="bg-gray-100 p-4">
        <Button 
          onClick={handleClose}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
      </div>
    </div>
  );
};

export default DetailPage;
