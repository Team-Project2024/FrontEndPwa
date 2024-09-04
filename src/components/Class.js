import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import timeJSON from "../image/time.json";
import RoomJson from "../image/room.json";
import { FaTrashAlt, FaPlus, FaMinus ,FaSearch , FaUndo } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Tooltip } from 'react-tooltip';

const Class = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();

  const [lecture, setLecture] = useState([]);
  const [professor, setProfessor] = useState([]);
  const [room, setRoom] = useState([]);
  const [time, setTime] = useState([]);
  const [newLectureList, setNewLectureList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lecturePerPage] = useState(20);
  const [showForm, setShowForm] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [emptyOpen, setEmptyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);

  const [newLecture, setNewLecture] = useState({
    lectureName: "",
    classification: "전공공통",
    room: "",
    credit: 1,
    division: 1,
    grade: 1,
    lectureTime: "",
    classMethod: "대면",
    testType: "과제 대체",
    teamwork: 1,
    entrepreneurship: 1,
    creativeThinking: 1,
    harnessingResource: 1,
    teamPlay: false,
    gradeMethod: "상대평가",
    aiSw: false,
    course_evaluation: 1,
    memberId: "",
    introduction: "",
    gradeRatio: [{ name: "", value: 0 }]
  });

  useEffect(() => {
    fetchLecture(1); // 첫 페이지를 로드할 때 page=1 사용
    getProfessor();
    setRoom(RoomJson);
    setTime(timeJSON);
  }, []);

  const addLectureList = () => {
    const newLectureRequirement = { ...newLecture };
    if (newLectureRequirement.lectureName === "") {
      setEmptyOpen(!addOpen);
      return;
    }

    if (RatioSum() !== 100) {
      alert("요소비율의 합은 100%로 맞춰주세요");
      return;
    }

    setNewLectureList([...newLectureList, newLectureRequirement]);
    setNewLecture({
      lectureName: "",
      classification: "전공공통",
      room: "",
      credit: 1,
      division: 1,
      grade: 1,
      lectureTime: "",
      classMethod: "대면",
      testType: "과제 대체",
      teamwork: 1,
      entrepreneurship: 1,
      creativeThinking: 1,
      harnessingResource: 1,
      teamPlay: false,
      gradeMethod: "상대평가",
      aiSw: false,
      course_evaluation: 1,
      memberId: "",
      introduction: "",
      gradeRatio: [{ name: "", value: 0 }]
    });
  };

  const removeLectureList = (index) => {
    const updatedList = [...newLectureList];
    updatedList.splice(index, 1);
    setNewLectureList(updatedList);
  };

  const fetchLecture = async (page) => {
    try {
      const response = await axiosPrivate.get(`/admin/lecture?page=${page - 1}&keyword=`);
      setLecture(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("강의불러오기 에러:", error);
    }
  };

  const searchLecture = async (page) => {
    try {
      const response = await axiosPrivate.get(`/admin/lecture?page=${page - 1}&keyword=${searchWord}`);
      setLecture(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("강의검색에러", error);
    }
  };

  const resetSearch = () => {
    setSearchWord("");
    fetchLecture(1);
  };

  const getProfessor = async () => {
    try {
      const response = await axiosPrivate.get("/admin/member-professor");
      setProfessor(response.data.professorDTOList);
    } catch (error) {
      console.error("에러발생", error);
    }
  };

  const handleDeleteClass = async (lectureId) => {
    try {
      await axiosPrivate.put(`/admin/lecture/${lectureId}`);
      fetchLecture(currentPage);
      setDeleteOpen(!deleteOpen);
    } catch (error) {
      console.error("에러", error);
    }
  };

  const handleAddClass = async () => {
    try {
      await axiosPrivate.post("/admin/lecture", {
        requestLectureDTOList: newLectureList.map(lecture => ({
          lectureName: lecture.lectureName,
          classification: lecture.classification,
          room: lecture.room,
          credit: lecture.credit,
          division: lecture.division,
          grade: lecture.grade,
          lectureTime: lecture.lectureTime,
          classMethod: lecture.classMethod,
          testType: lecture.testType,
          teamwork: lecture.teamwork,
          entrepreneurship: lecture.entrepreneurship,
          creativeThinking: lecture.creativeThinking,
          harnessingResource: lecture.harnessingResource,
          teamPlay: lecture.teamPlay,
          gradeMethod: lecture.gradeMethod,
          aiSw: lecture.aiSw,
          course_evaluation: lecture.course_evaluation,
          memberId: lecture.memberId,
          introduction: lecture.introduction,
          gradeRatio: lecture.gradeRatio.map(ratio => `${ratio.name} ${ratio.value}%`).join(' ')
        }))
      });

      setNewLectureList([]);
      fetchLecture(currentPage);
      setShowForm(false);
      setAddOpen(!addOpen);
      setIsAdd(!isAdd);
    } catch (error) {
      console.error("에러", error.response ? error.response.data : error.message);
    }
  };

  const handleAddGradeRatio = () => {
    setNewLecture(prevState => ({
      ...prevState,
      gradeRatio: [...prevState.gradeRatio, { name: "", value: 0 }]
    }));
  };

  const handleRemoveGradeRatio = (index) => {
    setNewLecture(prevState => ({
      ...prevState,
      gradeRatio: prevState.gradeRatio.filter((_, i) => i !== index)
    }));
  };

  const handleGradeRatioChange = (index, field, value) => {
    const updatedGradeRatio = [...newLecture.gradeRatio];
    updatedGradeRatio[index][field] = field === "value" ? parseInt(value) : value;
    setNewLecture(prevState => ({ ...prevState, gradeRatio: updatedGradeRatio }));
  };

  const RatioSum = () => {
    return newLecture.gradeRatio.reduce((total, ratio) => total + ratio.value, 0);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (searchWord) {
      searchLecture(pageNumber);
    } else {
      fetchLecture(pageNumber);
    }
  };

  const handleAddClose = () => {
    setAddOpen(false);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleEmptyClose = () => {
    setEmptyOpen(false);
  };

  const renderPageNumbers = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          onClick={() => paginate(i)}
          className={`cursor-pointer mx-1 px-2 py-1 rounded-full ${currentPage === i ? "bg-blue-500 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-200"} text-xs sm:text-sm`}
        >
          {i}
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto p-4 items-center">
      <div className="flex justify-center items-center">
        <h1 className="font-gmarket text-4xl md:text-6xl font-bold mt-8 sm:mt-0 mb-4 sm:mb-8 text-center">강의 관리</h1>
      </div>

      <div className="flex flex-wrap mb-4">

      
        <input
          type="text"
          placeholder="강의명 검색"
          className="p-2 border border-gray-300 rounded-md w-auto ml-3"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
        />

        <div>
        <button
          onClick={() => searchLecture(1)}
          className="ml-3 mt-3 text-xl text-blue-500 dark:text-gray-200 cursor-pointer mr-4"
          
        >
        <FaSearch className=" text-blue-500 hover:text-blue-600 "
         data-tooltip-id="my-tooltip" data-tooltip-content="검색하기"/>
          
        </button>
        <button
          onClick={resetSearch}
          className="text-xl mt-3 text-blue-500 dark:text-gray-200 cursor-pointer "
        >
           <FaUndo className="text-blue-500 hover:text-blue-600 "
            data-tooltip-id="my-tooltip" data-tooltip-content="초기화"/>
          
        </button>


        </div>
        <Tooltip id="my-tooltip" />
       

        
      
        <button
          onClick={() => {
            setShowForm(!showForm);
            setIsAdd(!isAdd);
          }}
          className="text-2xl text-blue-500 dark:text-gray-200 cursor-pointer ml-auto"
        >
          {showForm ? <FaMinus className="text-red-500 hover:text-red-600" /> : <FaPlus className="text-blue-500 hover:text-blue-600" />}
        </button>
      </div>

      {showForm && (
        <>
          <div className="bg-gray-100 p-6 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] mb-6">
            <h2 className="font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">강의 추가</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="font-gmarket">
                강의명:
                <input
                  type="text"
                  placeholder="강의명"
                  value={newLecture.lectureName}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, lectureName: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-md w-full"
                />
              </label>
              <label className="font-gmarket">
                담당교수:
                <select
                  value={newLecture.memberId}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, memberId: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value="">교수 선택</option>
                  {professor && professor.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-gmarket">
                강의실:
                <select
                  value={newLecture.room}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, room: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value="">강의실 선택</option>
                  {room.map((r) => (
                    <option key={r.room} value={r.room}>
                      {r.room}
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-gmarket">
                강의시간:
                <select
                  value={newLecture.lectureTime}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, lectureTime: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value="">강의시간 선택</option>
                  {time.map((t) => (
                    <option key={t.lecture_time} value={t.lecture_time}>
                      {t.lecture_time}
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-gmarket">
                학점:
                <select
                  value={newLecture.credit}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, credit: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
              <label className="font-gmarket">
                분류:
                <select
                  value={newLecture.classification}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, classification: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value="전공공통">전공공통</option>
                  <option value="자유선택">자유선택</option>
                  <option value="일반교양1">일반교양1</option>
                  <option value="일반교양2">일반교양2</option>
                  <option value="일반교양3">일반교양3</option>
                  <option value="일반교양4">일반교양4</option>
                </select>
              </label>
              <label className="font-gmarket">
                분반:
                <select
                  value={newLecture.division}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, division: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                  <option value={6}>6</option>
                  <option value={7}>7</option>
                  <option value={8}>8</option>
                </select>
              </label>
              <label className="font-gmarket">
                학년:
                <select
                  value={newLecture.grade}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, grade: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
              <label className="font-gmarket">
                수업방식:
                <select
                  value={newLecture.classMethod}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, classMethod: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value="대면">대면</option>
                  <option value="사이버">사이버</option>
                  <option value="하이브리드">하이브리드</option>
                  <option value="비대면">비대면</option>
                </select>
              </label>
              <label className="font-gmarket">
                시험방식:
                <select
                  value={newLecture.testType}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, testType: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value="과제 대체">과제 대체</option>
                  <option value="실습, 발표 대체">실습, 발표 대체</option>
                  <option value="시험2번">시험 2번</option>
                  <option value="시험1번, 레포트1번">시험 1번, 레포트 1번</option>
                </select>
              </label>
              <label className="font-gmarket">
                팀워크:
                <select
                  value={newLecture.teamwork}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, teamwork: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
              <label className="font-gmarket">
                기업가정신:
                <select
                  value={newLecture.entrepreneurship}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, entrepreneurship: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
              <label className="font-gmarket">
                창의적 사고:
                <select
                  value={newLecture.creativeThinking}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, creativeThinking: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
              <label className="font-gmarket">
                자원활용:
                <select
                  value={newLecture.harnessingResource}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, harnessingResource: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                </select>
              </label>
              <label className="font-gmarket">
                조별과제:
                <select
                  value={newLecture.teamPlay}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, teamPlay: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={false}>없음</option>
                  <option value={true}>있음</option>
                </select>
              </label>
              <label className="font-gmarket">
                채점방식:
                <select
                  value={newLecture.gradeMethod}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, gradeMethod: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value="상대평가">상대평가</option>
                  <option value="절대평가">절대평가</option>
                  <option value="PF">PF</option>
                </select>
              </label>
              <label className="font-gmarket">
                AISW:
                <select
                  value={newLecture.aiSw}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, aiSw: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={false}>해당없음</option>
                  <option value={true}>해당됨</option>
                </select>
              </label>
              <label className="font-gmarket">
                강의평가:
                <select
                  value={newLecture.course_evaluation}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, course_evaluation: e.target.value })
                  }
                  className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
                >
                  <option value={0}>0</option>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={25}>25</option>
                  <option value={30}>30</option>
                  <option value={35}>35</option>
                  <option value={40}>40</option>
                  <option value={45}>45</option>
                  <option value={50}>50</option>
                  <option value={55}>55</option>
                  <option value={60}>60</option>
                  <option value={65}>65</option>
                  <option value={70}>70</option>
                  <option value={75}>75</option>
                  <option value={80}>80</option>
                  <option value={85}>85</option>
                  <option value={90}>90</option>
                  <option value={95}>95</option>
                  <option value={100}>100</option>
                </select>
              </label>
            </div>
            <label className="font-gmarket">
              강의소개:
              <textarea
                value={newLecture.introduction}
                onChange={(e) => setNewLecture({ ...newLecture, introduction: e.target.value })}
                className="ml-3 mb-4 p-2 border border-gray-300 rounded-md w-full h-32 resize-none"
              />
            </label>

            <h3 className="font-gmarket mb-2 text-left">성적비율:</h3>
            <div className="bg-white ml-3 p-4 rounded-lg mt-4 mb-4 border border border-gray-300 text-center">
              {newLecture.gradeRatio.map((ratio, index) => (
                <div key={index} className="flex items-center justify-center mb-2">
                  <input
                    type="text"
                    placeholder="항목"
                    value={ratio.name}
                    onChange={(e) => handleGradeRatioChange(index, "name", e.target.value)}
                    className="font-gmarket mr-2 p-2 border border-gray-300 rounded-md w-1/3"
                  />
                  <input
                    type="number"
                    placeholder="비율(%)"
                    value={ratio.value}
                    onChange={(e) => handleGradeRatioChange(index, "value", e.target.value)}
                    className="font-gmarket mr-2 p-2 border border-gray-300 rounded-md w-1/3"
                  />
                  <button onClick={() => handleRemoveGradeRatio(index)} className="text-red-500 hover:text-red-600">
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddGradeRatio}
                className="text-blue-500 hover:text-blue-600 flex items-center mt-2 justify-center"
              >
                <FaPlus className="mr-1" /> 항목 추가
              </button>
            </div>

            <div className="flex flex-row justify-center items-center">
              <button
                className="w-full md:w-1/2 text-l md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85"
                onClick={addLectureList}
              >
                추가
              </button>
            </div>
          </div>

          {newLectureList.length > 0 && (
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
              <h2 className="font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">리스트</h2>
              <ul className="list-disc">
                {newLectureList.map((lecture, index) => (
                  <div key={index} className="mb-4 md:mb-6 p-4 md:p-6 bg-white border-2 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] border-dashed border-gray-400">
                    <div className="flex flex-row justify-between ml-2">
                      <span className="text-md md:text-xl font-gmarket">{lecture.lectureName}</span>
                      <button
                        onClick={() => removeLectureList(index)}
                        className="text-xl md:text-2xl text-red-500 hover:text-red-600 cursor-pointer ml-2"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
              </ul>

              <div className="flex flex-row justify-center items-center">
                <button
                  className="w-full md:w-1/2 text-l md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85"
                  onClick={handleAddClass}
                >
                  리스트 전송
                </button>
              </div>
            </div>
          )}
        </>
      )}

{isAdd === false && (
  <>
    <div className="grid grid-cols-1 gap-4">
      {lecture && lecture.length > 0 ? (
        lecture.map((lecture) => (
          <div key={lecture.lectureId} className="bg-gray-200 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-2xl font-bold mb-4 text-center font-gmarket">{lecture.lectureName}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-gmarket">
              {[
                { label: "교수명", value: lecture.memberName },
                { label: "팀워크", value: lecture.teamwork },
                { label: "분류", value: lecture.classification },
                { label: "기업가정신", value: lecture.entrepreneurship },
                { label: "강의실", value: lecture.room },
                { label: "창의적 사고", value: lecture.creativeThinking },
                { label: "학점", value: lecture.credit },
                { label: "자원활용", value: lecture.harnessingResource },
                { label: "분반", value: lecture.division },
                { label: "조별과제", value: lecture.teamPlay ? "있음" : "없음" },
                { label: "학년", value: lecture.grade },
                { label: "채점방식", value: lecture.gradeMethod },
                { label: "강의시간", value: lecture.lectureTime },
                { label: "AISW", value: lecture.aiSw ? "있음" : "없음" },
                { label: "수업방식", value: lecture.classMethod },
                { label: "강의평가", value: lecture.course_evaluation },
                { label: "시험방식", value: lecture.testType },
                { label: "성적비율", value: lecture.gradeRatio },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="font-semibold text-gray-600 mb-2">{item.label}</span>
                  <span className="p-2 border border-gray-300 rounded-full bg-white text-center">
                    {item.value === null || item.value === undefined || item.value === "null" || item.value === "" ? '입력안됨' : item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <span className="font-semibold text-gray-600 mb-2 block">강의소개</span>
              <div className="p-2 border border-gray-300 rounded bg-white text-left h-auto max-h-32 overflow-auto font-gmarket">
                {lecture.introduction === null || lecture.introduction === undefined || lecture.introduction === "null" || lecture.introduction === "" ? '입력안됨' : lecture.introduction}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDeleteClass(lecture.lectureId)}
                className="text-2xl text-red-500 dark:text-gray-200 cursor-pointer ml-2"
              >
                <FaTrashAlt className="mr-1" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center font-gmarket text-gray-600">검색요건에 충족하는 강의가 없습니다.</p>
      )}
    </div>

    <ul className="flex justify-center mt-6">
      {currentPage > 1 && (
        <li
          onClick={() => paginate(currentPage - 1)}
          className="cursor-pointer mx-1 px-2 py-1 rounded-full bg-gray-200 hover:bg-blue-200 text-xs sm:text-sm"
        >
          &lt;
        </li>
      )}
      {renderPageNumbers()}
      {currentPage < totalPages && (
        <li
          onClick={() => paginate(currentPage + 1)}
          className="cursor-pointer mx-1 px-2 py-1 rounded-full bg-gray-200 hover:bg-blue-200 text-xs sm:text-sm"
        >
          &gt;
        </li>
      )}
    </ul>
  </>
)}


      <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm"
        PaperProps={{ className: "bg-white w-auto" }}>
        <DialogTitle as="h3" className="text-xl text-bold bg-gray-200 font-gmarket text-start mb-2">강의추가 성공</DialogTitle>
        <DialogContent className="text-start font-gmarket mb-4">
          강의 리스트가 추가되었습니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={emptyOpen} onClose={handleEmptyClose}>
        <DialogTitle>강의명 비어있음</DialogTitle>
        <DialogContent>
          강의명이 입력되지 않았습니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmptyClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>강의실 배정삭제 완료</DialogTitle>
        <DialogContent>
          선택한 강의의 강의실을 비웠습니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Class;
