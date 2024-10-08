import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import {  FaTrashAlt,FaPlus } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Graduation = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState("");
  const [major, setMajor] = useState([]);
  const [open, setOpen] = useState(false); 
  const [graduationList, setGraduationList] = useState([]);
  const [errOpen,setErrOpen] = useState(false);
  const [emptyOpen,setEmptyOpen] = useState(false);


  const [graduationRequirements, setGraduationRequirements] = useState({
    characterCulture: 1,
    basicLiberalArts: 1,
    generalLiberalArts: 1,
    majorCommon: 1,
    majorAdvanced: 1,
    freeChoice: 1,
    graduationCredits: 6,
    msc: 1,
    majorId: 1
  });

  useEffect(() => {
    fetchYears();
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const response = await axiosPrivate.get("/admin/major/all");
      setMajor(response.data.responseMajorDTOList);
    } catch (error) {
      console.error("전공 받아오기실패:", error);
    }
  };

  const fetchYears = () => {
    const currentYear = new Date().getFullYear();
    const yearsArray = Array.from({ length: 10 }, (_, index) => (currentYear + 3 - index).toString());
    setYears(yearsArray);
  };

  const handleYearChange = (e) => {
    const { value } = e.target;
    setSelectedYear(value);
    setGraduationRequirements((prevState) => ({
      ...prevState,
      year: value
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGraduationRequirements((prevState) => ({
      ...prevState,
      [name]: parseInt(value)
    }));
  };

  const addGraduationRequirement = () => {
    if (selectedYear === "") {
      setEmptyOpen(!emptyOpen);
      return;
    } else if (graduationRequirements.majorId === "") {
      setEmptyOpen(!emptyOpen);
      return;
    }

    const newRequirement = { ...graduationRequirements };
    setGraduationList([...graduationList, newRequirement]);
    setGraduationRequirements({
      characterCulture: 1,
      basicLiberalArts: 1,
      generalLiberalArts: 1,
      majorCommon: 1,
      majorAdvanced: 1,
      freeChoice: 1,
      graduationCredits: 6,
      msc: 1,
      majorId: 1
    });
  };

  const removeGraduationRequirement = (index) => {
    const updatedList = [...graduationList];
    updatedList.splice(index, 1);
    setGraduationList(updatedList);
  };

  const submitGraduationRequirements = async () => {
    try {
      await axiosPrivate.post("/admin/graduation", { requestGRList: graduationList });

      setOpen(!open);
     
    

      setGraduationList([]);
    } catch (error) {

      setErrOpen(!errOpen);
      console.error("Error adding graduation requirements:", error);
     

     
    }
  };

  const handleClose = () => {
    setOpen(false);
  }

  const handleErrClose = () => {
    setErrOpen(false);
  }

  const handleEmptyClose = () => {
    setEmptyOpen(false);
  }

  return (//!!!!!!!!!!!!!!!!!!! lg:bg-gray-600
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-gmarket text-3xl md:text-6xl font-bold mt-8 sm:mt-0 mb-4 sm:mb-8 text-center">졸업요건 추가</h1>

      <div className="flex justify-center mb-6">
        <label className="font-gmarket mr-4 mt-3 rounded-full" htmlFor="year">
          학번:
        </label>
        <select
          className="p-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-full shadow-lg"
          id="year"
          onChange={handleYearChange}
          value={selectedYear}
        >
          <option value="">학번선택</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-6">
        <div className="font-gmarket grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "인성교양", name: "characterCulture" },
            { label: "기초교양", name: "basicLiberalArts" },
            { label: "일반교양", name: "generalLiberalArts" },
            { label: "전공공통", name: "majorCommon" },
            { label: "전공심화", name: "majorAdvanced" },
            { label: "자유선택", name: "freeChoice" },
            { label: "졸업학점", name: "graduationCredits" },
            { label: "MSC", name: "msc" }
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="font-gmarket">{label}:</label>
              <select
                className="ml-3 mb-4 p-2 border border-gray-300 rounded-full shadow-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                name={name}
                value={graduationRequirements[name]}
                onChange={handleChange}
              >
                {Array.from({ length: 100 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div>
            <label className="font-gmarket">전공:</label>
            <select
              className="ml-3 mb-4 p-2 border border-gray-300 rounded-full shadow-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={graduationRequirements.majorId}
              onChange={(e) =>
                setGraduationRequirements({ ...graduationRequirements, majorId: e.target.value })
              }
            >
              <option value="">전공선택</option>
              {major.map((major) => (
  <option key={major.majorId} value={major.majorId}>
    {major.department} {major.track && `(${major.track})`}
  </option>
))}
            </select>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center">
        <button
            className="w-full md:w-1/2 text-l md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg ml-5 bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85"
            onClick={addGraduationRequirement}
          >
             추가
          </button>
        
        </div>
      </div>

      {graduationList.length > 0 && (
        <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="font-gmarket text-xl md:text-3xl font-bold mb-4 md:mb-6 text-center">리스트</h2>
          {graduationList.map((requirement, index) => (
             <div key={index} className="mb-4 md:mb-6 p-4 md:p-6   hover:scale-105     bg-white border-2 rounded-lg shadow-[0_3px_6px_rgba(0,0,0,0.23)] border-dashed border-gray-400">
              <div className="flex justify-between items-center">
                <span className=" text-xl md:text-2xl font-gmarket font-bold"> {index + 1}번</span>
                <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGraduationRequirement(index);
                        }}
                        className="text-xl md:text-2xl text-red-500 hover:text-red-600 cursor-pointer ml-2"
                      >
                        <FaTrashAlt className="mr-1" />
                      </button>

                
              </div>
              <div className="mt-2">
                <p className="font-gmarket">인성교양: {requirement.characterCulture}</p>
                <p className="font-gmarket">기초교양: {requirement.basicLiberalArts}</p>
                <p className="font-gmarket">일반교양: {requirement.generalLiberalArts}</p>
                <p className="font-gmarket">전공공통: {requirement.majorCommon}</p>
                <p className="font-gmarket">전공심화: {requirement.majorAdvanced}</p>
                <p className="font-gmarket">자유선택: {requirement.freeChoice}</p>
                <p className="font-gmarket">졸업학점: {requirement.graduationCredits}</p>
                <p className="font-gmarket">MSC: {requirement.msc}</p>
              </div>
            </div>
          ))}
          <div className="flex flex-row justify-center items-center">
          <button
            className="w-full md:w-1/2 text-l md:text-lg font-bold py-2 md:py-3 px-3 md:px-0 rounded-lg bg-gray-600 hover:bg-blue-500 hover:shadow-lg text-white shadow-md hover:shadow-lg active:opacity-85"
            onClick={submitGraduationRequirements}
          >
             리스트 전송
          </button>
            </div>

           
        </div>
        
      )}




<Dialog open={open} onClose={handleClose}maxWidth="sm"
        PaperProps={{ className: "bg-white w-auto" }}>
        <DialogTitle as="h3" className="text-xl text-bold bg-gray-200 font-gmarket text-start mb-2">졸업요건추가 성공</DialogTitle>
        <DialogContent className="text-start font-gmarket  mb-4">
          졸업요건 리스트가 추가되었습니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={emptyOpen} onClose={handleEmptyClose}>
        <DialogTitle>전공 추가 실패</DialogTitle>
        <DialogContent>
        학번이나 전공이 선택되어있지않습니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEmptyClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={errOpen} onClose={handleErrClose}>
        <DialogTitle>전공 추가 실패</DialogTitle>
        <DialogContent>
        추가된 졸업요건이 없거나 이미 등록된 졸업요건과 동일한 졸업요건이 존재합니다.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Graduation;
