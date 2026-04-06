// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import axiosInstance from '../api/axios'
import TaskCard from '../components/TaskCard'
import { isAfter, format } from 'date-fns';
import { BsEye, BsExclamationCircleFill } from 'react-icons/bs'; // or use Bootstrap icon if preferred

const Dashboard = () => {
  const { employee } = useUser()
  // console.log(employee?.status)
  // console.log(employee)
  // console.log('Employee tasks:', employee?.tasks);
  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    efficiency: 0,
    workingHours: 0,
    workingDays: 0,
  });
  const [month, setMonth] = useState(getCurrentMonth());

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  useEffect(() => {
    if (employee?.emp_id && month) {

      fetchMetrics(month);
    }
  }, [employee?.emp_id, month]);

  const fetchMetrics = async (selectedMonth) => {
    try {
      setLoading(true);

      const response = await axiosInstance.get("/employee/efficiency", {
        params: {
          emp_id: employee?.emp_id,
          month: selectedMonth,
        },
      });

      const data = response.data;
      console.log(data)
      setMetrics({
        efficiency: data.metrics.efficiency || 0,
        workingHours: data.metrics.total_time_spent || "00:00:00",
        workingDays: data.metrics.working_days || 0,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Provide greetings to employee
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // fetching the tasks of employees.
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (employee?.emp_id) {
          const res = await axiosInstance.get(`/employee-tasks/${employee.emp_id}`);
          // console.log('Fetched tasks:', res.data.tasks);
          setEmployeeTasks(res.data.tasks);
        }
      } catch (err) {
        console.error('Error fetching employee tasks:', err);
      } finally {
        setLoading(false); // ✅ Done loading
      }
    };

    fetchTasks();
  }, [employee?.emp_id]);

  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'Completed') return false;
    const today = new Date();
    return new Date(task.due_date) < today;
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header />
        <div className="p-4">
          <h3>
            {getGreeting()}, {employee?.name || 'Employee'}!
          </h3>
          <p className="text-muted small mt-1">
            Welcome to XplodeFlowPilot — manage your tasks efficiently, stay on track, and never miss a deadline.
          </p>
          <div className="row mt-4">
            <InfoCard
              title="Employee ID"
              value={employee?.emp_id}
              icon="bi-person-badge"
              bgColor="bg-primary"
              loading={!employee?.emp_id}
            />
            <InfoCard
              title="Department"
              value={employee?.department}
              icon="bi-diagram-3"
              bgColor="bg-success"
              loading={!employee?.department}
            />
            <InfoCard
              title="Post"
              value={employee?.post}
              icon="bi-award"
              bgColor="bg-warning"
              loading={false}
            />
            <InfoCard
              title="Contact"
              value={employee?.email}
              icon="bi-envelope-at"
              bgColor="bg-danger"
              loading={!employee?.email}
            />
          </div>
          {!employeeTasks ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div
              className="mt-4 total-tasks"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "1rem",
              }}
            >
              <TaskCard
                title="Total Tasks"
                count={employeeTasks.length}
                bgColor="bg-primary"
                link="/dashboard/task"
                loading={loading}
              />
              <TaskCard
                title="Completed Tasks"
                count={employeeTasks.filter(task => task.status === 'Completed').length}
                bgColor="bg-success"
                link="/dashboard/task"
                loading={loading}
              />
              <TaskCard
                title="Overdue Tasks"
                count={employeeTasks.filter(task => isOverdue(task)).length}
                bgColor="bg-danger"
                link="/dashboard/task"
                loading={loading}
              />
              <TaskCard
                title="Pending Tasks"
                count={employeeTasks.filter(task => task.status === 'Pending').length}
                bgColor="bg-warning"
                link="/dashboard/task"
                loading={loading}
              />
              <TaskCard
                title="Working Task"
                count={employeeTasks.filter(task => task.status === 'Working').length}
                bgColor="bg-info"
                link="/dashboard/task"
                loading={loading}
              />
            </div>

          )}

          <div className="row mt-4">
            <div className="col-lg-8 mb-4">
              <UpcomingDeadlineTable data={employeeTasks} loading={loading} />
            </div>
            <div className="col-lg-4">
              <div className="container mt-4">
                {/* 🔸 Month Selector */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold text-dark">Employee Monthly Performance</h4>
                  <select
                    className="form-select w-auto shadow-sm"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {/* Generate last 6 months dynamically */}
                    {Array.from({ length: 6 }, (_, i) => {
                      const date = new Date();
                      date.setMonth(date.getMonth() - i);
                      const value = `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                      ).padStart(2, "0")}`;
                      const label = date.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      });
                      return (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 🔹 Metrics Section */}
                <div className="row">
                  <div className="">
                    <MetricCard
                      title="Total Working Hours"
                      value={`${metrics.workingHours}`}
                      icon="bi-clock-history"
                      bgColor="bg-info"
                      loading={loading}
                    />
                    <MetricCard
                      title="Your Total Working Days"
                      value={`${metrics.workingDays} days`}
                      icon="bi-calendar-check"
                      bgColor="bg-primary"
                      loading={loading}
                    />
                    <MetricCard
                      title="Your Efficiency"
                      value={`${metrics.efficiency}%`}
                      icon="bi-bar-chart-line"
                      bgColor="bg-success"
                      loading={loading}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='row mt-4'>
            <OverdueTaskTable data={employeeTasks} loading={loading} />
          </div>



        </div>
      </div>
    </div>
  )
}

