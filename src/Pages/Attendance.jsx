import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import AttendanceMetrics from '../components/AttendanceMetrics'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import axiosInstance from '../api/axios';
import { useUser } from '../context/UserContext';

const Attendance = () => {
  const [date, setDate] = useState(new Date());
  const { employee } = useUser();
  const emp_id = employee?.emp_id
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [holidayDates, setHolidayDates] = useState([]);

  // ✅ Example static data (replace with API data later)
  useEffect(() => {
    // Example of "present" days (YYYY-MM-DD)
    const presentDays = [
      '2025-11-01',
      '2025-11-05',
      '2025-11-08',
      '2025-11-13',
    ];
    setAttendanceDates(presentDays);
  }, []);

  // Function to fetch the holidays
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axiosInstance.get('/office-holidays')
        if (response.data.success) {
          // Format the API date (YYYY-MM-DD)
          const formatted = response.data.data.map(item => item.date);
          setHolidayDates(formatted);
          console.log(formatted);
        }
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchHolidays();
  }, [])

  // function to fetch the present dates of a employee
  useEffect(() => {
    if (!emp_id) return;

    const fetchPresentDays = async () => {
      try {
        const response = await axiosInstance.get(`/attendance/present`, {
          params: {
            emp_id: emp_id,
            month: new Date().getMonth() + 1,  // current month (1–12)
            year: new Date().getFullYear()     // current year
          }
        });

        if (response.data.success) {
          setAttendanceDates(response.data.present_dates);
        }

      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchPresentDays();
  }, [emp_id]);



  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="p-4">
          <div className='d-flex align-items-center justify-content-between flex-wrap mb-4'>
            {/* Left Section */}
            <div>
              <h3>Attendance</h3>
              <p className='mb-0'>
                View and manage your attendance records here. Check in/out timings, leave status, and more.
              </p>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* <h5 className="mb-0">
              {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h5> */}

            {/* <input
              type="month"
              className="form-control form-control-sm"
              style={{ width: '200px' }}
              value={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`}
              onChange={(e) => {
                const [year, month] = e.target.value.split('-');
                setDate(new Date(year, month - 1));
              }}
            /> */}
          </div>


          <div className='row p-2'>
            <div className='col-md-8 col-12'>
              <div className="border rounded  bg-white">
                <Calendar
                  onChange={setDate}
                  value={date}
                  view="month"
                  className="w-100 border-0"
                  tileClassName={({ date, view }) => {
                    if (view === 'month') {
                      const formatted = formatDate(date);

                      if (attendanceDates.includes(formatted)) {
                        return 'present-day'; // Green highlight class
                      }

                      if (holidayDates.includes(formatted)) {
                        return 'holiday-day'; // Red highlight class
                      }
                    }
                    return null;
                  }}
                />
              </div>
            </div>
            <div className='col-md-4 col-12'>
              <AttendanceMetrics
                totalWorkingDays={22}
                totalHolidays={6}
                totalAbsents={2}
                totalPresent={18}
                totalLeaves={5}

              />
            </div>

            {/* Shikha code stats */}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Attendance