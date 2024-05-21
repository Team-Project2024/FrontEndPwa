import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { itemType, itemId } = useParams(); // itemType과 itemId 받기
  const [detailInfo, setDetailInfo] = useState(null);

  useEffect(() => {
    const dataString = sessionStorage.getItem('contentData');
    if (dataString) {
      const data = JSON.parse(dataString);
      let detail = null;
      if (itemType === "lecture" && data.lecture) {
        detail = data.lecture.data.find(lecture => lecture.lectureId === parseInt(itemId));
      } else if (itemType === "event" && data.event) {
        detail = data.event.data.find(event => event.eventId === parseInt(itemId));
      }
      setDetailInfo(detail);
    }
  }, [itemType, itemId]);

  if (!detailInfo) {
    return <p>해당 항목을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h2>{itemType === 'lecture' ? detailInfo.lectureName : detailInfo.eventName}</h2>
      <p>{detailInfo.description}</p>
      {itemType === 'lecture' ? (
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
  );
};

export default DetailPage;