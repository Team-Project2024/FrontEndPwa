import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const MajorList = ({ majors, currentPage, majorsPerPage, paginate }) => {
  const indexOfLastMajor = currentPage * majorsPerPage;
  const indexOfFirstMajor = indexOfLastMajor - majorsPerPage;

  // department와 track이 모두 있는 항목을 우선적으로 정렬
  const sortedMajors = majors.slice().sort((a, b) => {
    const aHasBoth = a.department && a.track ? 1 : 0;
    const bHasBoth = b.department && b.track ? 1 : 0;
    return bHasBoth - aHasBoth; // bHasBoth가 더 크면 b가 먼저 오게 함
  });

  const currentMajors = sortedMajors.slice(indexOfFirstMajor, indexOfLastMajor);

  return (
    <div className="overflow-y-auto  w-full p-1 md:p-4">
    <h2 className="text-2xl font-bold mb-4">전공목록</h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {currentMajors.map((major) => (
        <li key={major.majorId} className="bg-white p-4 rounded-lg shadow-md border-gray-10 border-4">
          <div className="text-sm md:text-xl border-gray-400">
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
              currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
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
  const [open, setOpen] = useState(false); 
  const [addOpen,setAddOpen] = useState(false);
  const [emptyOpen,setEmptyOpen] = useState(false);

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

  const handleClose = () => {
    setOpen(false);
  }
  const handleEmptyClose = () => {
    setEmptyOpen(false);
  }
  const handleAddClose = () => {
    setAddOpen(false);
  }

  const addMajor = () => {
    if (newMajor.department.trim() === "") {
      setEmptyOpen(!emptyOpen);
      return;
    }
  
    if (majors.some(major => major.department === newMajor.department && major.track === newMajor.track)) {
      setOpen(true);
      return;
    }
  
    if (newMajors.some(major => major.department === newMajor.department && major.track === newMajor.track)) {
      setOpen(true);
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
      setShowAddList(false);
      setAddOpen(!addOpen);
      
    } catch (error) {
      console.error("Error adding majors:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">전공관리</h1>
      <div className="mb-4 md:mb-8 flex justify-center ">
        <div className="bg-gray-200 p-4 md:p-8 rounded-lg shadow-lg w-full max-w-xl">
          <h2 className="text-sm md:text-3xl font-bold mb-4 md:mb-6 text-center">전공 추가</h2>
          <input
            type="text"
            name="department"
            placeholder="학과"
            value={newMajor.department}
            onChange={handleChange}
            className="block w-full mb-2 md:mb-6 p-2 md:p-4 border border-gray-400 rounded-lg text-sm sm:text-xl"
          />
          <input
            type="text"
            name="track"
            placeholder="트랙"
            value={newMajor.track}
            onChange={handleChange}
            className="block w-full mb-2 md:mb-6 p-2 md:p-4 border border-gray-400 rounded-lg text-sm sm:text-xl"
          />
          <div className="flex flex-row justify-center items-center">
            <button
              onClick={addMajor}
              className="w-full md:w-1/2 text-lg md:text-xl font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg bg-gradient-to-tr from-gray-700 to-gray-600 text-white shadow-md hover:shadow-lg active:opacity-85"
            >
              추가
            </button>
          </div>
        </div>
      </div>
      {newMajors.length > 0 && (
        <div className="mt-4 md:mt-8 bg-gray-200 p-4 md:p-8 rounded-lg shadow-lg">
          <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">추가된 전공</h2>
          {newMajors.map((major, index) => (
            <div key={index} className="mb-4 md:mb-6 p-4 md:p-6 bg-white rounded-lg shadow-md">
              <div className="flex flex-col justify-between items-center">
                <span className="text-lg md:text-xl mb-2 font-gmarket">학과: {major.department}</span>
                <span className="text-lg md:text-xl mb-2 font-gmarket">트랙: {major.track}</span>
                <button
                  onClick={() => deleteMajor(index)}
                  className="text-2xl text-red-500 cursor-pointer ml-2 mt-4"
                >
                  <FaTrashAlt className="mr-1" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-row justify-center items-center">
            <button
              onClick={submitNewMajors}
              className="w-full md:w-1/2 text-lg md:text-xl font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg bg-gradient-to-tr from-gray-400 to-gray-400 text-white shadow-md hover:shadow-lg active:opacity-85"
            >
              추가된 전공리스트 전송
            </button>
          </div>
        </div>
      )}

      <MajorList
        majors={majors}
        currentPage={currentPage}
        majorsPerPage={majorsPerPage}
        paginate={paginate}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>전공 추가 실패</DialogTitle>
        <DialogContent>
          이미 추가된 전공입니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={emptyOpen} onClose={handleEmptyClose}>
        <DialogTitle>입력되지않음</DialogTitle>
        <DialogContent>
          입력해주세요
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmptyClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle>전공리스트 전송성공</DialogTitle>
        <DialogContent>
          성공적으로 전공리스트가 추가되었습니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Major;
