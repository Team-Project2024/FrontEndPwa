import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthContext from "../context/AuthProvider";
import moment from 'moment';

const Event = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [events, setEvents] = useState([]);
  const [newEvents, setNewEvents] = useState([]); // 임시로 추가한 이벤트 목록
  const [newEvent, setNewEvent] = useState({ eventName: '', eventPeriod: '', description: '' });
  const [editedEvent, setEditedEvent] = useState({ id: '', eventName: '', eventPeriod: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedEventIndex, setSelectedEventIndex] = useState(-1); 
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5); // 페이지당 표시할 전공 수


  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axiosPrivate.get('/admin/event');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const addEvent = () => {

    if(newEvent.description.length  <= 0  || newEvent.eventName.length <= 0 ){
      window.alert('행사명/행사설명을 기재해주세요')
      return;
    }
    // eventPeriod를 설정합니다.
    const eventPeriod = `${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(endDate).format('YYYY-MM-DD')}`;
    // 새로운 이벤트를 임시 목록에 추가할 때 eventPeriod도 함께 추가합니다.
    setNewEvents([...newEvents, { ...newEvent, eventPeriod }]);
    setNewEvent({ eventName: '', eventPeriod: '', description: '' });
  };

  const deleteEvent = async (eventId) => {
    try {
      await axiosPrivate.put(`/admin/event/cancel?eventId=${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error cancelling event:', error);
    }
  };

  const updateEvent = async () => {
    try {
      const eventPeriod = `${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(endDate).format('YYYY-MM-DD')}`;
      await axiosPrivate.put('/admin/event/update', { ...editedEvent, eventPeriod });
      fetchEvents();
      setEditedEvent({ id: '', eventName: '', eventPeriod: '', description: '' });
      setShowEditForm(false);
      window.alert('성공');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({ ...prevState, [name]: value }));
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditClick = (eventId) => {
    setShowEditForm(true);
    const selectedEvent = events.find(event => event.eventId === eventId);
    setEditedEvent(selectedEvent);
    // 시작일과 종료일 초기화
    setStartDate(new Date(selectedEvent.eventPeriod.split(' ~ ')[0]));
    setEndDate(new Date(selectedEvent.eventPeriod.split(' ~ ')[1]));
  };

  const submitNewEvents = async () => {
    try {
      console.log(newEvents)
      // 서버에 새로운 이벤트들을 전송
      await axiosPrivate.post("/admin/event", { requestEventList: newEvents });
      // 전송 후 임시 목록 초기화
      setNewEvents([]);
      // 이벤트 목록 다시 불러오기
      fetchEvents();
      // 추가 폼 닫기
      setShowAddForm(false);

      window.alert('이벤트가 추가되었습니다');
    } catch (error) {
      console.error("Error adding events:", error);
      
    }
  };

  const handleDeleteFromNewEvents = (index) => {
    // 선택한 이벤트를 추가된 이벤트 목록에서 삭제
    const updatedNewEvents = [...newEvents];
    updatedNewEvents.splice(index, 1);
    setNewEvents(updatedNewEvents);
    // 선택 해제
    setSelectedEventIndex(-1);
  };


  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  // 페이지 번호 변경
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">행사관리</h1>
      <div className="mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowAddForm(!showAddForm)}>행사 추가</button>
        {showAddForm && (
          <div className="mt-4 p-4 border border-gray-300 rounded">
            <input type="text" name="eventName" placeholder="행사명" value={newEvent.eventName} onChange={handleChangeNew} className="block mb-2 border border-gray-300 p-2 rounded" />
            <div className="flex mb-2">
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="border border-gray-300 p-2 rounded" />
              <span className="mx-2">~</span> {/* 공백 제거 */}
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="border border-gray-300 p-2 rounded" />
            </div>
            <textarea type="text" name="description" placeholder="행사설명" value={newEvent.description} onChange={handleChangeNew} className="block mb-2  w-full border border-gray-300 p-2 rounded" />
            <button onClick={addEvent} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">행사추가</button>
          </div>
        )}
      </div>
      <div className="auto">
        <h2 className="text-xl font-bold mb-2 justify-center items-center ml-8">행사</h2>
        <ul>
          {currentEvents.map(event => (
            <div key={event.eventId} className="mb-2 border-4">
              <div className="border-4 border-gray-400 rounded-md">
              <span className="mr-4">{event.eventName}</span>
              </div>
             
              <span className="mr-4">{event.eventPeriod}</span>
              <span className="mr-4">{event.description}</span>
              <span className="mr-4">{event.modified.toString()}</span>
              <span className="mr-4">{event.canceld}</span>
              <button onClick={() => deleteEvent(event.eventId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">행사 취소</button>
              <button onClick={() => handleEditClick(event.eventId)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">행사 수정</button>
            </div>
          ))}
        </ul>
          {/* 페이지네이션 */}
          <ul className="flex justify-center">
          {Array.from({ length: Math.ceil(events.length / eventsPerPage) }).map(
            (_, index) => (
              <li
                key={index}
                onClick={() => paginate(index + 1)}
                className={`cursor-pointer mx-1 ${
                  currentPage === index + 1 ? "font-bold" : ""
                }`}
              >
                {index + 1}
              </li>
            )
          )}
        </ul>
      </div>
      {showEditForm && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-bold mb-2">수정</h2>
          <input type="text" name="eventName" placeholder="Event Name" value={editedEvent.eventName} onChange={handleChangeEdit} className="block mb-2 border border-gray-300 p-2 rounded" />
          <div className="flex mb-2">
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="border border-gray-300 p-2 rounded" />
            <span className="mx-2">~</span> {/* 공백 제거 */}
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="border border-gray-300 p-2 rounded" />
          </div>
          <input type="text" name="description" placeholder="Description" value={editedEvent.description} onChange={handleChangeEdit} className="block mb-2 border border-gray-300 p-2 rounded" />
          <button onClick={updateEvent} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Event</button>
        </div>
      )}
      {newEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">추가된 이벤트 목록</h2>
          <ul>
            {newEvents.map((newEvent, index) => (
              <li key={index} className="mb-2">
                <span className="mr-4">{newEvent.eventName}</span>
                <span className="mr-4">{newEvent.eventPeriod}</span>
                <span className="mr-4">{newEvent.description}</span>
                <button onClick={() => handleDeleteFromNewEvents(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">삭제</button>
              </li>
            ))}
          </ul>
          <button onClick={submitNewEvents} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">이벤트 추가하기</button>
        </div>
      )}
    </div>
  );
};

export default Event;
