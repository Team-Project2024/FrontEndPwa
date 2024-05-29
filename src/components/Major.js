import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import { FaTrashAlt } from "react-icons/fa";

const MajorList = ({ majors, currentPage, majorsPerPage, paginate }) => {
  const indexOfLastMajor = currentPage * majorsPerPage;
  const indexOfFirstMajor = indexOfLastMajor - majorsPerPage;
  const currentMajors = majors.slice(indexOfFirstMajor, indexOfLastMajor);

  return (
    <div className="overflow-auto w-full p-4">
      <h2 className="text-2xl font-bold mb-4">전공목록</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentMajors.map((major) => (
          <li key={major.majorId} className="bg-white p-4 rounded-lg shadow-md border-gray-10 border-4 px-4">
            <div className="text-xl border-gray-400 px-4">
              <h2 className="mt-3 mb-2 font-gmarket">학과: {major.department}</h2>
              {major.track && <h2 className="mb-2 font-gmarket">트랙: {major.track}</h2>}
            </div>
          </li>
        ))}
      </ul>
      <ul className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(majors.length / majorsPerPage) }).map(
          (_, index) => (
            <li
              key={index}
              onClick={() => paginate(index + 1)}
              className={`cursor-pointer mx-2 px-3 py-1 rounded-full ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

const NewMajorForm = ({ newMajor, handleChange, addMajor }) => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
    <h2 className="text-2xl font-bold mb-4">전공 추가</h2>
    <input
      type="text"
      name="department"
      placeholder="학과"
      value={newMajor.department}
      onChange={handleChange}
      className="block w-full mb-4 border border-gray-300 p-2 rounded"
    />
    <input
      type="text"
      name="track"
      placeholder="트랙"
      value={newMajor.track}
      onChange={handleChange}
      className="block w-full mb-4 border border-gray-300 p-2 rounded"
    />
    <button
      onClick={addMajor}
      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
    >
      추가
    </button>
  </div>
);

const Major = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [majors, setMajors] = useState([]);
  const [newMajors, setNewMajors] = useState([]); // 임시로 추가한 전공 목록
  const [newMajor, setNewMajor] = useState({ department: "", track: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddList, setShowAddList] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [majorsPerPage] = useState(100); // 페이지당 표시할 전공 수

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const response = await axiosPrivate.get("/admin/major");
      setMajors(response.data.responseMajorDTOList);
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  const addMajor = () => {
    if (newMajor.department.trim() === "") {
      window.alert("학과를 입력해주세요");
      return;
    }

    if (newMajors.some(major => major.department === newMajor.department && major.track === newMajor.track)) {
      window.alert("이미 추가된 전공입니다.");
      return;
    }

    setNewMajors([...newMajors, newMajor]);
    setNewMajor({ department: "", track: "" });
  };

  const deleteMajor = (index) => {
    const updatedMajors = [...newMajors];
    updatedMajors.splice(index, 1);
    setNewMajors(updatedMajors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMajor((prevState) => ({ ...prevState, [name]: value }));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const submitNewMajors = async () => {
    try {
      await axiosPrivate.post("/admin/major", { requestMajorList: newMajors });
      setNewMajors([]);
      fetchMajors();
      setShowAddForm(false);
      setShowAddList(false);
      window.alert("추가되었습니다");
    } catch (error) {
      console.error("Error adding majors:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">전공관리</h1>
      <div className="mb-4">
        {showAddList ? (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <ul>
              {newMajors.map((major, index) => (
                <li key={index} className="mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="mt-3 mb-2 font-gmarket">학과: {major.department}</h2>
                    {major.track && <h2 className="mb-2 font-gmarket">트랙: {major.track}</h2>}
                    <button
                        onClick={(e) => {
                        
                          deleteMajor(index);
                        }}
                        className="text-2xl text-red-500 dark:text-gray-200 cursor-pointer ml-2"
                      >
                        <FaTrashAlt className="mr-1" />
                      </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4">
              <button
                onClick={submitNewMajors}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                전송
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowAddList(false)}
              >
                추가리스트 닫기
              </button>
            </div>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowAddList(true)}
          >
            추가리스트 보기
          </button>
        )}
        {showAddForm ? (
          <NewMajorForm newMajor={newMajor} handleChange={handleChange} addMajor={addMajor} />
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => setShowAddForm(true)}
          >
            전공 추가
          </button>
        )}
      </div>
      <MajorList
        majors={majors}
        currentPage={currentPage}
        majorsPerPage={majorsPerPage}
        paginate={paginate}
      />
    </div>
  );
};

export default Major;
