import React from "react";
import { useState, useEffect,useContext} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation,Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import useLogout from "../hooks/useLogout";



import TestJson from "../image/TestJson.json"
import Test from "./UiTest";



const Chat =() => {
  const navigate = useNavigate();
    const [userMessages, setUserMessages] = useState([]); // 사용자의 메시지저장
    const [botMessages, setBotMessages] = useState([]); // 챗봇의 답변저장
    const [inputText, setInputText] = useState('');
    const [data, setData] = useState([]); // parse 테스트용
    const [dd,setdd] = useState([]);
    const { auth ,} = useContext(AuthContext);
  
    const [showSettings, setShowSettings] = useState(false); 

    // const handleItemClick = (itemType, itemId) => {
    //   console.log(`Navigating to /detail/${itemType}/${itemId}`);
    //   navigate(`/detail/${itemType}/${itemId}`, { state: { itemType, itemId, content: TestJson.content } });
    // };

    const handleItemClick = (itemType, itemId) => {
      sessionStorage.setItem('contentData', JSON.stringify(TestJson.content)); 
      window.open(`/detail/${itemType}/${itemId}`, '_blank'); 
      sessionStorage.clear();
    };

    const logout = useLogout();


   


    const Chatdata = {
        message:inputText
    }

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/Test3.json');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const jsonData = await response.json();
        
          setData(JSON.parse(jsonData.data));
        
        } catch (error) {
         console.log('에러')
        }
      };
  
      fetchData();
    }, []);
  

    useEffect(() => {
      if (data) {
        console.log(data); // data가 업데이트된 후에 로그 출력
      }
    }, [data]);
  

    const axiosPrivate = useAxiosPrivate();



