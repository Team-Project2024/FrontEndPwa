import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import moment from "moment";

const Chat = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [chatRooms, setChatRooms] = useState([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isNewChatRoom, setIsNewChatRoom] = useState(false);
  const [isChatRoomListVisible, setIsChatRoomListVisible] = useState(false);
  const [lastUserQuestion, setLastUserQuestion] = useState(null);
  const [tempChatRoom, setTempChatRoom] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    fetchChatRooms();

    if (sessionStorage.getItem("selectedChatRoomId")) {
      handleChatRoomSelect(sessionStorage.getItem("selectedChatRoomId"));
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

  const fetchChatRooms = async () => {
    try {
      const response = await axiosPrivate.get("/api/chat-room");
      if (response.data.repsonseChatRoomDTOList == null) {
        setChatRooms([]);
        return;
      }

      console.log(response);

      const chatRooms = response.data.repsonseChatRoomDTOList.map((room) => {
        // 서버 날짜를 로컬 시간대로 변환
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
      console.error("Error fetching chat rooms:", error);
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
      const response = await axiosPrivate.post(
        `/api/chat-room?message=${message}`
      );
      return response.data;
    } catch (error) {
      console.error("Error creating new chat room:", error);
      throw error;
    }
  };

  const sendMessage = async (message, chatRoomId) => {
    try {
      await axiosPrivate.post(
        `/api/chat?message=${message}&chatRoomId=${chatRoomId}`
      );
    } catch (error) {
      console.error("Error sending message:", error);
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
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateChatRoom = () => {
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
      window.alert("채팅방을 삭제하였습니다.");
      fetchChatRooms();
    } catch (error) {
      console.error("Error deleting chat room:", error);
    }
  };

  const handleDeleteAllChatRooms = async () => {
    try {
      await axiosPrivate.delete("/api/all/chat-room");
      setSelectedChatRoomId(null);
      setMessages([]);
      window.alert("모든 채팅방을 삭제하였습니다.");
      fetchChatRooms();
    } catch (error) {
      console.error("Error deleting all chat rooms:", error);
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

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      return newMode;
    });
  };

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

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      {/* 큰 화면에서는 버튼이 보이지 않도록 설정 */}
      <div className="lg:hidden block p-4 absolute top-2 left-4 z-10">
        <button
          onClick={toggleChatRoomList}
          className="bg-blue-500 text-white rounded px-4 py-2 dark:bg-blue-700"
        >
          {isChatRoomListVisible ? "채팅방 목록 숨기기" : "채팅방 목록 보기"}
        </button>
      </div>

      <div
        className={`${
          isChatRoomListVisible ? "block" : "hidden"
        } lg:block lg:relative absolute inset-0 lg:w-1/4 w-3/4 bg-white border-r border-gray-300 p-4 overflow-y-auto dark:border-gray-600 dark:bg-gray-600 z-20`}
      >
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={toggleChatRoomList}
            className="bg-red-500 text-white rounded px-4 py-2 dark:bg-red-700"
          >
            채팅방 목록 닫기
          </button>
        </div>
        <h2 className="text-xl mb-4 dark:text-gray-200">채팅방 목록</h2>
        <button
          className="mt-2 bg-green-500 text-white rounded px-4 py-2 dark:bg-green-700"
          onClick={handleCreateChatRoom}
        >
          채팅방 생성
        </button>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded dark:bg-red-700"
          onClick={handleDeleteAllChatRooms}
        >
          전체 채팅방 삭제
        </button>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="mt-4 bg-gray-500 text-white rounded px-4 py-2 dark:bg-gray-700"
        >
          다크 모드 {isDarkMode ? "끄기" : "켜기"}
        </button>
        <ul>
          {tempChatRoom && (
            <li className="cursor-pointer hover:bg-gray-200 p-2 dark:hover:bg-gray-700 dark:text-gray-200">
              NewChat
              <button className="bg-gray-500 text-white px-2 py-1 rounded ml-2 dark:bg-gray-700">
                생성중...
              </button>
            </li>
          )}
          {Object.keys(groupedChatRooms)
            .sort((a, b) => new Date(b) - new Date(a))
            .map((date) => (
              <React.Fragment key={date}>
                <li className="text-gray-600 font-bold dark:text-white">{date}</li>
                {groupedChatRooms[date]
                  .sort(
                    (a, b) =>
                      new Date(b.lastChatDate) - new Date(a.lastChatDate)
                  )
                  .map((chatRoom) => (
                    <li
                      key={chatRoom.chatRoomId}
                      onClick={() => {
                        sessionStorage.removeItem("y");
                        sessionStorage.removeItem("selectedChatRoomId");
                        handleChatRoomSelect(chatRoom.chatRoomId);
                      }}
                      className="cursor-pointer hover:bg-gray-200 p-2 dark:hover:bg-gray-700 dark:text-white font-gmarket"
                    >
                      {chatRoom.firstChat}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChatRoom(chatRoom.chatRoomId);
                        }}
                        className="bg-red-500 text-white px-2 py-1 rounded dark:bg-red-700"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
              </React.Fragment>
            ))}
        </ul>
      </div>

      <div
        className={`flex-grow p-4 flex flex-col dark:bg-gray-900 dark:text-gray-200 ${
          isChatRoomListVisible ? "lg:w-3/4" : "w-full"
        }`}
      >
        <div
          className="flex-grow mb-4 overflow-y-auto max-w-full"
          ref={messagesContainerRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 ${
                message.type === "user" ? "flex justify-end" : "text-left"
              }`}
            >
              <p
                className={`inline-block py-2 px-4 rounded ${
                  message.type === "user"
                    ? "bg-blue-100 text-blue-800 break-words whitespace-pre-wrap max-w-96 dark:bg-blue-900 dark:text-blue-300 font-gmarket"
                    : "bg-gray-100 text-gray-800 break-words whitespace-pre-wrap max-w-96 dark:bg-gray-700 dark:text-gray-300 font-gmarket"
                }`}
              >
                {typeof message.content === "string"
                  ? message.content
                  : message.content.content}
                {message.type === "bot" &&
                  (message.content.table === "lecture" ||
                    message.content.table === "event") &&
                  message.content.data && (
                    <ul>
                      {message.content.data.map((item, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            sessionStorage.setItem(
                              "selectedChatRoomId",
                              selectedChatRoomId
                            );

                            sessionStorage.setItem(
                              "y",
                              messagesContainerRef.current.scrollTop
                            );
                            handleItemClick(
                              message.content.table,
                              item[`${message.content.table}Id`]
                            );
                          }}
                        >
                          <span>
                            {idx + 1}.{item[`${message.content.table}Name`]}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {lastUserQuestion && (
            <div className="mb-2 flex justify-end">
              <p className="inline-block py-2 px-4 rounded bg-blue-100 text-blue-800 break-words whitespace-pre-wrap max-w-full dark:bg-blue-900 dark:text-blue-300">
                {lastUserQuestion}
              </p>
            </div>
          )}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow border rounded px-4 py-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={activeEnter}
            disabled={isSending}
          />
          <button
            className="ml-2 bg-blue-500 text-white rounded px-4 py-2 dark:bg-blue-700"
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
