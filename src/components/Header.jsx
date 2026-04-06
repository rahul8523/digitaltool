// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import axiosInstance from '../api/axios';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employee, setEmployee } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [hidden, setHidden] = useState(true);
  const emp_id = employee?.emp_id
  const [workTime, setWorkTime] = useState("00:00:00");



  const handleLogout = () => {
    setEmployee(null);
    localStorage.removeItem('employee');
    toast.warn('Logged out successfully!');
    navigate('/');
  };


  // check punch in status 
  useEffect(() => {
    const checkPunchStatus = async () => {
      if (!emp_id) return; // 🔸 Wait until emp_id is available

      try {
        const response = await axiosInstance.post('attendance/all', { emp_id });
        const attendanceData = response.data;

        // 🔹 Get today's date (IST)
        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        // 🔹 Find today’s attendance entry
        const todayRecord = attendanceData.find(record => {
          const recordDate = new Date(record.created_at).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
          return recordDate === today;
        });

        if (todayRecord) {
          // ✅ Status 1 = Punched In (enable Punch Out)
          if (todayRecord.status === 1 && todayRecord.punch_in_time && !todayRecord.punch_out_time) {
            setHidden(false);
          } else {
            // ✅ Status 0 = Punched Out
            setHidden(true);
          }
        } else {
          // ✅ No record today = not punched in
          setHidden(true);
        }
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    checkPunchStatus();
  }, [emp_id]); // 🔸 Runs only when emp_id changes


  // funciton for punch-out
  const handlePunchOut = async () => {
    if (!emp_id) return;

    try {
      // 🔹 API Call
      const response = await axiosInstance.post('attendance/punch-out', { emp_id });

      // 🔹 Extract message & time
      const { message, punch_out_time } = response.data;

      // 🔹 Toast success
      toast.success(`${message} at ${punch_out_time}`);

      // 🔹 Optional small delay for user feedback
      setTimeout(() => {
        window.location.reload(); // refresh page to trigger blur + disable punch-out
      }, 1500);

    } catch (error) {
      console.error('Punch-out failed:', error);
      toast.error(
        error.response?.data?.message || "Failed to punch out. Please try again."
      );
    }
  };

  // Checking logged-in time
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await axiosInstance.get(`/employee/attendance-time/${emp_id}`);

        if (res.data.status) {
          setWorkTime(res.data.formatted);
          console.log(res.data.formatted)
        }

      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();
  }, [emp_id]);

  // Fetch unread count safely
  useEffect(() => {
    if (employee?.emp_id) {
      axiosInstance.get(`notifications/unread-count/${employee.emp_id}`)
        .then(res => setUnreadCount(res.data.unread_count))
        .catch(err => console.error(err));
    }
  }, [employee?.emp_id]);

  // ✅ Mark all notifications as read on /dashboard/notification route
  useEffect(() => {
    if (employee?.emp_id && location.pathname === '/dashboard/notification') {
      axiosInstance.post(`notifications/mark-read/${employee.emp_id}`)
        .then(() => setUnreadCount(0))
        .catch(err => console.error(err));
    }
  }, [location.pathname, employee?.emp_id]);

  return (
    <div className="d-flex justify-content-end align-items-center p-3 border-bottom">

      {/* Login timing comes here */}
      <span className="text-dark">{workTime}</span>

      <li style={{ listStyle: 'none' }} className='nav-item'>
        <button className='btn btn-sm btn-warning mx-4 d-flex align-items-center gap-2' onClick={handlePunchOut} disabled={hidden}>
          <span>Punch Out</span>
          <i className="bi bi-power fs-6"></i>
        </button>
      </li>
      <li style={{ listStyle: 'none' }} className='nav-item'>
        <button className='btn btn-sm btn-danger mx-4 d-flex align-items-center gap-2' onClick={handleLogout}>
          <span>Logout</span>
          <i className="bi bi-box-arrow-right fs-6"></i>
        </button>
      </li>

      <li style={{ listStyle: 'none' }} className="nav-item position-relative">
        <NavLink to="/dashboard/notification" className="position-relative d-inline-block">
          <i className="bi bi-bell-fill me-3 fs-5" role="button" title="Notifications"></i>
          {unreadCount > 0 && (
            <span
              className="badge bg-danger rounded-pill"
              style={{
                position: 'absolute',
                top: '-6px',
                right: '6px',
                fontSize: '0.65rem',
                padding: '2px 5px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </NavLink>
      </li>


      <li style={{ listStyle: 'none' }} className='nav-item'>
        <NavLink to={'/dashboard/profile'}>

          <img
            src={
              employee?.image_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.name || 'User')}&background=0D8ABC&color=fff&size=120`
            }
            alt="Profile"
            className="rounded-circle"
            width="35"
            height="35"
          />
        </NavLink>
      </li>
    </div>
  );
};

export default Header;
