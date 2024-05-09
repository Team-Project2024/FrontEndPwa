import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";

const Graduation = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMajorId, setSelectedMajorId] = useState('');
  const [graduationRequirements, setGraduationRequirements] = useState({
    
    characterCulture: 1,
    basicLiberalArts: 1,
    generalLiberalArts: 1,
    majorCommon: 1,
    majorAdvanced: 1,
    freeChoice: 1,
    graduationCredits: 6,
    // volunteer: 2,
    // chapel: 1,
    msc: 1,
    majorId: 1
  });

  useEffect(() => {
    fetchYears();
  }, []);

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

  const addGraduationRequirements = async () => {
    try {
      const newRequirement = {
        ...graduationRequirements,
      };
      await axiosPrivate.post('/admin/graduation', { requestGRList: [newRequirement] });
      console.log('성공');
      console.log(graduationRequirements);
      console.log(graduationRequirements.year);
    } catch (error) {
      console.error('Error adding graduation requirements:', error);

      console.log(graduationRequirements);
    }
  };

    return(
        <div>
      <h1>졸업요건</h1>
      <div>
      <label htmlFor="year">학번:</label>
      <select id="year" onChange={handleYearChange} value={selectedYear}>
  <option value="">학번선택</option>
  {years.map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>
      </div>
      {/* <div>
        <label htmlFor="major">전공:</label>
        <select id="major" onChange={handleMajorChange}>
          <option value="">전공선택</option>
         
        </select>
      </div> */}
      <div className="flex flex-col">
        
        <label>인성교양: 
          <select name="characterCulture" value={graduationRequirements.characterCulture} onChange={handleChange}>
          {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
          </select>

        </label>
       
        <label>기초교양:
            <select name="basicLiberalArts" value={graduationRequirements.basicLiberalArts} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
       
        <label>일반교양:
            <select name="generalLiberalArts" value={graduationRequirements.generalLiberalArts} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
        <label>전공공통:
            <select name="majorCommon" value={graduationRequirements.majorCommon} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
          
        <label>전공심화:
            <select name="majorAdvanced" value={graduationRequirements.majorAdvanced} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
        <label>자유선택:
            <select name="freeChoice" value={graduationRequirements.freeChoice} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  

          
        <label>졸업학점 :
            <select name="graduationCredits" value={graduationRequirements.graduationCredits} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
        {/* <label>봉사:
            <select name="volunteer" value={graduationRequirements.volunteer} onChange={handleChange}>
              <option value={30}>30</option>
            </select>
            </label>   */}
            <label>msc:
            <select name="msc" value={graduationRequirements.msc} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>  
           
        {/* <label>채플:
            <select name="chapel" value={graduationRequirements.chapel} onChange={handleChange}>
            <option value={4}>4</option>
            </select>
            </label> */}
            <label>전공ID:
            <select name="majorId" value={graduationRequirements.majorId} onChange={handleChange}>
            {Array.from({ length: 100 }, (_, index) => (
                    <option key={index + 1} value={index + 1}>{index + 1}</option>
                ))}
            </select>
            </label>    
        
        
        <button onClick={addGraduationRequirements}>졸업요건 추가</button>
      </div>
    </div>
    
    



    )
}


export default Graduation