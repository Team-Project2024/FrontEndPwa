import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";

const Major = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState({ department: "", track: "" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [majorsPerPage] = useState(5); // 페이지당 표시할 전공 수

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const response = await axiosPrivate.get("/admin/major");
      setMajors(response.data);
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  const addMajor = async () => {
    try {
      await axiosPrivate.post("/admin/major", {
        requestMajorList: [newMajor],
      });
      fetchMajors();
      setNewMajor({ department: "", track: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding major:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMajor((prevState) => ({ ...prevState, [name]: value }));
  };

  // 현재 페이지의 전공 목록 계산
  const indexOfLastMajor = currentPage * majorsPerPage;
  const indexOfFirstMajor = indexOfLastMajor - majorsPerPage;
  const currentMajors = majors.slice(indexOfFirstMajor, indexOfLastMajor);

  // 페이지 번호 변경
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto flex flex-col justify-center items-center overflow-y-auto">
      <h1 className="text-3xl font-bold mb-4">전공관리</h1>
      <div className="mb-4">
        {showAddForm ? (
          <div className="mt-4 p-4 border border-gray-300 rounded">
            <h2 className="text-xl font-bold mb-2">전공 추가</h2>
            <input
              type="text"
              name="department"
              placeholder="학과"
              value={newMajor.department}
              onChange={handleChange}
              className="block mb-2 border border-gray-300 p-2 rounded"
            />
            <input
              type="text"
              name="track"
              placeholder="트랙"
              value={newMajor.track}
              onChange={handleChange}
              className="block mb-2 border border-gray-300 p-2 rounded"
            />
            <button
              onClick={addMajor}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              전공 추가
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowAddForm(true)}
          >
            전공 추가
          </button>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">전공목록</h2>
        <ul>
          {currentMajors.map((major) => (
            <li key={major.majorId} className="mb-2">

              <div className="text-xl flex flex-col justify-center items-center rounded-xl bg-right-main shadow-2xl ">
                <div>
                  <h2 className=" mt-3 mb-3 font-gmarket">학과:{major.department}</h2>
                  {major.track && <h2  className="mb-3 font-gmarket ">트랙: {major.track}</h2>}

                </div>
              </div>
              {/* <span>학과: {major.department}</span>
              {major.track && <span>트랙: {major.track}</span>} */}
            </li>
          ))}
        </ul>
        {/* 페이지네이션 */}
        <ul className="flex justify-center">
          {Array.from({ length: Math.ceil(majors.length / majorsPerPage) }).map(
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
    </div>
  );
};

export default Major;
