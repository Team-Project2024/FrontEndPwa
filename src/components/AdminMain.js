import React, { useState, useEffect, useContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import AuthContext from "../context/AuthProvider";
import { FaTrashAlt, FaPlus } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';






const AdminMain = () => {
  const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
 


 

  

  return (
    <div className="container mx-auto p-8">
    

    <div className="mb-8 flex justify-center ">

      <h2>안녕</h2>


      </div>



   
    </div>
  );
};

export default AdminMain;