export default Dashboard

const InfoCard = ({ title, value, icon, bgColor, loading }) => (
  <div className="col-md-6 col-lg-3 mb-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        <div className="me-3">
          <div
            className={`text-white rounded-circle d-flex align-items-center justify-content-center ${bgColor}`}
            style={{ width: 50, height: 50 }}
          >
            <i className={`bi ${icon} fs-4`}></i>
          </div>
        </div>
        <div>
          <h6 className="mb-1 text-muted">{title}</h6>
          {loading ? (
            <div className="dot-loader">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          ) : (
            <h5 className="mb-0" style={{fontSize:"14px"}}>{value}</h5>
          )}
        </div>
      </div>
    </div>
  </div>
);



// Deadline Table
const UpcomingDeadlineTable = ({ data, loading }) => {
  const today = new Date();

  // Filter future tasks and sort by due date (ascending)
  const upcomingTasks = data
    .filter(task => isAfter(new Date(task.due_date), today))
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5); // Only take top 5

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3 text-warning">Upcoming Deadline....</h5>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : upcomingTasks.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Task ID</th>
                    <th>Subject</th>
                    <th>Client</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingTasks.map(task => (
                    <tr key={task.task_id}>
                      <td>{task.task_id}</td>
                      <td>{task.subject}</td>
                      <td>{task.client?.name || '—'}</td>
                      <td>{format(new Date(task.due_date), 'dd MMM yyyy')}</td>
                      <td>{task.status}</td>
                      <td>
                        <a href="/dashboard/task" className=" text-primary" title="View">
                          <button className='btn btn-sm text-danger bg-warning'>
                            <i className="bi bi-pencil text-dark"></i>
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center mt-2">
              <a href="/dashboard/task" className="btn btn-sm btn-primary">All task</a>
            </div>
          </>
        ) : (
          <p className="text-muted">No upcoming deadlines found.</p>
        )}
      </div>
    </div>
  );
};


// Overdue table component
const OverdueTaskTable = ({ data, loading }) => {
  const today = new Date();

  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'Completed') return false;
    const today = new Date();
    return new Date(task.due_date) < today;
  };

  // Filter and sort overdue tasks
  const overdueTasks = data.filter(task => isOverdue(task));


  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3 text-danger">
          <BsExclamationCircleFill className="me-2 text-danger" />
          Overdue Tasks ({overdueTasks.length})
        </h5>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : overdueTasks.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Task ID</th>
                    <th>Subject</th>
                    <th>Client</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueTasks.map(task => (
                    <tr key={task.task_id}>
                      <td>{task.task_id}</td>
                      <td>{task.subject}</td>
                      <td>{task.client?.name || '—'}</td>
                      <td className="text-danger fw-bold">
                        {format(new Date(task.due_date), 'dd MMM yyyy')}
                      </td>
                      <td>
                        <span className="badge bg-danger">{task.status}</span>
                      </td>
                      <td>
                        <a href="/dashboard/task" className="text-danger" title="View">
                          <button className='btn btn-sm text-danger bg-danger'>
                            <i className="bi bi-pencil text-white"></i>
                          </button>

                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-2">
              <a href="/dashboard/task" className="btn btn-sm btn-warning text-white">All Tasks</a>
            </div>
          </>
        ) : (
          <p className="text-muted">No overdue tasks found.</p>
        )}
      </div>
    </div>
  );
};




const MetricCard = ({ title, value, icon, bgColor, loading }) => (
  <div className="mb-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center">
        <div className="me-3">
          <div
            className={`text-white rounded-circle d-flex align-items-center justify-content-center ${bgColor}`}
            style={{ width: 50, height: 50 }}
          >
            <i className={`bi ${icon} fs-4`}></i>
          </div>
        </div>
        <div>
          <h6 className="mb-1 text-muted">{title}</h6>
          {loading ? (
            <div className="dot-loader">
              <span>.</span><span>.</span><span>.</span>
            </div>
          ) : (
            <h5 className="mb-0">{value}</h5>
          )}
        </div>
      </div>
    </div>
  </div>
);
