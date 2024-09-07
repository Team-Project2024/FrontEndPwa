import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import moment from "moment";
import { Tooltip } from "react-tooltip";
import useLogout from "../hooks/useLogout";
import TTSAnimation from "./TTSAnimation";
import { CSSTransition } from "react-transition-group"; // Import CSSTransition from react-transition-group
import * as THREE from 'three';
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
import DoughnutCharts from "./DoughnutChart";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";  
import axios from "axios";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ChatVoice = () => {
  const [showModal, setShowModal] = useState(false);
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
  const [isContentShifted, setIsContentShifted] = useState(false);
 
 
  
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [graduationVoice, setGraduationVoice] = useState("");







  const handleOpenModal = () => {
    setShowModal(true);
    console.log(showModal);
  };

  var test = false;
  const handleOpen = () => {
    setOpen((check) => !check);
    setIsContentShifted(true); 
    console.log(open);
  };
  const handleClose = () => setOpen(false);



  useEffect(() => {
    if (open) {
      console.log("Modal is now open");
      console.log(test);
    }
  }, [open]);

  const handleCloseModal = () => {
    setShowModal(false);
    setIsContentShifted(false); 
  };

  const [getTheme, setGetTheme] = useState(false);
  const DetectTheme = () => {
    setTimeout(() => {
      setGetTheme(!getTheme);
    }, 100);
  };
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
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
        console.log(transcript);
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
  const handleSpeechOutput = async (text) => {
    const apiKey = process.env.REACT_APP_GOOGLE_TTS_APIKEY; 
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
  
    const requestBody = {
      input: { text: text },
      voice: {
        languageCode: "ko-KR", 
        ssmlGender: "NEUTRAL", 
      },
      audioConfig: {
        audioEncoding: "MP3", 
        speakingRate: 0.8 // 말하는 속도
      },
    };
  
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(url, requestBody);
        const audioContent = response.data.audioContent;
  
        const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
        audio.play();
  
        setIsSpeaking(true); 
  
        audio.onended = () => {
          setIsSpeaking(false); 
          resolve(); 
        };
  
        audio.onerror = (error) => {
          console.error("Error during Google TTS request:", error);
          setIsSpeaking(false);
          reject(error); 
        };
      } catch (error) {
        console.error("Error during Google TTS request:", error);
        setIsSpeaking(false);
        reject(error); 
      }
    });
  };
  
  useEffect(() => {
    getGraduation();
  }, []);

  useEffect(() => {
    if (showModal) {
      console.log("Modal is now open");
    }
  }, [showModal]);

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("y");
    if (!sessionStorage.getItem("selectedChatRoomId")) {
      messagesEndRef.current?.scrollIntoView({ block: "end" });
    } else if (savedScrollPosition && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = parseInt(savedScrollPosition);
    }
  }, [messages]);

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
      const response = await axiosPrivate.post(
        `/api/chat?message=${message}&chatRoomId=${chatRoomId}`
      );

      return response.data;
    } catch (error) {
      console.error("메시지전송에러:", error);
      throw error;
    }
  };

  const lectureNames = (parsedContent) => {
   
    const formattedLectureNames = parsedContent.data
      .map((lecture, index) => {
        return `${index + 1}. ${lecture.lectureName}`;
      })
      .join(" "); 

    return formattedLectureNames;
  };

  const handleSendMessage = async (a) => {
    if (!a.trim()) return;
    setIsSending(true);
    try {
      const message = await sendMessage(a, 101);
      console.log(message);
      if (message) {
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
  
        console.log(parsedContent);
  
        const chatbotMessage = parsedContent.content;
        console.log(chatbotMessage);
        
      
        await handleSpeechOutput(chatbotMessage);
  
       
        if (parsedContent.table === "lecture") {
          console.log(lectureNames(parsedContent));
          await handleSpeechOutput(lectureNames(parsedContent)); 
        } else if (parsedContent.content.includes("인성교양")) {
          test = true;
          console.log("test :" + test);
          handleOpen();
          setGraduationVoice(parsedContent.content);
         
          setTimeout(() => console.log(open), 0); 
          setTimeout(() => console.log(graduationVoice), 0);
        } else if (parsedContent.table === "school_location" && parsedContent.data && !parsedContent.content.includes('위치 정보를 찾을 수 없습니다')) {
          console.log(parsedContent.content);
          handleMapOpen(parsedContent);
          console.log("하이");
        }
      }
    } catch (error) {
      console.error("메세지 전송 에러:", error);
      console.log("메시지를 전송하는 과정에서 에러가 발생하였습니다.");
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
    } catch (error) {
      console.log("에러임")
    }
  };
  return (
   
      
    <div className="flex items-center justify-center min-h-screen bg-black">
   
      <div className="flex flex-col items-center justify-center w-full h-full space-y-20">
  
        <div className="flex justify-center items-center w-full">
          <TTSAnimation isSpeaking={isSpeaking} />
        </div>

     
        <div className="flex justify-center items-center">
          <button
            onClick={handleSpeechInput}
            disabled={isListening}
            className={`relative rounded-full border-2 p-6 ${
              isListening ? "border-transparent animate-ping" : "border-white"
            }`}
          >
         
            <span
              className={`absolute inset-0 rounded-full border-4 ${
                isListening ? "border-white" : "border-transparent"
              }`}
            ></span>

           
            <FaMicrophone className="text-2xl lg:text-4xl text-white relative z-20" />
          </button>
        </div>
        {maps.length > 0 && (
                    <MapComponent
                      coordinates={maps}
                      onClose={() => setMaps([])}
                    />
                  )}
      </div>
      

   
 
      {showModal && (
        <Dialog
          open={showModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseModal}
        >
          <DialogTitle>졸업요건</DialogTitle>
          <DialogContent>
            <DoughnutCharts content={graduationVoice} graduation={graduation} key={getTheme} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              닫기
            </Button>
          </DialogActions>
        </Dialog>
      )}

    
      <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
        <DialogTitle>졸업요건</DialogTitle>
        <DialogContent>
          <DoughnutCharts content={graduationVoice} graduation={graduation} key={getTheme} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    
    </div>
  );
};

export default ChatVoice;
