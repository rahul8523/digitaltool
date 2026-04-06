/* eslint-disable no-unused-vars */
// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import EmployeeLogin from './Pages/EmployeeLogin'
import Dashboard from './Pages/Dashboard'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tasks from './Pages/Tasks'
// import AddTask from './Pages/AddTask'
import AddTask from './Pages/AddTask'
import Attendance from './Pages/Attendance'
import OfficeEvents from './Pages/OfficeEvents'
import DXChat from './Pages/DXChat'
import TaskDetails from './Pages/TaskDetails';
import Notifications from './Pages/Notifications';
import Profile from './Pages/Profile';
import PrivateRoute from './hooks/PrivateRoute';
import UpdatePassword from './Pages/UpdatePassword';
import Efficiency from './Pages/Efficiency';
import { useEffect, useState } from 'react';
import CompleteBlur from './components/CompleteBlur';
import axiosInstance from './api/axios';
import { useUser } from './context/UserContext';
import LeaveManagement from './Pages/LeaveManagement';

import { initPusher } from "./realtime/pusherListener";



function App() {
  const [fullblur, setFullBlur] = useState(false);
  const { employee } = useUser()
  const empId = employee?.id
  // useEffect(() => {
  //   const checkStatus = async () => {
  //     try {
  //       const response = await axiosInstance.get(`/employee/status/${empId}`);

  //       const status = response.data?.status;
  //       if (status === 1) {
  //         setFullBlur(false);
  //       } else if (status === 0) {
  //         setFullBlur(true);
  //       }

  //     } catch (error) {
  //       console.error("Error fetching employee status:", error);
  //       setFullBlur(false);
  //     }
  //   };

  //   checkStatus();
  // }, [empId]);

  useEffect(() => {

    if (!employee?.emp_id) return;

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  initPusher(employee.emp_id);

}, [employee]);


useEffect(() => {

  const unlockAudio = () => {
    const testAudio = new Audio("https://digitalxplode.in/sounds/task.mp3");
    testAudio.play()
      .then(() => {
        testAudio.pause();
        testAudio.currentTime = 0;
      })
      .catch(()=>{});
  };

  window.addEventListener("click", unlockAudio, { once: true });

}, []);


  return (
    <>
      {fullblur ? <CompleteBlur /> :
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<EmployeeLogin />} />
          <Route path="/dashboard/update-password" element={<UpdatePassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/home"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/dashboard/task"
            element={<PrivateRoute><Tasks /></PrivateRoute>}
          />
          <Route
            path="/dashboard/task/:id"
            element={<PrivateRoute><TaskDetails /></PrivateRoute>}
          />
          <Route
            path="/dashboard/add-task"
            element={<PrivateRoute><AddTask /></PrivateRoute>}
          />
          <Route
            path="/dashboard/attendance"
            element={<PrivateRoute><Attendance /></PrivateRoute>}
          />
          <Route
            path="/dashboard/leave-management"
            element={<PrivateRoute><LeaveManagement /></PrivateRoute>}
          />
          <Route
            path="/dashboard/office-events"
            element={<PrivateRoute><OfficeEvents /></PrivateRoute>}
          />
          <Route
            path="/dashboard/team-chat"
            element={<PrivateRoute><DXChat /></PrivateRoute>}
          />
          <Route
            path="/dashboard/notification"
            element={<PrivateRoute><Notifications /></PrivateRoute>}
          />
          <Route
            path="/dashboard/profile"
            element={<PrivateRoute><Profile /></PrivateRoute>}
          />
          <Route
            path="/dashboard/efficiency"
            element={<PrivateRoute><Efficiency /></PrivateRoute>}
          />
        </Routes>
      }

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>

  )
}

export default App