// 받을때 코드 
  useEffect(() => {
    const getID = async () => {
      try {
        const response = await axiosPrivate.get(`/api/chat?chatRoomId=3`);
        
        let chatBotContent = response.data.chatBot[0].content;
        console.log('Original chatBotContent:', chatBotContent);

        // Step 1: 정규식을 사용하여 "data" 부분을 수정
        const modifiedChatBotContent = chatBotContent.replace(/"data":"(\[.*?\])"/, '"data":$1');
        
        console.log('Modified chatBotContent:', modifiedChatBotContent);

        // Step 2: JSON.parse를 사용하여 객체로 변환
        const parsedContent = JSON.parse(modifiedChatBotContent);
        console.log('Parsed Content:', parsedContent); //이걸 화면에 렌더하기
        setdd(parsedContent);

        window.alert('성공');
      } catch (err) {
        console.error(err);
        window.alert('실패');
      }
    };

    getID();
  }, []);

    useEffect(() => {
      const GetChatroom = async () => {
        try {
          const response = await axiosPrivate.get("/api/chat/chatRoom", {});
          
          console.log(response);
        } catch (err) {
          console.error(err);
          console.log(auth)
          console.log(TestJson)
        }
      };
      
      GetChatroom();
    }, []);



    const signout = async () => {
       
      await logout();
      
      navigate('/login');
     
  }

      

    const deleteEntireChat = async () => {
      try{
        const response = await axiosPrivate.delete("/api/chat/AllChatRoom");
        console.log(response)

      }catch(err) {
        console.error(err);
        
      }
    }


   
  
    const sendMessage = async () => {
        if (!inputText.trim()) return;
        console.log(inputText)
        console.log(auth)
      
        setUserMessages([...userMessages, inputText]);
        
        try {
          const response = await axiosPrivate.post(
            `/api/chat/test?message=${Chatdata.message}`
          );
          const botMessage = response.data;
          setBotMessages([...botMessages, botMessage]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
        setInputText('');
      };

    
    return(

      <React.Fragment>
      <div className="bg-left-main flex flex-row h-screen justify-center items-center">

     
        {/* 설정 아이콘 */}
        <div className="absolute top-0 right-0 mt-10 mr-10">
          <button onClick={() => setShowSettings(!showSettings)}>
            <img src="/setting.png" alt="Settings" className="w-8 h-8" />
          </button>
        </div>

        {/* 설정 창 */}
        {showSettings && (
          <div className="absolute top-0 right-0 mt-20 mr-10 p-4 bg-white rounded-md shadow-md">
            {/* 설정 내용 */}
            <h3 onClick={logout}>로그아웃</h3>
            {/* 설정 내용 추가 */}
          </div>
        )}

   
     

       {/* {날짜별 채팅방 div} */}
        <div className="absolute left-0 h-5/6 bg-chat-date w-1/5  rounded-[5px] drop-shadow-xl z-10 items-center justify-row flex flex-col">

        <h2 className=" text-5xl font-gmarket mt-40  ">LUMOS</h2>
         
        <button  onClick={deleteEntireChat}className="bg-gray-300 rounded-md ml-60  w-30 border-4 w-40 h-10">일괄삭제</button>
          <h2 className="mt-3 mb-3">2024.05.27</h2>
          <h2 className="mt-3 mb-3">2024.05.27</h2>
          <h2 className="mt-3 mb-3">2024.05.27</h2>
          <h2 className="mt-3 mb-3">2024.05.27</h2>

        </div>
       {/* {채팅ui div} */}
        <div className="h-5/6 w-4/5 bg-chat-ui rounded-[50px] flex flex-col justify-end relative items-center overflow-auto">
        <div class="relative w-3/4 ml-40 mb-3">


        <div>
      <p>강의추천</p>
      <ul>
        {TestJson.content.lecture && TestJson.content.lecture.data.map(lecture => (
          <li key={lecture.lectureId} onClick={() => handleItemClick('lecture', lecture.lectureId)}>
            {lecture.lectureName}
          </li>
        ))}
      </ul>
      <p>행사추천</p>
      <ul>
        {TestJson.content.event && TestJson.content.event.data.map(event => (
          <li key={event.eventId} onClick={() => handleItemClick('event', event.eventId)}>
            {event.eventName}
          </li>
        ))}
      </ul>
    </div>

    <div>
      <h2>{dd[0]}</h2>
    </div>

         {/* {TestJson.content.map((item) => (
  <div key={item.lectureId || item.eventId}> 
    {item.lectureId && ( 
      <Link to={`/detail/${item.lectureId}`}>
        <p>{item.lectureName}</p> 
      </Link>
    )}
    {item.eventId && ( 
      <Link to={`/detail/${item.eventId}`}>
        <p>{item.eventName}</p> 
      </Link>
    )}
  </div>
))}  */}

{/* <div>
      <h1>Lecture Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div> */}
          
         {/* {userMessages.map((userMessage, index) => (
          <div key={index} className="message-container">
            <div className="user-message">{userMessage}</div>
            <div className="bot-message">{botMessages[index]}</div>
          </div>
        ))}  */}
    
<div className="flex flex-row h-10">
<input  value={inputText} onChange={(e)=> setInputText(e.target.value)}type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="무엇이든 물어보세요" required />
  <button  onClick={sendMessage} class=" inset-y-0 right-0 px-3 py-2 bg-blue-200 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600 dark:bg-blue-300 dark:hover:bg-blue-700 dark:focus:bg-blue-700">
    전송
  </button>
</div>
 
</div>
        </div>
      </div>
    </React.Fragment>
    
    

    //   <div className="bg-slate-300">
    //   <div className="bg-slate-600">
    //     {userMessages.map((userMessage, index) => (
    //       <div key={index} className="message-container">
    //         <div className="user-message">{userMessage}</div>
    //         <div className="bot-message">{botMessages[index]}</div>
    //       </div>
    //     ))}
    //   </div>
  
    //   <input value={inputText} onChange={(e) => setInputText(e.target.value)} />
    //   <button onClick={sendMessage}>전송</button>
    //   <button><Link to="/"style={{ color: 'black', textDecoration: 'none' }}>홈으로이동</Link></button>
    // </div>

    )
}

export default Chat