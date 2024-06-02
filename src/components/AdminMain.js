import React, { useContext } from "react";
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
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden ">
      <div className="flex flex-col items-center">
        <h2 className="font-gmarket text-3xl mb-8">관리자 페이지</h2>
        <div className="font-gmarket text-2xl">
          <h2>메뉴에서 추가/관리하고싶은 부분을 선택해주세요!</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
