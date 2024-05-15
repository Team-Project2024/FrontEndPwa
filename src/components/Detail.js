import React from "react";
import { useParams, useLocation } from "react-router-dom";

const DetailPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;

  // 디버깅용 로그
  console.log("Params itemType:", state.itemType); 
  console.log("Params itemId:", state.itemId);
  console.log("State:", state);

 

  let detailInfo;
  if (state && state.content) {
    if (state.itemType === "lecture" && state.content.lecture) {
      detailInfo = state.content.lecture.data.find(lecture => lecture.lectureId === parseInt(state.itemId));
    } else if (state.itemType === "event" && state.content.event) {
      detailInfo = state.content.event.data.find(event => event.eventId === parseInt(state.itemId));
    }
  }

  return (
    <div>
      {detailInfo ? (
        <div>
          <h2>{state.itemType === 'lecture' ? detailInfo.lectureName : detailInfo.eventName}</h2>
          <p>{detailInfo.description}</p>
          {state.itemType === 'lecture' ? (
            <div>
              <p>강의실: {detailInfo.room}</p>
              <p>강의 시간: {detailInfo.lectureTime}</p>
            </div>
          ) : (
            <div>
              <p>장소: {detailInfo.room}</p>
            </div>
          )}
        </div>
      ) : (
        <p>해당 항목을 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default DetailPage;