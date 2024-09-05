import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import moment from "moment";
import { Tooltip } from "react-tooltip";
import useLogout from "../hooks/useLogout";
import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTrashAlt,
  FaMagic,
  FaComments,
  FaMicrophone,
  FaSpinner,
} from "react-icons/fa";
import chatbotIcon from "../image/chatbot.png";
import MapComponent from "./MapComponent";
const ChatVoice = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const logout = useLogout();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [open, setOpen] = useState(false);
  const [graduation, setGraduation] = useState([]);
  const [maps, setMaps] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [getTheme, setGetTheme] = useState(false);
  const DetectTheme = () => {
    setTimeout(() => {
      setGetTheme(!getTheme);
    }, 100);
  };
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [hasShown, setHasShown] = useState(false);
  const [IosMessage, setIosMessage] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false); // 음성 인식 상태 추가
  const [isRecognizing, setIsRecognizing] = useState(false); // 음성 인식 진행 중 상태
  const recognition = useRef(null); // 음성 인식 객체 유지
  // 음성 인식 설정
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = false;
      speechRecognition.lang = "ko-KR"; // 한국어 설정
      recognition.current = speechRecognition;
      speechRecognition.onstart = () => {
        setIsListening(true); // 음성 인식 시작 상태 설정
      };
      speechRecognition.onend = () => {
        setIsListening(false); // 음성 인식 끝 상태 설정
      };
      speechRecognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript); // 음성 인식 결과를 입력창에 설정
        // 음성 인식 결과를 바로 전송
        await handleSendMessage(transcript); // 바로 메시지 전송
      };
    }
  }, []);
  // 음성 인식 시작 함수
  const handleSpeechInput = () => {
    if (recognition.current) {
      recognition.current.start(); // 음성 인식 시작
    }
  };
  const handleSpeechOutput = (text) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR"; // 한국어 설정
    utterance.volume = 3; // 볼륨
    utterance.rate = 1; // 속도
    utterance.pitch = 1; // 음정
    utterance.onstart = () => {
      setIsSpeaking(true); // 음성 출력 중 상태로 변경
    };
    utterance.onend = () => {
      setIsSpeaking(false); // 음성 출력 완료 후 상태 변경
    };
    utterance.onerror = (e) => {
      console.error("음성 출력 중 오류 발생:", e);
      setIsSpeaking(false); // 오류 발생 시에도 상태를 해제
    };
    speechSynthesis.speak(utterance); // 텍스트를 음성으로 읽음
  };
  useEffect(() => {
    getGraduation();
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
  };
  const onIosClick = () => {
    setIosMessage(true);
  };
  const onIosClose = () => {
    setIosMessage(false);
  };
  const getGraduation = async () => {
    try {
      const response = await axiosPrivate.get("/api/graduation");
      setGraduation(response.data);
    } catch (error) {
      console.error("졸업요건 받아오기에러:", error);
    }
  };
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
    try {
      const message = await sendMessage(inputMessage, 101);
      if (message) {
        await handleSpeechOutput(message.content.content); // 가장 최근의 봇 응답 음성 출력
      }
    } catch (error) {
      console.error("메세지 전송 에러:", error);
      console.log("메시지를 전송하는과정에서 에러가 발생하였습니다.");
    } finally {
      setIsSending(false);
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
  const handleMapOpen = (data) => {
    try {
      const parsedData = typeof data === "string" ? JSON.parse(data) : data;
      const cleanedData =
        typeof parsedData.data === "string"
          ? parsedData.data.replace(/\\/g, "")
          : JSON.stringify(parsedData.data);
      const validData = `[${cleanedData.substring(1, cleanedData.length - 1)}]`;
      const locations = JSON.parse(validData);
      const coordinates = locations.map((item) => ({
        name: item.locationName,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }));
      setMaps(coordinates);
    } catch (error) {}
  };
  const handleNavigateAdmin = () => {
    navigate("/admin");
  };
  return (
    <div
      className={`flex lg:h-screen h-auto lg:pr-32 pr-0 lg:bg-gray-600 bg-transparent lg:py-6 py-0`}
    >
      <div
        className={`flex w-screen h-screen lg:h-auto bg-white rounded-tr-3xl rounded-br-3xl ${
          isDarkMode
            ? "dark:bg-gray-800"
            : "dark:bg-transparent rounded-tr-3xl rounded-br-3xl"
        }`}
      >
        {/* 큰 화면에서는 버튼이 보이지 않도록 설정 */}
        <div
          className={`flex-grow p-4 flex flex-col lg:rounded-tr-3xl lg:rounded-br-3xl dark:bg-gray-900 dark:text-gray-200`}
        >
          <div
            className="flex-grow mb-4 p-4 lg:p-4 overflow-y-auto scrollbar-hide"
            ref={messagesContainerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 flex ${
                  message.type === "user"
                    ? "justify-end lg:ml-6 ml-4"
                    : "justify-start lg:mr-10 mr-4"
                }`}
              >
                {message.type === "bot" && (
                  <img
                    src={chatbotIcon}
                    alt="Chatbot Icon"
                    className="w-10 h-10 mr-4 self-start"
                  />
                )}
                <div
                  className={`inline-block py-2 px-4 rounded-lg max-w-xs md:max-w-md lg:max-w-4xl ${
                    message.type === "user"
                      ? "bg-gray-100 text-gray-800 break-words whitespace-pre-wrap dark:bg-gray-600 dark:text-gray-300 font-gmarket"
                      : "bg-blue-100 text-gray-800 break-words whitespace-pre-wrap dark:bg-gray-800 dark:text-white font-gmarket"
                  }`}
                >
                  {typeof message.content === "string"
                    ? message.content
                    : message.content.content}
                  {/* {message.type === "bot" && message.content.content.includes('인성교양') && (
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
                    )} */}
                  {maps.length > 0 && (
                    <MapComponent
                      coordinates={maps}
                      onClose={() => setMaps([])}
                    />
                  )}
                  {message.type === "bot" &&
                    (message.content.table === "lecture" ||
                      message.content.table === "event") &&
                    message.content.data && (
                      <ul>
                        {message.content.data.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => {
                              handleItemClick(
                                message.content.table,
                                item[`${message.content.table}Id`]
                              );
                            }}
                          >
                            <span className="font-bold cursor-pointer">
                              {idx + 1}.{item[`${message.content.table}Name`]}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
            ))}
            <div className="flex items-center w-full">
              {/* 음성인식버튼  */}
              <button onClick={handleSpeechInput} disabled={isListening}>
                {isListening ? (
                  <svg
                    className="animate-spin h-6 w-6 text-black dark:text-white"
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
                  <FaMicrophone className="text-4xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatVoice;
