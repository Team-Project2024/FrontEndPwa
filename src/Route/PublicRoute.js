import React, { useContext, useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import useLogout from "../hooks/useLogout";
import useCookie from "../hooks/useCookie"; // Custom hook for cookies

const PublicRoute = () => {
  const { auth, setAuth } = useContext(AuthContext); // Using auth context
  const logout = useLogout(); // Custom logout hook
  const [open, setOpen] = useState(false); // State for dialog visibility
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status

  const token = useCookie(); // Retrieve refresh token from cookies

  useEffect(() => {
    // Effect to check refresh token and set authentication status
    try {
      if (token) {
        setIsAuthenticated(true); // User is authenticated
        window.alert('Authenticated'); // Debug alert
      } else {
        setIsAuthenticated(false); // User is not authenticated
        window.alert('Not Authenticated'); // Debug alert
      }
    } catch (error) {
      console.error('Error verifying refresh token', error); // Error handling
      setIsAuthenticated(false); // Reset authentication status on error
    }
  }, [token]); // Dependency array for useEffect

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleLogout = async () => {
    await logout(); // Perform logout
    handleClose(); // Close the dialog
  };

  if (!isAuthenticated) {
    // If user is not authenticated, render child routes
    return <Outlet />;
  }

  return (
    <>
      <Navigate to="/chat" /> {/* Redirect to chat if authenticated */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>이미 로그인되어 있습니다</DialogTitle>
        <DialogContent>
          로그인된 상태로 접근할 수 없습니다. 로그아웃 하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            취소
          </Button>
          <Button onClick={handleLogout} color="primary">
            로그아웃
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PublicRoute;
