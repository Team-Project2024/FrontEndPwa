import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import timeJSON from "../image/time.json";
import RoomJson from "../image/room.json";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CreditChart from './CreditChart';

const Class = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();

  const [lecture, setLecture] = useState([]);
  const [professor, setProfessor] = useState([]);
  const [room, setRoom] = useState([]);
  const [time, setTime] = useState([]);
  const [newLectureList, setNewLectureList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lecturePerPage] = useState(300);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [emptyOpen, setEmptyOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [isAdd,setIsAdd] = useState(false); //강의추가폼 열리면 강의리스트 숨김용

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
    gradeRatio: [{ name: "", value: 0 }] //추가
  });

  useEffect(() => {
    fetchLecture();
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
      gradeRatio: [{ name: "", value: 0 }] //추가
    });
  };

  const removeLectureList = (index) => {
    const updatedList = [...newLectureList];
    updatedList.splice(index, 1);
    setNewLectureList(updatedList);
  };

  const fetchLecture = async () => {
    try {
      const response = await axiosPrivate.get("/admin/lecture");
      
      setLecture(response.data.responseLectureDTOList);

    } catch (error) {
      console.error("Error fetching lecture:", error);
    }
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
      await axiosPrivate.put(`/admin/lecture/` + lectureId);
      fetchLecture();
      setDeleteOpen(!deleteOpen);
    } catch (error) {
      console.error("에러", error);
    }
  };

  const handleAddClass = async () => {
    try {
      //console.log("Sending new lecture list:", newLectureList);
      const response = await axiosPrivate.post("/admin/lecture", {
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
      console.log("Response from server:", response);
      setNewLectureList([]);
      fetchLecture();
      setShowForm(false);
      setAddOpen(!addOpen);
      setIsAdd(!isAdd);
    } catch (error) {
      console.error("에러", error.response ? error.response.data : error.message);
    }
  };

//  비율관련 함수들 추가
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

  const indexOfLastLecture = currentPage * lecturePerPage;
  const indexOfFirstLecture = indexOfLastLecture - lecturePerPage;
  const currentLecture = lecture
    .filter((lec) =>
      lec.lectureName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstLecture, indexOfLastLecture);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  const handleAddClose = () => {
    setAddOpen(false);
  }

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  }

  const handleEmptyClose = () => {
    setEmptyOpen(false);
  }


  return (//!!!!!!!!!!!!!!!!!!!! lg:bg-gray-600 font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center
    
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center"> 
        <h1 className="font-gmarket text-4xl md:text-6xl font-bold mt-8 sm:mt-0 mb-4 sm:mb-8 text-center">강의 관리</h1>
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="강의명 검색"
          className="p-2 border border-gray-300 rounded-md "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => {

            setShowForm(!showForm);
            setIsAdd(!isAdd);}} //추가
          className="text-2xl text-blue-500 dark:text-gray-200 cursor-pointer ml-2"
        >
          {showForm ? <FaMinus className="mr-1 text-red-500 hover:text-red-600" /> : <FaPlus className="mr-1 text-blue-500 hover:text-blue-600"  />}
        </button>
      </div>

      {showForm && (//bg-gray-100  rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)]   p-4 md:p-8 w-full max-w-xl
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
                  {professor && professor.map((prof) => (// professor && 추가
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
                  value={newLecture.gradeMethod}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, gradeMethod: e.target.value })
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
                  <option value={1}>1</option>
                </select>
              </label>

              <label className="font-gmarket">
              강의소개:
              <input
                value={newLecture.introduction}
                onChange={(e) => setNewLecture({ ...newLecture, introduction: e.target.value })}
                className="ml-3 mb-4 p-2 border border-gray-300 rounded-full w-full"
              />
            </label>
            </div>

            <div className="bg-gray-200 p-4 rounded-lg mt-4"//추가
            > 
            <h3 className="text-xl font-bold mb-2">성적 비율</h3>
            {newLecture.gradeRatio.map((ratio, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="항목"
                  value={ratio.name}
                  onChange={(e) => handleGradeRatioChange(index, "name", e.target.value)}
                  className="mr-2 p-2 border border-gray-300 rounded-md w-1/3"
                />
                <input
                  type="number"
                  placeholder="비율(%)"
                  value={ratio.value}
                  onChange={(e) => handleGradeRatioChange(index, "value", e.target.value)}
                  className="mr-2 p-2 border border-gray-300 rounded-md w-1/3"
                />
                <button onClick={() => handleRemoveGradeRatio(index)} className="text-red-500">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddGradeRatio}
              className="text-blue-500 flex items-center mt-2"
            >
              <FaPlus className="mr-1" /> 항목 추가
            </button>
          </div> 

            <div className="flex flex-row justify-center item">
              <button //w-full md:w-1/2 text-sm md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85
                className="w-full md:w-1/2 text-sm md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85"
                onClick={addLectureList}
              >
                추가
              </button>

            </div>
          </div>

          {newLectureList.length > 0 && ( //font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center
            <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
              <h2 className="font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">리스트</h2>
              <ul className="list-disc">
                {newLectureList.map((lecture, index) => (
                  <div key={index} className="mb-4 md:mb-6 p-4 md:p-6   hover:scale-105     bg-white border-2 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] border-dashed border-gray-400">
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

              <div className="flex flex-row justify-center item">
                <button //w-full md:w-1/2 text-sm md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85
                  className="w-full md:w-1/2 text-sm md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85"
                  onClick={handleAddClass}
                >
                  리스트 전송
                </button>
              </div>
            </div>
          )}
          
        </>
      )}
      
           {/* 강의추가폼 열린상태면 비활성 */}
           {isAdd === false &&(
              <>
              <div className="grid grid-cols-1 gap-4">
              {currentLecture.map((lecture) => (
                <div key={lecture.lectureId} className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
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
                      { label: "강의소개", value: lecture.introduction },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col">
                        <span className="font-semibold text-gray-600 mb-2">{item.label}</span>
                        <span className="p-2 border border-gray-300 rounded-full bg-white text-center">
                          {item.value === null || item.value === undefined || item.value === "null" || item.value === "" ? '입력안됨' : item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => handleDeleteClass(lecture.lectureId)}
                      className="text-2xl text-red-500 dark:text-gray-200 cursor-pointer ml-2"
                    >
                      <FaTrashAlt className="mr-1" />
                    </button>
                  </div>
                </div>
              ))}
              </div>

              <ul className="flex justify-center mt-6">
              {Array.from({ length: Math.ceil(lecture.length / lecturePerPage) }).map(
                (_, index) => (
                  <li
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`cursor-pointer mx-1 ${
                      currentPage === index + 1 ? "font-bold" : ""
                    }`}
                  >
                    {index + 1}
                  </li>
                )
              )}
              </ul>


              </>
              )}



      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>강의추가 성공</DialogTitle>
        <DialogContent>
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
          강의명이 입력되지않았습니다.
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
