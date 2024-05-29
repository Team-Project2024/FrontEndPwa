import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import {  FaTrashAlt,FaPlus } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const Graduation = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMajorId, setSelectedMajorId] = useState("");
  const [major, setMajor] = useState([]);
  const [open, setOpen] = useState(false); 
  const [graduationList, setGraduationList] = useState([]);
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
      const response = await axiosPrivate.get("/admin/major");
      setMajor(response.data.responseMajorDTOList);
    } catch (error) {
      console.error("Error fetching majors:", error);
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
      window.alert("학번을 선택해주세요");
      return;
    } else if (graduationRequirements.majorId === "") {
      window.alert("전공을 선택해주세요");
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
      console.log("성공");
      window.alert("성공");

      setGraduationList([]);
    } catch (error) {
      console.error("Error adding graduation requirements:", error);
      window.alert("추가된 졸업요건이 없거나 \n이미 등록된 졸업요건과 동일한 졸업요건이 존재합니다.");

      console.log(graduationList);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">졸업요건 추가</h1>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300"
            onClick={addGraduationRequirement}
          >
            졸업요건 추가
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 ml-2"
            onClick={submitGraduationRequirements}
          >
            졸업요건 제출
          </button>
        </div>
      </div>

      {graduationList.length > 0 && (
        <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">추가된 졸업요건</h2>
          {graduationList.map((requirement, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <span className="font-gmarket">추가된 졸업요건: {index + 1}번째</span>
                <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGraduationRequirement(index);
                        }}
                        className="text-2xl text-red-500 dark:text-gray-200 cursor-pointer ml-2"
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
        </div>
      )}
    </div>
  );
};

export default Graduation;
