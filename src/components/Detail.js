import React from "react";
import TestJson from "../image/TestJson.json";
import AuthContext from "../context/AuthProvider";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DetailPage = () => {
  const { lectureId } = useParams(); // lectureId 가져오기

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useContext(AuthContext);

  // 해당 lectureId를 가진 강의 정보 찾기
  const lecture = TestJson.Data.find((item) => item.lectureId === parseInt(lectureId));

  // 해당 eventId를 가진 이벤트 정보 찾기
  const event = TestJson.Data.find((item) => item.eventId === parseInt(lectureId));

  if (lecture) {
    return (
      <div>
        <h2>{lecture.lectureName}</h2>
        <p>강의실: {lecture.room}</p>
        <p>학점: {lecture.credit}</p>
        <p>시간: {lecture.lectureTime}</p>
        {/* 나머지 강의 정보를 표시하세요 */}
      </div>
    );
  } else if (event) {
    return (
      <div>
        <h2>{event.eventName}</h2>
        <p>장소: {event.room}</p>
        {/* 나머지 이벤트 정보를 표시하세요 */}
      </div>
    );
  } else {
    return <div>해당 정보를 찾을 수 없습니다.</div>;
  }
};

export default DetailPage
