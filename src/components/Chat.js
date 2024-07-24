import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import moment from "moment";
import { Tooltip } from 'react-tooltip';
import useLogout from "../hooks/useLogout";

import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTrashAlt,
  FaMagic,
  FaComments,
 
} from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import chatbotIcon from "../image/chatbot.png"; 
import senderIcon from "../image/sender.png";
import Switcher from "../Dark/Switcher";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import DoughnutCharts from "./DoughnutChart";
import MapComponent from "./MapComponent";

const Chat = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const logout = useLogout();

  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isNewChatRoom, setIsNewChatRoom] = useState(false);
  const [isChatRoomListVisible, setIsChatRoomListVisible] = useState(false);
  const [lastUserQuestion, setLastUserQuestion] = useState(null);
  const [tempChatRoom, setTempChatRoom] = useState(null);
  const [open, setOpen] = useState(false);
  const [graduation, setGraduation] = useState([]);
  const [maps, setMaps] = useState([]); 
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [getTheme, setGetTheme] = useState(false);



  const DetectTheme = () => {
    setTimeout(() => {
      setGetTheme(!getTheme)
    }, 100); 
  };




  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

 

  useEffect(() => {
    getGraduation();
  }, []);

  useEffect(() => {
    fetchChatRooms();

    if (sessionStorage.getItem("selectedChatRoomId")) {
      handleChatRoomSelect(sessionStorage.getItem("selectedChatRoomId"));
    } else {
      handleCreateChatRoom();
    }
  }, []);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("y");
    if (!sessionStorage.getItem("selectedChatRoomId")) {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    } else if (savedScrollPosition && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = parseInt(savedScrollPosition);
    }
  }, [messages]);

  const handleOpenWarning = () => {
    setOpen(!open);
  }

  const fetchChatRooms = async () => {
    try {
      const response = await axiosPrivate.get("/api/chat-room");
      if (response.data.repsonseChatRoomDTOList == null) {
        setChatRooms([]);
        return;
      }

      const chatRooms = response.data.repsonseChatRoomDTOList.map((room) => {
        room.lastChatDate = moment
          .utc(room.lastChatDate)
          .local()
          .format("YYYY-MM-DD HH:mm:ss");
        return room;
      });

      const sortedChatRooms = chatRooms.sort(
        (a, b) => new Date(b.lastChatDate) - new Date(a.lastChatDate)
      );
      setChatRooms(sortedChatRooms);
    } catch (error) {
      console.error("채팅방 정렬에러:", error);
    }
  };

  const getGraduation = async () => {
    try {
      const response = await axiosPrivate.get("/api/graduation");
      setGraduation(response.data);
    } catch (error) {
      console.error("졸업요건 받아오기에러:", error);
    }
  };

  const formatDate = (date) => {
    const currentDate = new Date();
    const targetDate = new Date(date);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    if (
      currentYear === targetYear &&
      currentMonth === targetMonth &&
      currentDay === targetDay
    ) {
      return "오늘";
    }

    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);

    if (
      yesterday.getFullYear() === targetYear &&
      yesterday.getMonth() === targetMonth &&
      yesterday.getDate() === targetDay
    ) {
      return "어제";
    }

    const lastWeek = new Date(currentDate);
    lastWeek.setDate(currentDate.getDate() - 7);

    if (targetDate > lastWeek) {
      return "지난 7일";
    }

    const lastMonth = new Date(currentDate);
    lastMonth.setDate(currentDate.getDate() - 30);

    if (targetDate > lastMonth) {
      return "지난 30일";
    }

    return targetDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChatRoomSelect = async (chatRoomId) => {
    setSelectedChatRoomId(chatRoomId);
    setIsNewChatRoom(false);
    setTempChatRoom(null);
    fetchMessages(chatRoomId);
  };

  const fetchMessages = async (chatRoomId) => {
    try {
      const response = await axiosPrivate.get(
        `/api/chat?chatRoomId=${chatRoomId}`
      );
      const { userChat = [], chatBot = [] } = response.data;
      console.log(response.data);
      const parsedChatBot = chatBot.map((message) => {
        let parsedContent;
        try {
          parsedContent = JSON.parse(message.content);
          if (parsedContent.data && typeof parsedContent.data === "string") {
            parsedContent.data = JSON.parse(parsedContent.data);
          }
        } catch (error) {
          console.error("챗봇메세지 파싱에러:", error);
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
      console.error("대화내역 받아오기에러:", error);
    }
  };

  const createNewChatRoom = async (message) => {
    try {
      const response = await axiosPrivate.post(
        `/api/chat-room?message=${message}`
      );
      return response.data;
    } catch (error) {
      console.error("채팅방생성 에러:", error);
      throw error;
    }
  };

  const handleClose = () => {
    setOpen(false);
  }

  const sendMessage = async (message, chatRoomId) => {
    try {
      await axiosPrivate.post(
        `/api/chat?message=${message}&chatRoomId=${chatRoomId}`
      );
    } catch (error) {
      console.error("메시지전송에러:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    setIsSending(true);
    setInputMessage("");
    setLastUserQuestion(inputMessage);
    try {
      let newChatRoomId = null;
      if (isNewChatRoom) {
        newChatRoomId = await createNewChatRoom(inputMessage);
        setIsNewChatRoom(false);
        const newChatRoom = {
          chatRoomId: newChatRoomId,
          lastChatDate: new Date().toISOString(),
          firstChat: inputMessage,
        };
        setChatRooms((prevChatRooms) => [newChatRoom, ...prevChatRooms]);
        setSelectedChatRoomId(newChatRoomId);
        setTempChatRoom(null);
      }
      await sendMessage(inputMessage, newChatRoomId || selectedChatRoomId);
      fetchMessages(newChatRoomId || selectedChatRoomId);
      setLastUserQuestion(null);
      fetchChatRooms();
    } catch (error) {
      console.error("메세지 전송 에러:", error);
      setLastUserQuestion(null);
      console.log('메시지를 전송하는과정에서 에러가 발생하였습니다.')
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateChatRoom = () => {
    toggleChatRoomList();
    setIsNewChatRoom(true);
    setSelectedChatRoomId(null);
    setMessages([]);
    setTempChatRoom({
      chatRoomId: "newchat",
      lastChatDate: new Date().toISOString(),
    });
  };

  const handleDeleteChatRoom = async (chatRoomId) => {
    try {
      await axiosPrivate.delete(`/api/chat-room?chatRoomId=${chatRoomId}`);
      if (chatRoomId === selectedChatRoomId) {
        setSelectedChatRoomId(null);
        setMessages([]);
      }
      fetchChatRooms();
    } catch (error) {
      console.error("채팅방삭제 실패:", error);
    }
  };

  const handleDeleteAllChatRooms = async () => {
    try {
      await axiosPrivate.delete("/api/all/chat-room");
      setSelectedChatRoomId(null);
      setMessages([]);
      fetchChatRooms();
      setOpen(!open);
    } catch (error) {
      console.error("모든채팅방삭제 실패:", error);
    }
  };

  const handleItemClick = (itemType, itemId) => {
    const message = messages.find(
      (msg) =>
        msg.type === "bot" &&
        msg.content.table === itemType &&
        msg.content.data.some((item) => item[`${itemType}Id`] === itemId)
    );
    if (message) {
      sessionStorage.setItem("contentData", JSON.stringify(message.content));
      navigate(`/detail/${itemType}/${itemId}`);
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

  const TruncateText = ({ text, maxLength }) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };
  const maxLength = 12;

  const groupChatRoomsByDate = (rooms) => {
    return rooms.reduce((acc, room) => {
      const dateCategory = formatDate(room.lastChatDate);
      if (!acc[dateCategory]) {
        acc[dateCategory] = [];
      }
      acc[dateCategory].push(room);
      return acc;
    }, {});
  };

  const groupedChatRooms = groupChatRoomsByDate(chatRooms);

  const handleMapOpen = (data) => {
    try {
      
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
     
      
      
      const cleanedData = typeof parsedData.data === 'string' 
        ? parsedData.data.replace(/\\/g, '') 
        : JSON.stringify(parsedData.data);
      
      
     
      const validData = `[${cleanedData.substring(1, cleanedData.length - 1)}]`;
     
      
     
      const locations = JSON.parse(validData);
    

      
      const coordinates = locations.map(item => ({
        name: item.locationName,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      }));
      
     
      
      setMaps(coordinates); 
      
    } catch (error) {
     
    }
  };

  const handleNavigateAdmin = () => {
    navigate('/admin');

  }

 
 
  return (
    <div className={`flex lg:h-screen h-auto lg:pr-32 pr-0 lg:bg-gray-600 bg-transparent lg:py-6 py-0`}>
      <div className={`flex w-screen h-screen lg:h-auto bg-white rounded-tr-3xl rounded-br-3xl ${isDarkMode ? "dark:bg-gray-800" : "dark:bg-transparent rounded-tr-3xl rounded-br-3xl"}`}>
        {/* 큰 화면에서는 버튼이 보이지 않도록 설정 */}
        <div className="lg:hidden block p-4 absolute top-2 left-4 z-10">
          <FaBars onClick={toggleChatRoomList} className="text-2xl text-black dark:text-white cursor-pointer" />
        </div>

        <div className={`lg:block dark:bg-gray-800 overflow-y-scroll scrollbar-hide bg-white lg:relative absolute inset-0 lg:w-1/4 w-3/5  border-r border-gray-300 dark:border-gray-600 z-20 flex flex-col h-full ${isChatRoomListVisible ? "" : "hidden"}`}>
          <div className="lg:hidden pt-2 pr-2 flex justify-end mb-4">
            <FaTimes onClick={toggleChatRoomList} className="text-2xl text-black dark:text-white cursor-pointer" />
          </div>
          {/* 위에 고정시키고자 하는 부분 */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4">
            <div className="">
              <div className="text-xl mb-4 dark:text-gray-200 font-gmarket">
                LUMOS
              </div>
              <div className="mt-2 flex justify-between">
                <button className="bg-blue-400 px-4 py-2 rounded-lg">
                  <FaComments
                    data-tooltip-id="my-tooltip" data-tooltip-content="새 채팅방 생성"
                    place="bottom"
                    onClick={handleCreateChatRoom}
                    className="text-2xl text-white dark:text-white cursor-pointer focus:outline-none"
                  />
                </button>
                {auth.role === 'ROLE_ADMIN' &&(
                   <button className="bg-blue-400 px-4 py-2 rounded-lg">
                   <GrUserAdmin
                     data-tooltip-id="my-tooltip" data-tooltip-content="관리자페이지 이동"
                     place="bottom"
                     onClick={handleNavigateAdmin}
                     className="text-2xl text-white dark:text-white cursor-pointer focus:outline-none"
                   />
                 </button>
                )}
             
                {/* <button
                  className="bg-red-500 text-white px-4 py-2 rounded dark:bg-red-700"
                  onClick={handleOpenWarning}
                >
                  <FaTrashAlt className="" />
                </button> */}
              </div>
              <Tooltip id="my-tooltip" />
            </div>
          </div>

          <div className="pb-4 pl-4 pr-4 h-full flex-grow overflow-y-auto scrollbar-hide mt-4 lg:mt-0 lg:flex-grow lg:overflow-y-auto">
            <ul>
              {tempChatRoom && (
                <li className="cursor-pointer hover:bg-gray-200 p-2 dark:hover:bg-gray-700 dark:text-gray-200">
                  NewChat
                </li>
              )}
              {Object.keys(groupedChatRooms)
                .sort((a, b) => new Date(b) - new Date(a))
                .map((date) => (
                  <React.Fragment key={date}>
                    <li className="text-gray-600 font-bold dark:text-white mt-5">
                      {date}
                    </li>
                    <hr className="border-black dark:border-gray-500 my-" />
                    {groupedChatRooms[date]
                      .sort(
                        (a, b) => new Date(b.lastChatDate) - new Date(a.lastChatDate)
                      )
                      .map((chatRoom) => (
                        <li
                          key={chatRoom.chatRoomId}
                          onClick={() => {
                            sessionStorage.removeItem("y");
                            sessionStorage.removeItem("selectedChatRoomId");
                            handleChatRoomSelect(chatRoom.chatRoomId);
                          }}
                          className="cursor-pointer hover:bg-gray-200 p-2 dark:hover:bg-gray-700 dark:text-white font-gmarket flex flex-row justify-between"
                        >
                          <TruncateText
                            text={chatRoom.firstChat}
                            maxLength={maxLength}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChatRoom(chatRoom.chatRoomId);
                            }}
                            className="text-xl text-gray-400 cursor-pointer ml-2 focus:outline-none"
                          >
                            <FaTimes className="mr-1" />
                          </button>
                        </li>
                      ))}
                  </React.Fragment>
                ))}
            </ul>
          </div>
          <div className="sticky bottom-0 left-0 p-4 bg-white dark:bg-gray-800 flex justify-between items-center">
            {/* 다크모드 */}
            <div onClick={DetectTheme}>
              <Switcher  />   
            </div>
            {/* 로그아웃 버튼 */}
            <div>
              <FaSignOutAlt
                data-tooltip-id="my-tooltip" data-tooltip-content="로그아웃"
                onClick={logout}
                className="text-3xl text-gray-500 dark:text-gray-200 cursor-pointer focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`flex-grow p-4 flex flex-col lg:rounded-tr-3xl lg:rounded-br-3xl dark:bg-gray-900 dark:text-gray-200 ${isChatRoomListVisible ? "lg:w-full" : "w-full "}`}>
          <div className="flex-grow mb-4 p-4 lg:p-4 overflow-y-auto scrollbar-hide" ref={messagesContainerRef}>
            {tempChatRoom !== null ? (
              <div className="flex items-center justify-center h-full font-gmarket text-sm sm:text-xl">
                <p>챗봇에게 궁금한 정보를 물어보세요!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`mb-6 flex ${message.type === "user" ? "justify-end lg:ml-6 ml-4" : "justify-start lg:mr-10 mr-4"}`}>
                  {message.type === "bot" && (
                    <img src={chatbotIcon} alt="Chatbot Icon" className="w-10 h-10 mr-4 self-start" />
                  )}
                  <div className={`inline-block py-2 px-4 rounded-lg max-w-xs md:max-w-md lg:max-w-4xl ${message.type === "user" ? "bg-gray-100 text-gray-800 break-words whitespace-pre-wrap dark:bg-gray-600 dark:text-gray-300 font-gmarket" : "bg-blue-100 text-gray-800 break-words whitespace-pre-wrap dark:bg-gray-800 dark:text-white font-gmarket"}`}>
                    {typeof message.content === "string" ? message.content : message.content.content}

                    {message.type === "bot" && message.content.content.includes('인성교양') && (
                      <DoughnutCharts content={message.content.content} graduation={graduation}  key={getTheme} />
                    )}

                    
                    {message.type === "bot" && message.content.table === "school_location" && message.content.data && !message.content.content.includes('위치 정보를 찾을 수 없습니다') && (
                      <div className="flex justify-center">
                        <button
                          className="relative max-w-50 py-2.5 px-5 me-2 ml-2 text-md text-gray-900 focus:outline-none bg-white rounded-full border
                                    border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100
                                    dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600
                                    dark:hover:text-white dark:hover:bg-gray-700 font-gmarket font-bold text-center"
                          onClick={() => handleMapOpen(message.content)}>
                          지도 열기
                        </button>
                      </div>
                    )}
                    {maps.length > 0 && <MapComponent coordinates={maps} onClose={() => setMaps([])} />}

                    {message.type === "bot" && (message.content.table === "lecture" || message.content.table === "event") && message.content.data && (
                      <ul>
                        {message.content.data.map((item, idx) => (
                          <li key={idx} onClick={() => {
                            sessionStorage.setItem("selectedChatRoomId", selectedChatRoomId);
                            sessionStorage.setItem("y", messagesContainerRef.current.scrollTop);
                            handleItemClick(message.content.table, item[`${message.content.table}Id`]);
                          }}>
                            <span className="font-bold cursor-pointer">
                              {idx + 1}.{item[`${message.content.table}Name`]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
            {lastUserQuestion && (
              <div className="mb-2 flex justify-end">
                <p className="inline-block py-2 px-4 rounded bg-gray-100 text-gray-800 break-words whitespace-pre-wrap max-w-full dark:bg-gray-600 dark:text-gray-300">
                  {lastUserQuestion}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center w-full">
            <input
              type="text"
              className="flex-grow border rounded px-4 py-2 border-black dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={activeEnter}
              disabled={isSending}
            />
            <button
              className={`text-black rounded text-4xl ml-4 cursor-pointer dark:text-white ${isSending ? 'cursor-not-allowed' : ''}`}
              onClick={handleSendMessage}
              disabled={isSending}
            >
              {isSending ? (
                <svg className="animate-spin h-6 w-6 text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.417-1.417A5.958 5.958 0 016 12H2c0 1.828.775 3.47 2.025 4.646L6 17.291z"></path>
                </svg>
              ) : (
                <FaMagic />
              )}
            </button>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="text-xl font-semibold">정말로 모든 대화방을 삭제하시겠습니까?</DialogTitle>
        <DialogContent className="items-center justify-center flex flex-col space-y-4 p-6">
          <p className="text-gray-600">이 작업은 되돌릴 수 없습니다.</p>
          <Button className="border border-gray-400 rounded-md bg-red-500 text-white px-4 py-2 hover:bg-red-600" onClick={handleDeleteAllChatRooms}>
            삭제하기
          </Button>
        </DialogContent>
        <DialogActions className="flex justify-center p-4">
          <Button onClick={handleClose} className="text-blue-500 hover:text-blue-700">
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Chat;
