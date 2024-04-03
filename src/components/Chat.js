import { useState, useEffect,useContext} from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate, useLocation,Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AuthContext from "../context/AuthProvider";


const Chat =() => {
    
    const [userMessages, setUserMessages] = useState([]); // 사용자의 메시지저장
    const [botMessages, setBotMessages] = useState([]); // 챗봇의 답변저장
    const [inputText, setInputText] = useState('');
    const { auth } = useContext(AuthContext);

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
      <div>
      <div>
        {userMessages.map((userMessage, index) => (
          <div key={index} className="message-container">
            <div className="user-message">{userMessage}</div>
            <div className="bot-message">{botMessages[index]}</div>
          </div>
        ))}
      </div>
  
      <input value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <button onClick={sendMessage}>전송</button>
      <Link to="/">홈페이지로 이동</Link>
    </div>

    )
}

export default Chat