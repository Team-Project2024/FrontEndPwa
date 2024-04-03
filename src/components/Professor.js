import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";



const Professor= () => {
    const axiosPrivate = useAxiosPrivate();
    const [ProfessorID,SetProfessorID] = useState("");


    useEffect(() => {
      
        const getID = async () => {
            try {
                const response = await axiosPrivate.get('/professor', {
                 
                
                });
                console.log(response.data);
                SetProfessorID(response.data);
            } catch (err) {
                console.error(err);
            
            }
        }

        getID();

    }, [])
    return (

        <div>

         
        <h2>교수 전용 페이지 입니다.</h2>
        {ProfessorID}

        <Link to="/">홈페이지로 이동</Link>

        </div>
    )
}

export default Professor