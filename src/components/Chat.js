import React from "react";
import { useState, useEffect,useContext} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation,Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";
import settingimg from "../image/setting.png"
import TestJson from "../image/TestJson.json"


const Chat =() => {
    
    const [userMessages, setUserMessages] = useState([]); // 사용자의 메시지저장
    const [botMessages, setBotMessages] = useState([]); // 챗봇의 답변저장
    const [inputText, setInputText] = useState('');
    const { auth } = useContext(AuthContext);
    const [showSettings, setShowSettings] = useState(false); 


    const Chatdata = {
        message:inputText
    }

    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
      const getID = async () => {
        try {
          const response = await axiosPrivate.get("/api/chat", {});
          
          console.log(response);
        } catch (err) {
          console.error(err);
          console.log(auth)
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
            <img src="../image/setting.png" alt="Settings" className="w-8 h-8" />
          </button>
        </div>

        {/* 설정 창 */}
        {showSettings && (
          <div className="absolute top-0 right-0 mt-20 mr-10 p-4 bg-white rounded-md shadow-md">
            {/* 설정 내용 */}
            <h3>Settings</h3>
            {/* 설정 내용 추가 */}
          </div>
        )}

   
     
       {/* {날짜별 채팅방 div} */}
        <div className="absolute left-0 h-5/6 bg-chat-date w-1/5  rounded-[5px] drop-shadow-xl z-10 items-center justify-row flex flex-col">

        <h2 className=" mt-24 mr-10 text-3xl font-bold  z-10">LUMOS</h2>
        <button  onClick={deleteEntireChat}className="bg-gray-500 rounded-md ml-30  w-30">일괄삭제</button>
          <h2 className="mt-3 mb-3">2024.05.27</h2>
          <h2 className="mt-3 mb-3">2024.05.27</h2>
          <h2 className="mt-3 mb-3">2024.05.27</h2>
          <h2 className="mt-3 mb-3">2024.05.27</h2>

        </div>
       {/* {채팅ui div} */}
        <div className="h-5/6 w-4/5 bg-chat-ui rounded-[50px] flex flex-col justify-end relative items-center">
        <div class="relative w-3/4 ml-40 mb-3">

        {TestJson.Data.map((item) => (
  <div key={item.lectureId || item.eventId}> {/* lectureId랑 eventId사용 */}
    {item.lectureId && ( // lectureId가 있는 경우
      <Link to={`/detail/${item.lectureId}`}>
        <p>{item.lectureName}</p> 
      </Link>
    )}
    {item.eventId && ( // eventId가 있는 경우
      <Link to={`/detail/${item.eventId}`}>
        <p>{item.eventName}</p> 
      </Link>
    )}
  </div>
))}
          
        {/* {userMessages.map((userMessage, index) => (
          <div key={index} className="message-container">
            <div className="user-message">{userMessage}</div>
            <div className="bot-message">{botMessages[index]}</div>
          </div>
        ))} */}
    
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