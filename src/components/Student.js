import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";



const Student= () => {
    const axiosPrivate = useAxiosPrivate();
    const [ID,SetID] = useState("");


    useEffect(() => {
      
        const getID = async () => {
            try {
                const response = await axiosPrivate.get('/student', {
                 
                
                });
                console.log(response.data);
                SetID(response.data);
            } catch (err) {
                console.error(err);
            
            }
        }

        getID();

    }, [])
    return (

        <div>

         
        <h2>학생 전용 페이지 입니다.</h2>
        {ID}

        <Link to="/">홈페이지로 이동</Link>

        </div>
    )
}

export default Student