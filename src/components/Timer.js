import { useEffect } from "react";



const Timer = ({ count, setCount }) => {
    const formatTime = time => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;
    };
  
    useEffect(() => {
      const id = setInterval(() => {
        setCount(count => count - 1);
      }, 1000);
  
      if (count === 0) {
        clearInterval(id);
      }
      return () => clearInterval(id);
    }, [count]);
  
    return (
      <div className="timerContainer">
        <span className="timerText">{formatTime(count)}</span>
      </div>
    );
  };