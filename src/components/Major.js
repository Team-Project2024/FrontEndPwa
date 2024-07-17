import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import { FaTrashAlt, FaPlus, FaMinus } from "react-icons/fa";
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

  return ( //shadow-[0_0_10px_0_rgba(0,0,0,0.45)] 
    <div className="overflow-y-auto  w-full p-1 sm:p-4  ">
      <h2 className="font-gmarket text-2xl md:text-3xl font-bold mb-4 mt-4">전공목록</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentMajors.map((major) => (
          <li key={major.majorId} className="bg-white p-6 border-2 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] border-dashed border-gray-400">

            <h2 className="mt-3 mb-2 text-xl font-bold font-gmarket"> {major.department}</h2>
            {major.track && <p className="mb-2 text-md font-gmarket"> {major.track}</p>}

          </li>
        ))}
      </ul>
      <ul className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(majors.length / majorsPerPage) }).map(
          (_, index) => (
            <li
              key={index}
              onClick={() => paginate(index + 1)}
              className={`cursor-pointer mx-2 px-3 py-1  rounded-full  ${currentPage === index + 1 ? "bg-blue-500 hover:bg-blue-500 text-white" : "bg-gray-200 hover:bg-blue-200"
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
  const [addOpen, setAddOpen] = useState(false);
  const [emptyOpen, setEmptyOpen] = useState(false);
  const [showFormMajor, setShowFormMajor] = useState(false);

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

  return (//!!!!!!!!!!!!!!!!!!!!! lg:bg-gray-600 mx-auto
    <div className="container mx-auto  p-4 md:p-8 items-center">
      <h1 className="font-gmarket text-4xl md:text-6xl font-bold mt-8 sm:mt-0 mb-4 sm:mb-8 text-center">전공관리</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {

            setShowFormMajor(!showFormMajor);
          }}
          className="text-2xl text-blue-500 dark:text-gray-200 cursor-pointer ml-2 "
        >
          {showFormMajor ? <FaMinus className="mr-1 text-red-500 hover:text-red-600" /> : <FaPlus className="mr-1 text-blue-500 hover:text-blue-600" />}
        </button>
      </div>
      {showFormMajor && (
        <>
          <div className="mb-4 md:mb-8 flex justify-center ">
            <div className="bg-gray-100  rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)]   p-4 md:p-8 w-full max-w-xl">
              <h2 className="font-gmarket text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">전공 추가</h2>
              <input
                type="text"
                name="department"
                placeholder="학과"
                value={newMajor.department}
                onChange={handleChange}
                className="block w-full mb-2 md:mb-3 p-2 md:p-4 border border-gray-400 rounded-lg text-sm sm:text-xl"
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
                  className={`w-full md:w-1/2 text-l md:text-lg font-bold py-2 md:py-3 px-4 md:px-6 rounded-lg ${(newMajor.department || newMajor.track) ? 'bg-gray-600 hover:bg-blue-500 hover:shadow-lg' : 'bg-gray-400'
                    } text-white shadow-md active:opacity-85 `}
                >
                  추가
                </button>
              </div>
            </div>
          </div>

          {newMajors.length > 0 && (//
            <div className="bg-gray-100 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] p-4 md:p-8 w-full max-w-xl   mx-auto mt-4 mb-20 md:mt-8 ">
              <h2 className="font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">리스트</h2>
              {newMajors.map((major, index) => (
                <div key={index} className="mb-4 md:mb-6 p-4 md:p-6   hover:scale-105     bg-white border-2 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] border-dashed border-gray-400">
                  <div className="flex flex-col justify-between items-center">
                    <span className="font-bold text-xl md:text-2xl mb-2 font-gmarket">{major.department}</span>{/*학과*/}
                    <span className="text-md md:text-xl mb-2 font-gmarket">{major.track}</span>{/*트랙*/}

                  </div>
                  <div className="flex flex-row justify-end">
                    <button
                      onClick={() => deleteMajor(index)}
                      className="text-xl md:text-2xl text-red-500 hover:text-red-600 cursor-pointer ml-2"
                    >
                      <FaTrashAlt className="mr-1" />
                    </button>
                  </div>

                </div>
              ))}
              <div className="flex flex-row justify-center items-center ">
                <button
                  onClick={submitNewMajors}
                  className="w-full md:w-1/2 text-l md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85"
                >
                  리스트 전송
                </button>
              </div>
            </div>
          )}
        </>
      )}


      <MajorList
        majors={majors}
        currentPage={currentPage}
        majorsPerPage={majorsPerPage}
        paginate={paginate}
      />

      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle classname=''>전공 추가 실패</DialogTitle>
        <DialogContent>
          이미 추가된 전공입니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog> */}
      {/*다이얼로그 모달 수정 방법..*/}
      <Dialog open={open} onClose={handleClose} maxWidth="sm"
        PaperProps={{ className: "bg-white w-auto" }}>

        <DialogTitle as="h3" className="text-xl text-bold bg-gray-200 font-gmarket text-start mb-2">전공 추가 실패</DialogTitle>
        <DialogContent className="text-start font-gmarket  mb-4">이미 추가된 전공입니다.</DialogContent>
        <DialogActions >
          <Button onClick={handleClose} color="primary">닫기</Button>
        </DialogActions>

      </Dialog>

      <Dialog open={emptyOpen} onClose={handleEmptyClose} maxWidth="sm"
        PaperProps={{ className: "bg-white w-auto" }}>
        <DialogTitle as="h3" className="text-xl text-bold bg-gray-200 font-gmarket text-start mb-2">입력되지않음</DialogTitle>
        <DialogContent className="text-start font-gmarket  mb-4">
          학과/트랙이 입력되지않았습니다
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmptyClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm"
        PaperProps={{ className: "bg-white w-auto" }}>
        <DialogTitle as="h3" className="text-xl text-bold bg-gray-200 font-gmarket text-start mb-2">전공리스트 전송성공</DialogTitle>
        <DialogContent className="text-start font-gmarket  mb-4">
          성공적으로 전공리스트가 추가되었습니다.
        </DialogContent >
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
