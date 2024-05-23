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
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
   
    const [botMessages, setBotMessages] = useState([]); // 챗봇의 답변저장
    const [chatRoom, setchatRoom] = useState([]); 
    
    const [inputText, setInputText] = useState('');
    const [data, setData] = useState([]); // parse 테스트용
    const [dd,setdd] = useState([]);
    const { auth} = useContext(AuthContext);
   
  
    // const [showSettings, setShowSettings] = useState(false); 

    // const handleItemClick = (itemType, itemId) => {
    //   console.log(`Navigating to /detail/${itemType}/${itemId}`);
    //   navigate(`/detail/${itemType}/${itemId}`, { state: { itemType, itemId, content: TestJson.content } });
    // };
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
    const [userMessages, setUserMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isNewChatRoom, setIsNewChatRoom] = useState(false);


  
    useEffect(() => {
      fetchChatRooms();
    }, []); 

    const fetchChatRooms = async () => {
      try {
        const response = await axiosPrivate.get('/api/chat-room');

        if(response.data.repsonseChatRoomDTOList  == null){
          return;
        }
        setChatRooms(response.data.repsonseChatRoomDTOList);
        
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };
  
    const handleChatRoomSelect = async (chatRoomId) => {
      setSelectedChatRoomId(chatRoomId);
      setIsNewChatRoom(false); // 과거 채팅방을 선택하면 isNewChatRoom을 false로 설정
      fetchMessages(chatRoomId);
    };
  
    const fetchMessages = async (chatRoomId) => {
      try {
        const response = await axiosPrivate.get(
          `/api/chat?chatRoomId=${chatRoomId}`
        );
        const { userChat = [], chatBot = [] } = response.data; // 기본값을 빈 배열로 설정
        // 파싱 로직 수정
        const parsedChatBot = chatBot.map((message) => {
          let parsedContent;
          try {
            parsedContent = JSON.parse(message.content);
            console.log(parsedContent);
            // data 필드가 문자열 형태인 경우 JSON 파싱
            if (parsedContent.data && typeof parsedContent.data === "string") {
              parsedContent.data = JSON.parse(parsedContent.data);
            }
          } catch (error) {
            console.error("Error parsing chat bot message content:", error);
            parsedContent = { content: message.content };
          }
          return { ...message, content: parsedContent, type: "bot" };
        });
        const combinedMessages = [];
        const maxLength = Math.max(userChat.length, parsedChatBot.length);
        for (let i = 0; i < maxLength; i++) {
          if (userChat[i]) {
            combinedMessages.push({ ...userChat[i], type: "user" });
          }
          if (parsedChatBot[i]) {
            combinedMessages.push(parsedChatBot[i]);
          }
        }
        setMessages(combinedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
  
    const createNewChatRoom = async (message) => {
      try {
        const response = await axiosPrivate.post('/api/chat-room', {
          message: message
        });
        return response.data; 
      } catch (error) {
        console.error('Error creating new chat room:', error);
        throw error; // 오류가 발생하면 상위로 전파
      }
    };
    
    const sendMessage = async (message, chatRoomId) => {
      try {
        await axiosPrivate.post(`/api/chat?message=${message}&chatRoomId=${chatRoomId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        throw error; // 오류가 발생하면 상위로 전파
      }
    };
    
    const handleSendMessage = async () => {
      if (!inputMessage.trim()) return;
    
      setIsSending(true);
      try {
        let newChatRoomId = null;
        if (isNewChatRoom) {
          newChatRoomId = await createNewChatRoom(inputMessage); 
          setIsNewChatRoom(false);
          fetchChatRooms();
          setSelectedChatRoomId(newChatRoomId);
          fetchChatRooms();
         
        }
        await sendMessage(inputMessage, newChatRoomId || selectedChatRoomId);
        fetchMessages(newChatRoomId || selectedChatRoomId);
        setInputMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    };
    
    const handleCreateChatRoom = () => {
      setIsNewChatRoom(true);
    };


    const handleDeleteChatRoom = async (chatRoomId) => {
      try {
        await axiosPrivate.delete(`/api/chat-room?chatRoomId=${chatRoomId}`);
        fetchChatRooms();
        if (chatRoomId === selectedChatRoomId) {
          setSelectedChatRoomId(null);
          setMessages([]);
        }
        window.alert('채팅방을 삭제하였습니다.');
      } catch (error) {
        console.error('Error deleting chat room:', error);
      }
    };
  
    const handleDeleteAllChatRooms = async () => {
      try {
        await axiosPrivate.delete('/api/all/chat-room');
        fetchChatRooms();
        setSelectedChatRoomId(null);
        setMessages([]);
        window.alert('모든 채팅방을 삭제하였습니다.');
      } catch (error) {
        console.error('Error deleting all chat rooms:', error);
      }
    };



    const handleItemClick = (itemType, itemId) => {
      const message = messages.find(
        msg => msg.type === 'bot' && msg.content.table === itemType && msg.content.data.some(item => item[`${itemType}Id`] === itemId)
      );
  
      if (message) {
        // sessionStorage에 저장하기 전에 JSON 문자열로 변환
        sessionStorage.setItem('contentData', JSON.stringify(message.content));
        window.open(`/detail/${itemType}/${itemId}`, '_blank');
      }
    };
    
    return(

      <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        현재채팅방ID:{selectedChatRoomId}
        <h2 className="text-xl mb-4">채팅방 목록</h2>
        <button className="mt-2 bg-green-500 text-white rounded px-4 py-2" onClick={handleCreateChatRoom}>
          채팅방 생성
        </button>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDeleteAllChatRooms}
        >
          전체 채팅방 삭제
        </button>
        <ul>
          {chatRooms.map((chatRoom) => (
            <li
              key={chatRoom.chatRoomId}
              onClick={() => handleChatRoomSelect(chatRoom.chatRoomId)}
              className="cursor-pointer hover:bg-gray-200 p-2"
            >
               채팅방ID:{chatRoom.chatRoomId}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChatRoom(chatRoom.chatRoomId);
                }}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                삭제
              </button>
            </li>
           
          ))}
        </ul>
      </div>
      <div className="w-2/3 p-4 flex flex-col">
      <div className="flex-grow mb-4 overflow-y-auto max-w-full ">
  {messages.map((message, index) => (
    <div key={index} className={`mb-2 ${message.type === 'user' ? 'flex justify-end' : 'text-left'}`}>
      <p className={`inline-block py-2 px-4 rounded ${message.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
        {typeof message.content === 'string' ? message.content : message.content.content}
        {message.type === 'bot' && (message.content.table === 'lecture' || message.content.table === 'event') && message.content.data && (
          <ul>
            {message.content.data.map((item, idx) => (
              <li key={idx} onClick={() => handleItemClick(message.content.table, item[`${message.content.table}Id`])}>
                <span>{idx + 1}.{item[`${message.content.table}Name`]}</span>
              </li>
            ))}
          </ul>
        )}
      </p>
    </div>
  ))}
</div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow border rounded px-4 py-2"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            className="ml-2 bg-blue-500 text-white rounded px-4 py-2"
            onClick={handleSendMessage}
            disabled={isSending}
          >
            전송
          </button>
        </div>
       
      </div>
    </div>
  );
};


export default Chat