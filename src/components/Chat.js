import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";

const Chat = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isNewChatRoom, setIsNewChatRoom] = useState(false);
  const [isChatRoomListVisible, setIsChatRoomListVisible] = useState(true);
  const [lastUserQuestion, setLastUserQuestion] = useState(null);

  useEffect(() => {
    fetchChatRooms();
  }, [],[chatRooms]);

  const fetchChatRooms = async () => {
    try {
      const response = await axiosPrivate.get('/api/chat-room');
      if (response.data.repsonseChatRoomDTOList == null) {
        setChatRooms([]);
        return;
      }
      
      const sortedChatRooms = response.data.repsonseChatRoomDTOList.sort((a, b) => 
        new Date(b.lastChatDate) - new Date(a.lastChatDate)
      );
      setChatRooms(sortedChatRooms);

      fetchChatRooms();
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const handleChatRoomSelect = async (chatRoomId) => {
    setSelectedChatRoomId(chatRoomId);
    setIsNewChatRoom(false); 
    fetchMessages(chatRoomId);
  };

  const fetchMessages = async (chatRoomId) => {
    try {
      const response = await axiosPrivate.get(`/api/chat?chatRoomId=${chatRoomId}`);
      const { userChat = [], chatBot = [] } = response.data; 
      const parsedChatBot = chatBot.map((message) => {
        let parsedContent;
        try {
          parsedContent = JSON.parse(message.content);
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
      const response = await axiosPrivate.post('/api/chat-room', { message: message });
      return response.data;
    } catch (error) {
      console.error('Error creating new chat room:', error);
      throw error;
    }
  };

  const sendMessage = async (message, chatRoomId) => {
    try {
      await axiosPrivate.post(`/api/chat?message=${message}&chatRoomId=${chatRoomId}`);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setIsSending(true);
  
   
    setLastUserQuestion(inputMessage);
  
    try {
      let newChatRoomId = null;
      if (isNewChatRoom) {
        newChatRoomId = await createNewChatRoom(inputMessage);
        setIsNewChatRoom(false);
        setChatRooms((prevChatRooms) => [
          ...prevChatRooms,
          { chatRoomId: newChatRoomId, lastChatDate: new Date().toISOString() },
        ]);
        setSelectedChatRoomId(newChatRoomId);
      }
      await sendMessage(inputMessage, newChatRoomId || selectedChatRoomId);
      fetchMessages(newChatRoomId || selectedChatRoomId);
      setInputMessage('');
  
      
      setLastUserQuestion(null);
      fetchChatRooms();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateChatRoom = () => {
    setIsNewChatRoom(true);
    setSelectedChatRoomId(null);
    setMessages([]);
  };

  const handleDeleteChatRoom = async (chatRoomId) => {
    try {
      await axiosPrivate.delete(`/api/chat-room?chatRoomId=${chatRoomId}`);
     
      if (chatRoomId === selectedChatRoomId) {
        setSelectedChatRoomId(null);
        setMessages([]);
      }
     
      window.alert('채팅방을 삭제하였습니다.');
      fetchChatRooms();
    } catch (error) {
      console.error('Error deleting chat room:', error);
    }
  };

  const handleDeleteAllChatRooms = async () => {
    try {
      await axiosPrivate.delete('/api/all/chat-room');
     
      setSelectedChatRoomId(null);
      setMessages([]);
    
      window.alert('모든 채팅방을 삭제하였습니다.');
      fetchChatRooms();
    } catch (error) {
      console.error('Error deleting all chat rooms:', error);
    }
  };

  const handleItemClick = (itemType, itemId) => {
    const message = messages.find(
      msg => msg.type === 'bot' && msg.content.table === itemType && msg.content.data.some(item => item[`${itemType}Id`] === itemId)
    );

    if (message) {
      sessionStorage.setItem('contentData', JSON.stringify(message.content));
      window.open(`/detail/${itemType}/${itemId}`, '_blank');
    }
  };

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChatRoomList = () => {
    setIsChatRoomListVisible(!isChatRoomListVisible);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto lg:block hidden">
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
      <div className="lg:hidden block p-4">
        <button onClick={toggleChatRoomList} className="bg-blue-500 text-white rounded px-4 py-2">
          {isChatRoomListVisible ? "채팅방 목록 숨기기" : "채팅방 목록 보기"}
        </button>
      </div>
      {isChatRoomListVisible && (
        <div className="w-full border-r border-gray-300 p-4 overflow-y-auto lg:hidden">
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
      )}
      <div className="w-2/3 p-4 flex flex-col">
        <div className="flex-grow mb-4 overflow-y-auto max-w-full">
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

          {lastUserQuestion && (
            <div className="mb-2 flex justify-end">
              <p className="inline-block py-2 px-4 rounded bg-blue-100 text-blue-800">{lastUserQuestion}</p>
            </div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow border rounded px-4 py-2 disabled:border-red-400"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={activeEnter}
            disabled={isSending}
          />
          <button
            className="ml-2 bg-blue-500 text-white rounded px-4 py-2"
            onClick={handleSendMessage}
            disabled={isSending}
          >
            {isSending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.417-1.417A5.958 5.958 0 016 12H2c0 1.828.775 3.47 2.025 4.646L6 17.291z"
                ></path>
              </svg>
            ) : (
              "전송"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;