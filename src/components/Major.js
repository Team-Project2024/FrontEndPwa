import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Major = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [majors, setMajors] = useState([]);
  const [newMajors, setNewMajors] = useState([]); // 임시로 추가한 전공 목록
  const [open, setOpen] = useState(false); 
  const [newMajor, setNewMajor] = useState({ department: "", track: "" });

  const [showAddList, setShowAddList] = useState(true);

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

  const addMajor = () => {
    if (newMajor.department.trim() === "") {
      window.alert("학과를 입력해주세요");
      return;
    }
  
    // Check if the major already exists in the fetched majors
    if (majors.some(major => major.department === newMajor.department && major.track === newMajor.track)) {
      setOpen(true);
      return;
    }
  
    // Check if the major already exists in the new majors list
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

  const submitNewMajors = async () => {
    try {
      await axiosPrivate.post("/admin/major", { requestMajorList: newMajors });
      setNewMajors([]);
      fetchMajors();
      setShowAddList(false);
      window.alert("추가되었습니다");
    } catch (error) {
      console.error("Error adding majors:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">전공관리</h1>
      <div className="mb-8 flex justify-center">
        <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full max-w-2xl">
          <h2 className="text-3xl font-bold mb-6 text-center">전공 추가</h2>
          <input
            type="text"
            name="department"
            placeholder="학과"
            value={newMajor.department}
            onChange={handleChange}
            className="block w-full mb-6 p-4 border border-gray-400 rounded-lg text-xl"
          />
          <input
            type="text"
            name="track"
            placeholder="트랙"
            value={newMajor.track}
            onChange={handleChange}
            className="block w-full mb-6 p-4 border border-gray-400 rounded-lg text-xl"
          />
          <button
            onClick={addMajor}
            className="w-full py-4 bg-green-500 hover:bg-green-700 text-white text-2xl font-bold rounded-lg transition duration-300"
          >
            추가
          </button>
        </div>
      </div>
      {newMajors.length > 0 && (
        <div className="mt-8 bg-gray-200 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">추가된 전공</h2>
          {newMajors.map((major, index) => (
            <div key={index} className="mb-6 p-6 bg-white rounded-lg shadow-md">
              <div className="flex flex-col justify-between items-center">
                <span className="text-xl font-gmarket mb-2">학과: {major.department}</span>
                <span className="text-xl font-gmarket mb-2">트랙: {major.track}</span>
                <button
                  onClick={() => deleteMajor(index)}
                  className="text-2xl text-red-500  cursor-pointer ml-2 mt-4"
                >
                  <FaTrashAlt className="mr-1" />
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-8">
            <button
              onClick={submitNewMajors}
              className="py-4 px-8 bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold rounded-lg transition duration-300"
            >
              <FaPlus className="" /> 
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Major;
