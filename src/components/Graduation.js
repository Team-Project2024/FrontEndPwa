import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";

const Graduation = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [major, setMajor] = useState([]);
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
    setGraduationRequirements(prevState => ({
      ...prevState,
      year: value // 연도 선택 시 graduationRequirements의 year 속성 업데이트
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGraduationRequirements(prevState => ({
      ...prevState,
      [name]: parseInt(value) // 숫자로 변환하여 저장
    }));
  };

  const addGraduationRequirement = () => {
    if(selectedYear === "") {
      window.alert('학번을 선택해주세요')
      return;
    }else if(graduationRequirements.majorId === "") {
      window.alert('전공을 선택해주세요');
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
      await axiosPrivate.post('/admin/graduation', { requestGRList: graduationList });
      console.log('성공');
      window.alert('성공');

      setGraduationList([]);
    } catch (error) {
      console.error('Error adding graduation requirements:', error);
      window.alert('추가된 졸업요건이 없거나 \n이미 등록된 졸업요건과 동일한 졸업요건이 존재합니다.')

      console.log(graduationList);
    }
  };

    return(
        <div>
      
      <div>
      <label className="font-gmarket"htmlFor="year">학번:</label>
      <select 
      className="  ml-3 mb-4 p-2 border border-gray-300 rounded-md"
      id="year" onChange={handleYearChange} value={selectedYear}>
  <option value="">학번선택</option>
  {years.map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>
      </div>
    
      <div className="flex flex-col p-4 border-2 border-gray-300 rounded-lg">
        
        <label className="font-gmarket">인성교양: 
          <select  className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md"
          name="characterCulture" value={graduationRequirements.characterCulture} onChange={handleChange}>
          {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
          </select>

        </label>
       
        <label className="font-gmarket">기초교양:
            <select
            className=" ml-3  mb-4 p-2 border border-gray-300 rounded-md" name="basicLiberalArts" value={graduationRequirements.basicLiberalArts} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
       
        <label className="font-gmarket">일반교양:
            <select
            className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md" name="generalLiberalArts" value={graduationRequirements.generalLiberalArts} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
        <label className="font-gmarket">전공공통:
            <select 
            className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md"name="majorCommon" value={graduationRequirements.majorCommon} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
          
        <label className="font-gmarket">전공심화:
            <select 
            className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md"name="majorAdvanced" value={graduationRequirements.majorAdvanced} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
        <label className="font-gmarket">자유선택:
            <select 
            className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md"
            name="freeChoice" value={graduationRequirements.freeChoice} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  

          
        <label className="font-gmarket">졸업학점 :
            <select 
            className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md"
            name="graduationCredits" value={graduationRequirements.graduationCredits} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
      
            <label className="font-gmarket">msc:
            <select
            className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md"
            name="msc" value={graduationRequirements.msc} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
       
            <label className="font-gmarket">전공Id:
              <select
              className=" ml-3 mb-4 p-2 border border-gray-300 rounded-md"
                  value={graduationRequirements.majorId}
                  onChange={(e) =>
                    setGraduationRequirements({ ...graduationRequirements, majorId: e.target.value })
                  }
                >
                <option value="">전공선택</option>
                {major.map((major) => (
                  <option key={major.majorId} value={major.majorId}>
                    {major.department}
                  </option>
                ))}
                </select>
              </label>

              {graduationList.map((requirement, index) => (
          <div key={index}>
            <label className="font-gmarket">추가된졸업요건: {index+1}번째</label>
            {/* Add labels for other requirements */}
            <button className="border-4  font-gmarket px-3 py-1 rounded-lg bg-slate-300"onClick={() => removeGraduationRequirement(index)}>삭제</button>
          </div>
        ))}
        
        
        <button className="border-4 font-gmarket px-3 py-1 rounded-lg bg-slate-400" onClick={submitGraduationRequirements}>졸업요건 제출</button>
        <button  className="border-4 font-gmarket px-3 py-1 rounded-lg bg-slate-400"onClick={addGraduationRequirement}>졸업요건 추가</button>
      </div>
    </div>
    
    



    )
}


export default Graduation 