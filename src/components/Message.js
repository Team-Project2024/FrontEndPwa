import React from "react";

const Message = ({ message, handleItemClick }) => {
  // 메시지 타입이 'user'인 경우와 'bot'인 경우에 따라 다르게 렌더링
  if (message.type === 'user') {
    return (
      <div className="text-right mb-2">
        <p className="inline-block py-2 px-4 rounded bg-blue-100 text-blue-800">
          {message.content}
        </p>
      </div>
    );
  } else if (message.type === 'bot') {
    return (
      <div className="text-left mb-2">
        <p className="inline-block py-2 px-4 rounded bg-gray-100 text-gray-800">
          {message.content.content} {/* 객체의 content 속성을 렌더링 */}
        </p>
        {/* 답변에 따라 추가 정보를 렌더링 */}
        {message.content.table === 'lecture' && message.content.data && (
          <div>
            <ul>
              {message.content.data.map((lecture, idx) => (
                <li key={lecture.lectureId} onClick={() => handleItemClick('lecture', lecture.lectureId)}>
                  <span>{idx + 1}.{lecture.lectureName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {message.content.table === 'event' && message.content.data && (
          <div>
            <ul>
              {message.content.data.map((event, idx) => (
                <li key={event.eventId} onClick={() => handleItemClick('event', event.eventId)}>
                  <span>{idx + 1}.{event.eventName}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
};

export default Message;