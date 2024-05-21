import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect,useContext} from "react";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import timeJSON from "../image/time.json"
import RoomJson from "../image/room.json"


const Class = () => {

  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();


    const [lecture, setLecture] = useState([]);
    const [professor,setProfessor] = useState([]);
    const [room,setRoom] = useState([]);
    const [time,setTime] = useState([]);
    const [newlectureList,setnewlectureList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lecturePerPage] = useState(300); // 페이지당 강의 수를 5개로 설정
    const [showForm, setShowForm] = useState(false); // 추가된 부분
    const [newLecture, setNewLecture] = useState({
      lectureName: "",
      classification: "",
      room: "",
      credit: 0,
      division: 0,
      grade: 0,
      lectureTime: "",
      classMethod: "",
      testType: "",
      teamwork: 0,
      entrepreneurship: 0,
      creativeThinking: 0,
      harnessingResource: 0,
      teamPlay: false,
      gradeMethod: "",
      testMethod: "",
      aiSw: false,
      course_evaluation: 0,
      memberId: ""
    });
   

    
    


    useEffect(() => {
        fetchLecture();
        getProfessor();
        setRoom(RoomJson);
        setTime(timeJSON);
      }, []);
      

      const addLectureList = () => {

        if(newLecture.lectureName  == null) {
          window.alert('강의명을  입력해주세요')
          return 0;
        }
        const newLectureRequirement = { ...newLecture };
        setnewlectureList([...newlectureList, newLectureRequirement]);
        setNewLecture({
          lectureName: "",
          classification: "",
          room: "",
          credit: 0,
          division: 0,
          grade: 0,
          lectureTime: "",
          classMethod: "",
          testType: "",
          teamwork: 0,
          entrepreneurship: 0,
          creativeThinking: 0,
          harnessingResource: 0,
          teamPlay: false,
          gradeMethod: "",
          testMethod: "",
          aiSw: false,
          course_evaluation: 0,
          memberId: ""
        });
      };
      


      const removeLectureList = (index) => {

        const updatedList = [...newlectureList];
        updatedList.splice(index,1);
        setnewlectureList(updatedList);
      }


       //setEvents(response.data.responseEventInfoDTOList);

      const fetchLecture = async () => {
        try {
          const response = await axiosPrivate.get('/admin/lecture');
         
          console.log(response.data)
            setLecture(response.data.responseLectureDTOList);
          
       
          
        } catch (error) {
          console.error('Error fetching lecture:', error);
        }
      };
    

      const getProfessor = async () => {

        try {
            const response = await axiosPrivate.get('/admin/member-professor');
            setProfessor(response.data);
            console.log(professor)
        }

          catch(error) {
            console.error('에러발생',error)
          }
        };

       

      const handleDeleteClass = async (lectureId) => {
        try {
        await axiosPrivate.put(`/admin/lecture/` + lectureId)
        fetchLecture();
        window.alert('강의삭제완료')

        }catch(error) {
            console.error('에러',error)

        }


      }

      const handleAddClass = async () => {
        try {
          await axiosPrivate.post("/admin/lecture", {
            requestLectureDTOList: newlectureList,
          });
         
          setnewlectureList([]);
          fetchLecture();
          // 강의 추가 후 폼을 숨김
          setShowForm(false);
          window.alert('추가되었습니다')
        } catch (error) {
          console.error("에러", error);
          console.log(newLecture)
        }
      };



  // 현재 페이지의 강의 계산
  const indexOfLastLecture = currentPage * lecturePerPage;
  const indexOfFirstLecture = indexOfLastLecture - lecturePerPage;
  const currentLecture = lecture.slice(indexOfFirstLecture,indexOfLastLecture);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 페이지 번호 생성



    return(
        <div className="container  flex flex-col justify-center items-center overflow-auto ">
        <h1 className="text-3xl font-bold mt-96">강의관리</h1>
      <button onClick={() => setShowForm(!showForm)}>강의 추가</button>

           <div className="mb-4">
            {showForm && (
              <div className="mt-4 p-4 border border-gray-300 rounded items-row justify-center flex flex-col">
                <h2>강의 추가</h2>
                <label>강의명:
                <input
                  type="text"
                  placeholder="강의명"
                  value={newLecture.lectureName}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, lectureName: e.target.value })
                  }
                />
                </label>
              
              <label>담당교수:
              <select
                  value={newLecture.memberId}
                  onChange={(e) =>
                    setNewLecture({ ...newLecture, memberId: e.target.value })
                  }
                >
                <option value="">교수 선택</option>
                {professor.map((professor) => (
                  <option key={professor.id} value={professor.id}>
                    {professor.name}
                  </option>
                ))}
                </select>
              </label>


              <label>강의실:
                <select
      
      value={newLecture.room}
      onChange={(e) =>
        setNewLecture({ ...newLecture, room: e.target.value })
      }
    >
       <option value={""}>강의실선택</option>
      {room.map(room => (
                    <option key={room.room} value={room.room}>
                        {room.room}
                    </option>
                ))}
    </select>
                </label>



                <label>강의시간:
                <select
      
      value={newLecture.lectureTime}
      onChange={(e) =>
        setNewLecture({ ...newLecture, lectureTime: e.target.value })
      }
    >
      <option value={""}>강의시간선택</option>
      {time.map(time => (
                    <option key={time.lecture_time} value={time.lecture_time}>
                        {time.lecture_time}
                    </option>
                ))}
    
    </select>
                </label>
               
                <label>학점:
                <select
      
      value={newLecture.credit}
      onChange={(e) =>
        setNewLecture({ ...newLecture, credit: e.target.value })
      }
    >
      
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
    
    </select>
                </label>
             

<label>분류:

<select
  value={newLecture.classification}
  onChange={(e) =>
    setNewLecture({ ...newLecture, classification: e.target.value })
  }
>
 
  <option value="전공공통">전공공통</option>
  <option value="자유선택">자유선택</option>
  <option value="일반교양1">일반교양1</option>
  <option value="일반교양2">일반교양2</option>
  <option value="일반교양3">일반교양3</option>
  <option value="일반교양4">일반교양4</option>

</select>

</label>

<label>분반:
<select
  value={newLecture.divison}
  onChange={(e) =>
    setNewLecture({ ...newLecture, division: e.target.value })
  }
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

<label>학년:
<select
  value={newLecture.grade}
  onChange={(e) =>
    setNewLecture({ ...newLecture, grade: e.target.value })
  }
>
 
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>3</option>
  <option value={4}>4</option>

</select>
</label>


<label>수업방식:
<select
  value={newLecture.classMethod}
  onChange={(e) =>
    setNewLecture({ ...newLecture, classMethod: e.target.value })
  }
>
  
  <option value="대면">대면</option>
  <option value="사이버">사이버</option>
  <option value="하이브리드">하이브리드</option>
  <option value="비대면">비대면</option>

</select>
</label>

<label>시험방식:
<select
  value={newLecture.testType}
  onChange={(e) =>
    setNewLecture({ ...newLecture, testType: e.target.value })
  }
>
  
  <option value="과제 대체">과제대체</option>
  <option value="실습, 발표 대체">실습, 발표 대체</option>
  <option value="시험2번">시험2번</option>
  <option value="시험1번, 레포트1번">시험1번, 레포트1번</option>

</select>
</label>

<label>팀워크:
<select
  value={newLecture.teamwork}
  onChange={(e) =>
    setNewLecture({ ...newLecture, teamwork: e.target.value })
  }
>
  
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>3</option>
  <option value={4}>4</option>

</select>
</label>

<label>enter:
<select
  value={newLecture.entrepreneurship}
  onChange={(e) =>
    setNewLecture({ ...newLecture, entrepreneurship: e.target.value })
  }
>
 
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>3</option>
  <option value={4}>4</option>
 
</select>
</label>



<label>창의:
<select
  value={newLecture.creativeThinking}
  onChange={(e) =>
    setNewLecture({ ...newLecture, creativeThinking: e.target.value })
  }
>
 
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>3</option>
  <option value={4}>4</option>
 
</select>
</label>

<label>harnessingResource:
<select
  value={newLecture.harnessingResource}
  onChange={(e) =>
    setNewLecture({ ...newLecture, harnessingResource: e.target.value })
  }
>
 
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>3</option>
  <option value={4}>4</option>
 
</select>

</label>


<label>조별과제:
<select
  value={newLecture.teamPlay}
  onChange={(e) =>
    setNewLecture({ ...newLecture, teamPlay: e.target.value })
  }
>
 
  <option value={false}>없음</option>
  <option value={true}>있음</option>
 
 
</select>

</label>


<label>채점방식:
<select
  value={newLecture.gradeMethod}
  onChange={(e) =>
    setNewLecture({ ...newLecture, gradeMethod: e.target.value })
  }
>
 
  <option value={"상대평가"}>상대평가</option>
  <option value={"절대평가"}>절대평가</option>
  <option value={"PF"}>PF</option>
 
 
</select>

</label>


<label>aisw:
<select
  value={newLecture.aiSw}
  onChange={(e) =>
    setNewLecture({ ...newLecture, aiSw: e.target.value })
  }
>
 
  <option value={false}>해당없음</option>
  <option value={true}>해당됨</option>
 
 
</select>

</label>


<label>강의평가:
<select
  value={newLecture.course_evaluation}
  onChange={(e) =>
    setNewLecture({ ...newLecture, course_evaluation: e.target.value })
  }
>
 
  <option value={0}>0</option>
  <option value={1}>1</option>
 
 
</select>

</label>

{newlectureList.map((newlectureList, index) => (
          <div key={index}>
            <label>추가된강의: {newlectureList.lectureName}</label>
           
            <button className="border-4 ml-3 bg-slate-300"onClick={() => removeLectureList(index)}>삭제</button>
          </div>
        ))}

                
              </div>
            )}

        </div>
        <button onClick={addLectureList}>추가리스트에 넣기</button>
                <button onClick={handleAddClass}>추가된 강의리스트 제출</button>


        <div className="flex flex-col justify-center border p-4 overflow-auto ml-10  items-center  h-auto   w-auto">
        
        
        <div >
  {currentLecture.map(lecture => (
    <div key={lecture.lectureId} className="flex flex-col border  ">
      <div className="mb-2">
        <label className="text-gray-600">강의명: </label>
        <span>{lecture.lectureName}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">분류: </label>
        <span>{lecture.classification}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">강의실: </label>
        <span>{lecture.room}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">학점: </label>
        <span>{lecture.credit}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">분반: </label>
        <span>{lecture.division}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">학년: </label>
        <span>{lecture.grade}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">강의시간: </label>
        <span>{lecture.lectureTime}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">수업방식: </label>
        <span>{lecture.classMethod}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">시험방식: </label>
        <span>{lecture.testType}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">팀워크: </label>
        <span>{lecture.teamwork}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">enter: </label>
        <span>{lecture.entrepreneurship}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">창의: </label>
        <span>{lecture.creativeThinking}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">harnessingResource: </label>
        <span>{lecture.harnessingResource}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">조별과제: </label>
        <span>{lecture.teamPlay.toString()}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">채점방식: </label>
        <span>{lecture.gradeMethod}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">aisw: </label>
        <span>{lecture.aiSw.toString()}</span>
      </div>
      <div className="mb-2">
        <label className="text-gray-600">강의평가: </label>
        <span>{lecture.course_evaluation}</span>
      </div>
      <button onClick={() => handleDeleteClass(lecture.lectureId)} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">강의 삭제</button>
    </div>
  ))}
</div>

<ul className="flex justify-center ">
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
       
     

  {/* <div className="flex justify-center items-center overflow-auto">
 
  <button
    onClick={handlePrevbtn}
    disabled={currentPage === 1}
    className="mr-2 px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
  >
    이전
  </button>

 
  <ul className="flex">
   
    {Array.from({ length: Math.ceil(lecture.length / lecturePerPage) }).map(
      (_, index) => {
        
        if (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2) {
          return (
            <li key={index} className="mx-1">
              <button
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 hover:bg-blue-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                {index + 1}
              </button>
            </li>
          );
        } else {
          return null; 
        }
      }
    )}
  </ul>

 
  <button
    onClick={handleNextbtn}
    disabled={currentPage === Math.ceil(lecture.length / lecturePerPage)}
    className="ml-2 px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
  >
    다음
  </button>
</div> */}

</div>
     
      </div>




    )
}


export default Class 