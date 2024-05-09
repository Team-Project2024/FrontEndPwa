import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthContext from "../context/AuthProvider";
import moment from 'moment';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ eventName: '', eventPeriod: '', description: '' });
  const [editedEvent, setEditedEvent] = useState({ id: '', eventName: '', eventPeriod: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();

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

  const addEvent = async () => {
    try {
      const eventPeriod = `${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(endDate).format('YYYY-MM-DD')}`;
      await axiosPrivate.post('/admin/event', { requestEventList: [{ ...newEvent, eventPeriod }] });
      fetchEvents();
      setNewEvent({ eventName: '', eventPeriod: '', description: '' });
      setShowAddForm(false);
      console.log(newEvent)
      window.alert('행사추가완료');
    } catch (error) {
      console.error('Error adding event:', error);
      console.log(newEvent);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axiosPrivate.put(`/admin/event/cancle?eventId=${eventId}`);
      fetchEvents();
      console.log(eventId)
    } catch (error) {
      console.error('Error cancelling event:', error);
      console.log(eventId)
    }
  };

  const updateEvent = async () => {
    try {
      const eventPeriod = `${moment(startDate).format('YYYY-MM-DD')} ~ ${moment(endDate).format('YYYY-MM-DD')}`;
      await axiosPrivate.put('/admin/event/update', { ...editedEvent, eventPeriod });
      fetchEvents();
      setEditedEvent({ id: '', eventName: '', eventPeriod: '', description: '' });
      setShowEditForm(false);
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
    setSelectedEventId(eventId);
    setShowEditForm(true);
    const selectedEvent = events.find(event => event.eventId === eventId);
    setEditedEvent(selectedEvent);
    // 시작일과 종료일 초기화
    setStartDate(new Date(selectedEvent.eventPeriod.split(' ~ ')[0]));
    setEndDate(new Date(selectedEvent.eventPeriod.split(' ~ ')[1]));
  };

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
      <div>
        <h2 className="text-xl font-bold mb-2">행사</h2>
        <ul>
          {events.map(event => (
            <li key={event.eventId} className="mb-2">
               <span className="mr-4">{event.eventId}</span>
              <span className="mr-4">{event.eventName}</span>
              <span className="mr-4">{event.eventPeriod}</span>
              <span className="mr-4">{event.description}</span>
              <span className="mr-4">{event.modified}</span>
              <span className="mr-4">{event.is_cancled}</span>
              <button onClick={() => deleteEvent(event.eventId)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">행사 취소</button>
              <button onClick={() => handleEditClick(event.eventId)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">행사 수정</button>
            </li>
          ))}
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
    </div>
  );
};

export default Event;
