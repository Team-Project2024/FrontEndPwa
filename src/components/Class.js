import React from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect,useContext} from "react";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import timeJSON from "../image/time.json"
import RoomJson from "../image/room.json"


const Class = () => {

    const [lecture, setLecture] = useState([]);
    const [professor,setProfessor] = useState([]);
    const [room,setRoom] = useState([]);
    const [time,setTime] = useState([]);
    const [newlectureList,setnewlectureList] = useState([]);
   

    const { auth } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate();
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
    const [showForm, setShowForm] = useState(false); // 추가된 부분


    useEffect(() => {
        fetchLecture();
        getProfessor();
        setRoom(RoomJson);
        setTime(timeJSON);
      }, []);

      const addLectureList = () => {

        const newLectureRequirement = {...newLecture};
        setnewlectureList([...newlectureList,newLectureRequirement]);
        setLecture({
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
        })

      }


      const removeLectureList = (index) => {

        const updatedList = [...newlectureList];
        updatedList.splice(index,1);
        setnewlectureList(updatedList);
      }


      const submitLectureList = async () => {
        try{
         
          await axiosPrivate.post("/admin/lecture", {
            requestLectureDTOList: [newlectureList]
          });
          window.alert('성공');
          console.log(newlectureList);

        }catch(error){
          console.error('에러가 발생하였습니다');
        }

      }

      const fetchLecture = async () => {
        try {
          const response = await axiosPrivate.get('/admin/lecture');
          setLecture(response.data);
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
        await axiosPrivate.put(`/admin/lecture?lectureId=${lectureId}`)
        fetchLecture();

        }catch(error) {
            console.error('에러',error)

        }


      }

      const handleAddClass = async () => {
        try {
          await axiosPrivate.post("/admin/lecture", {
            requestLectureDTOList: [newLecture]
          });
          fetchLecture();
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
            aiSw: false,
            course_evaluation: 0,
            memberId: ""
          });
          // 강의 추가 후 폼을 숨김
          setShowForm(false);
          window.alert('추가되었습니다')
        } catch (error) {
          console.error("에러", error);
          console.log(newLecture)
        }
      };
    

    return(
        <div>
         {/* 강의 추가 버튼 */}
      <button onClick={() => setShowForm(!showForm)}>강의 추가</button>

            {/* 강의 추가 폼 */}
            {showForm && (
              <div className="flex flex-col">
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
      <option value={""}>학점선택</option>
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
  <option value="">분류 선택</option>
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
  <option value="">분반 선택</option>
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
  <option value="">학년 선택</option>
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
  <option value="">수업방식 선택</option>
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
  <option value="">시험방식 선택</option>
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
  <option value="">팀워크</option>
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
  <option value="">entrepreneurship</option>
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
  <option value="">creativeThinking</option>
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
  <option value="">harnessingResource</option>
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
  <option value="">조별과제 유무</option>
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
  <option value="">채점방식</option>
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
  <option value="">aisw 유무</option>
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
  <option value="">강의평가</option>
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






                <button onClick={addLectureList}>강의 추가</button>
                <button onClick={submitLectureList}>추가된 강의 제출</button>
              </div>
            )}
        <div>
        <h2>강의</h2>
        <ul>
          {/* {lecture.map(lecture => (
            <li key={lecture.lectureId}>
              <span>{lecture.lectureName}</span>
              <span>{lecture.classification}</span>
              <span>{lecture.room}</span>
              <span>{lecture.credit}</span>
              <span>{lecture.division}</span>
              <span>{lecture.grade}</span>
              <span>{lecture.lectureTime}</span>
              <span>{lecture.classMethod}</span>
              <span>{lecture.testType}</span>
              <span>{lecture.teamwork}</span>
              <span>{lecture.entrepreneurship}</span>
              <span>{lecture.creativeThinking}</span>
              <span>{lecture.harnessingResource}</span>
              <span>{lecture.teamPlay}</span>
              <span>{lecture.gradeMethod}</span>
              <span>{lecture.aiSw}</span>
              <span>{lecture.course_evaluation}</span>


             
              <button onClick={() => handleDeleteClass(lecture.lectureId)}>강의삭제</button>
            </li>
          ))} */}
        </ul>
      </div>

      </div>



    )
}


export default Class 