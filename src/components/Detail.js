import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetailPage = () => {
  const { itemType, itemId } = useParams();
  const [detailInfo, setDetailInfo] = useState(null);

  useEffect(() => {
    const dataString = sessionStorage.getItem('contentData');
    if (dataString) {
      try {
        const data = JSON.parse(dataString);
        let detail = null;
        if (data.table === "lecture" && itemType === "lecture") {
          const parsedData = data.data; // JSON 배열로 이미 존재
          detail = parsedData.find(lecture => lecture.lectureId === parseInt(itemId));
        } else if (data.table === "event" && itemType === "event") {
          const parsedData = data.data; // JSON 배열로 이미 존재
          detail = parsedData.find(event => event.eventId === parseInt(itemId));
        }
        setDetailInfo(detail);
      } catch (error) {
        console.error('Error parsing contentData:', error);
      }
    }
  }, [itemType, itemId]);

  if (!detailInfo) {
    return <p>해당 항목을 찾을 수 없습니다.</p>;
  }

  return (
    <div>
      <h2>{itemType === 'lecture' ? detailInfo.lectureName : detailInfo.eventName}</h2>
      {itemType === 'lecture' ? (
        <div>
          <p>강의실: {detailInfo.room}</p>
          <p>강의 시간: {detailInfo.lectureTime}</p>
        </div>
      ) : (
        <div>
          <p>행사 장소: {detailInfo.room}</p>
        </div>
      )}
    </div>
  );
};

export default DetailPage;