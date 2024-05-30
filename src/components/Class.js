import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import timeJSON from "../image/time.json";
import RoomJson from "../image/room.json";
import { FaTrashAlt,FaPlus,FaMinus } from "react-icons/fa";

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
    memberId: ""
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
      window.alert("강의명을 입력해주세요");
      return;
    }
    console.log(newLectureList)
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
      memberId: ""
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
      console.log(response)
      setLecture(response.data.responseLectureDTOList);

    } catch (error) {
      console.error("Error fetching lecture:", error);
    }
  };

  const getProfessor = async () => {
    try {
      const response = await axiosPrivate.get("/admin/member-professor");
      console.log(response.data);
      setProfessor(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("에러발생", error);
    }
  };

  const handleDeleteClass = async (lectureId) => {
    try {
      await axiosPrivate.put(`/admin/lecture/` + lectureId);
      fetchLecture();
      window.alert("강의 삭제 완료");
    } catch (error) {
      console.error("에러", error);
    }
  };

  const handleAddClass = async () => {
    try {
      console.log("Sending new lecture list:", newLectureList);
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
          memberId: lecture.memberId
        }))
      });
      console.log("Response from server:", response);
      setNewLectureList([]);
      fetchLecture();
      setShowForm(false);
      window.alert("추가되었습니다");
    } catch (error) {
      console.error("에러", error.response ? error.response.data : error.message);
    }
  };

  const indexOfLastLecture = currentPage * lecturePerPage;
  const indexOfFirstLecture = indexOfLastLecture - lecturePerPage;
  const currentLecture = lecture
    .filter((lec) =>
      lec.lectureName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstLecture, indexOfLastLecture);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">강의 관리</h1>
        <input
          type="text"
          placeholder="강의명 검색"
          className="p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex justify-end mb-4">
      <button
                        onClick={() => {
                        
                          setShowForm(!showForm);
                        }}
                        className="text-2xl text-blue-500 dark:text-gray-200 cursor-pointer ml-2"
                      >
                       {showForm ? <FaMinus className="mr-1 text-red-500" /> : <FaPlus className="mr-1 text-blue-600"  />}
                      </button>
      </div>

      {showForm && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold mb-4">강의 추가</h2>
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
                {professor.map((prof) => (
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
          </div>

          <div className="flex flex-row justify-center item">
        <button
            className="w-1/2   align-middle  text-xl select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none  py-3 px-6 rounded-lg bg-gradient-to-tr from-gray-700 to-gray-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85]"
            onClick={addLectureList}
          >
            졸업요건 제출
          </button>
        
        </div>
        </div>
      )}
      {newLectureList.length > 0 && (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-2xl font-bold mb-4">추가된 강의 목록</h2>
    <ul className="list-disc pl-5">
      {newLectureList.map((lecture, index) => (
        <li key={index} className="font-gmarket flex justify-between items-center">
          <span>{lecture.lectureName}</span>
          <button
            onClick={() => removeLectureList(index)}
            className="text-red-500 ml-4"
          >
            <FaTrashAlt />
          </button>

          
        </li>
      ))}
    </ul>

<div className="flex flex-row justify-center item">
<button
            className="w-1/3   align-middle  text-xl select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none  py-3 px-6 rounded-lg bg-gradient-to-tr from-gray-700 to-gray-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85]"
            onClick={handleAddClass}
          >
            추가된 강의리스트 제출
          </button>
  </div>
   
  </div>
)}

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
    </div>
  );
};

export default Class;
