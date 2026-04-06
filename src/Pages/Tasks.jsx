import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import DataTable from 'react-data-table-component';
import { Lock } from "lucide-react";
import BlurOverlay from '../components/BlurOverlay';
import { toast } from "react-toastify";

const Tasks = () => {
  const { employee } = useUser();
  const emp_id = employee?.emp_id
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    client: '',
    status: '',
    from: '',
    to: ''
  });

  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [loginMsg, setLoginMsg] = useState(
    "Kindly punch in here to unlock your today's tasks and mark your presence in the system."
  );

  // Check punch in status
  useEffect(() => {
    const checkPunchStatus = async () => {
      if (!emp_id) return;

      try {
        const response = await axiosInstance.post('attendance/all', { emp_id });
        const attendanceData = response.data;

        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        const todayRecord = attendanceData.find(record => {
          const recordDate = new Date(record.created_at).toLocaleDateString(
            'en-CA',
            { timeZone: 'Asia/Kolkata' }
          );
          return recordDate === today;
        });

        // ==========================
        // 🔥 Message Logic Starts Here
        // ==========================

        if (!todayRecord) {
          // ❌ No punch-in today
          setIsPunchedIn(false);
          setLoginMsg("Kindly punch in here to unlock your today's tasks and mark your presence in the system.");
          return;
        }

        // ✅ Punched in but not punched out yet
        if (todayRecord.status === 1 && todayRecord.punch_in_time && !todayRecord.punch_out_time) {
          setIsPunchedIn(true);
          setLoginMsg("You are already punched-in for today. Kindly complete your tasks and punch-out when done.");
          return;
        }

        // ⛔ Punched-out for today (cannot punch again)
        if (todayRecord.status === 0 && todayRecord.punch_out_time) {
          setIsPunchedIn(false);
          setLoginMsg("You had successfully logged-out for today's session you cannot punch again today, kindly punch-in tomorrow. Thanks");
          return;
        }

      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
    };

    checkPunchStatus();
  }, [emp_id]);


  // Handle punch in function
  const handlePunchIn = async () => {
    try {
      const response = await axiosInstance.post("attendance/punch-in", {
        emp_id,
      });

      if (response.status === 200) {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        });

        setIsPunchedIn(true);
        toast.success(`✅ Punch-in successful at ${formattedTime}`);
      } else {
        toast.error("Failed to punch in. Please try again.");
      }
    } catch (error) {
      console.error("Punch-in failed:", error);
      toast.error("Failed to punch in. Please try again.");
    }
  };



  useEffect(() => {
    const fetchTasks = async () => {
      if (!employee?.emp_id) return;

      try {
        setLoading(true);

        // Map frontend filter names to backend query param names
        const params = {
          client_id: filters.client || "",   // backend expects client_id
          status: filters.status || "",
          from_date: filters.from || "",
          to_date: filters.to || "",
          // also include other filter params if you expose them in UI:
          // deadline_date: filters.deadline || "",
          // last_submission: filters.lastSubmission || "",
        };

        // Make GET request with query params
        const res = await axiosInstance.get(`/employee-tasks/${employee.emp_id}`, {
          params,
        });

        // backend returns res.data.tasks
        const sorted = (res.data.tasks || []).sort((a, b) => {

          const today = new Date().setHours(0, 0, 0, 0);
          const dateA = new Date(a.assigned_date).setHours(0, 0, 0, 0);
          const dateB = new Date(b.assigned_date).setHours(0, 0, 0, 0);

          const isTodayA = dateA === today;
          const isTodayB = dateB === today;

          // ✅ Put today's tasks first
          if (isTodayA && !isTodayB) return -1;
          if (!isTodayA && isTodayB) return 1;

          // Otherwise, sort by most recent assigned_date (latest first)
          return new Date(b.assigned_date) - new Date(a.assigned_date);
        });
        // set tasks and filteredTasks (display list)
        setTasks(sorted);
        setFilteredTasks(sorted);

        // Extract unique clients for the client dropdown if needed
        const uniqueClients = [
          ...new Set(sorted.map((task) => task.client?.name).filter(Boolean)),
        ];
        setClients(uniqueClients);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // optionally show toast/error state
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [employee, filters]); // re-run whenever employee or filters change

  console.log(tasks)

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || isNaN(totalSeconds)) return '00:00:00';
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleFilter = () => {
    setLoading(true); // Show loader

    const { client, status, from, to } = filters;

    const filtered = tasks.filter(task => {
      const matchClient = client ? task.client?.name === client : true;
      const matchStatus = status ? task.status === status : true;
      const matchFrom = from ? new Date(task.assigned_date) >= new Date(from) : true;
      const matchTo = to ? new Date(task.assigned_date) <= new Date(to) : true;
      return matchClient && matchStatus && matchFrom && matchTo;
    });

    setFilteredTasks(filtered);
    setLoading(false); // Hide loader
  };

  useEffect(() => {
    handleFilter();
  }, [filters]);

  const resetFilter = () => {
    setFilters({ client: "", status: "", from: "", to: "" });
    // No need to call fetch here — useEffect will run because filters changed.
  };

  const liveFilteredTasks = filteredTasks.filter(task =>
    task.task_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { name: 'Task ID', selector: row => row.task_id, sortable: true },
    { name: 'Task Title', selector: row => row.subject, sortable: true },
    { name: 'Client Name', sortable: true, selector: row => row.client?.name || 'N/A' },
    { name: 'Assigned By', sortable: true, selector: row => row.assigned_by || 'N/A' },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => {
        let badgeColor = 'secondary';

        if (row.status === 'Completed') badgeColor = 'success';
        else if (row.status === 'Working') badgeColor = 'warning';
        else if (row.status === 'Pending') badgeColor = 'danger';

        return (
          <div className="d-flex flex-column align-items-start gap-1">
            <span className={`badge text-white bg-${badgeColor}`}>
              {row.status}
            </span>

            {row.is_overdue && (
              <span className="badge bg-danger text-white">
                Overdue
              </span>
            )}
          </div>
        );
      }
    },
    {
      name: 'Priority',
      selector: row => row.priority,
      sortable: true,
      cell: row => {
        const priority = row.priority.toLowerCase();

        let badgeClass = 'bg-secondary';
        if (priority === 'critical' || priority === 'high') {
          badgeClass = 'bg-danger';
        } else if (priority === 'moderate' || priority === 'medium') {
          badgeClass = 'bg-warning text-dark';
        } else if (priority === 'to-do' || priority === 'low') {
          badgeClass = 'bg-primary';
        }

        return (
          <span className={`badge ${badgeClass}`}>
            {row.priority}
          </span>
        );
      }
    },
    {
      name: 'Assigned Date',
      selector: row => new Date(row.assigned_date).toLocaleDateString('en-GB').replaceAll('/', '-'),
      sortable: true
    },
    {
      name: 'Deadline',
      selector: row => new Date(row.due_date).toLocaleDateString('en-GB').replaceAll('/', '-'),
      sortable: true
    },
    {
      name: 'Total Time',
      selector: row => formatTime(row.total_time_spent),
      sortable: true
    },
    {
      name: 'Submitted',
      selector: row => row.submissions,
      sortable: true,
      cell: row => (
        row.submissions && row.submissions.length > 0 ? (
          <span className="badge bg-success text-white">Submitted</span>
        ) : (
          <span className="badge bg-danger text-white">Not Submitted</span>
        )
      )
    },
    {
      name: 'Actions',
      cell: row => (
        <NavLink to={`/dashboard/task/${row.id}`} state={{ task: row }}>
          <button className='btn btn-sm bg-warning'>
            <i className="bi bi-pencil"></i>
          </button>
        </NavLink>
      )
    }
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ minHeight: '100vh', background: '#f9f9f9' }}>
        <Header />
        <div className='position-relative'>
          {/* <BlurOverlay
            isBlurred={!isPunchedIn}
            onPunchIn={handlePunchIn}
            employeeName={employee?.name}
            img={employee?.image_url}
            msg={loginMsg}
          /> */}
          <div className="p-4">
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-outline-dark rounded-circle mb-3"
                style={{ width: '40px', height: '40px' }}
                onClick={() => navigate(-1)}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              {/* Assign Task Button */}
              <NavLink className='text-decoration-none' to={'/dashboard/add-task'}>
                <button
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                >
                  <i className="bi bi-plus-circle"></i>  Self Task Assign
                </button>
              </NavLink>
            </div>

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
              {/* Left: Heading */}
              <h4 className="mb-0">My Tasks</h4>

              {/* Right: Filter + Search */}
              <div className="d-flex align-items-center gap-2 ms-auto">
                {/* Filter Button */}
                {/* <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                data-bs-toggle="modal"
                data-bs-target="#filterModal"
              >
                <i className="bi bi-funnel"></i> Filter
              </button> */}
                {/* Status Filter Buttons */}
                {/* Status Filter Buttons */}
                <div className="btn-group gap-2" role="group">
                  {/* Working Button */}
                  <button
                    className={`btn btn-sm d-flex align-items-center gap-1 ${filters.status === "Working" ? "btn-warning" : "btn-outline-warning"
                      }`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        status: prev.status === "Working" ? "" : "Working", // toggle
                      }))
                    }
                  >
                    <i className="bi bi-hourglass-split"></i> Working
                  </button>

                  {/* Completed Button */}
                  <button
                    className={`btn btn-sm d-flex align-items-center gap-1 ${filters.status === "Completed" ? "btn-success" : "btn-outline-success"
                      }`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        status: prev.status === "Completed" ? "" : "Completed",
                      }))
                    }
                  >
                    <i className="bi bi-check-circle"></i> Completed
                  </button>

                  {/* Pending / To-do Button */}
                  <button
                    className={`btn btn-sm d-flex align-items-center gap-1 ${filters.status === "To-do" ? "btn-danger" : "btn-outline-danger"
                      }`}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        status: prev.status === "To-do" ? "" : "To-do",
                      }))
                    }
                  >
                    <i className="bi bi-clock-fill"></i> Pending
                  </button>

                  {/* Clear Button */}
                  <button
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
                    onClick={resetFilter}
                  >
                    <i className="bi bi-x-circle"></i> Clear
                  </button>
                </div>
                {/* Search Input */}
                <div className="input-group" style={{ maxWidth: '280px' }}>
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Search by ID, Subject, Client..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              {loading ? (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className={`fade-in-table ${!loading ? 'show' : ''}`}>
                  <DataTable
                    columns={columns}
                    data={liveFilteredTasks}
                    pagination
                    paginationPerPage={30}
                    striped
                    highlightOnHover
                    persistTableHead
                    conditionalRowStyles={[
                      {
                        when: row => row.status === 'Completed',
                        style: {
                          backgroundColor: '#d4edda',
                          border: '1px solid #c3e6cb',
                        },
                      },
                      {
                        when: row => row.status === 'Working',
                        style: {
                          backgroundColor: '#fff3cd',
                          border: '1px solid #ffeeba',
                        },
                      },
                      {
                        when: row => row.status === 'Pending',
                        style: {
                          backgroundColor: '#f8d7da',
                          border: '1px solid #f5c6cb',
                        },
                      },
                      {
                        when: row => row.status === 'To-do',
                        style: {
                          backgroundColor: 'rgb(193, 221, 238)',
                          border: '1px solid rgb(193, 221, 238)',
                        },
                      },
                      // ✅ Blur ONLY future-dated tasks (keep colors visible)
                      // {
                      //   when: row => {
                      //     const assigned = new Date(row.assigned_date);
                      //     const today = new Date();
                      //     // check if assigned_date > today
                      //     return (
                      //       assigned.setHours(0, 0, 0, 0) >
                      //       today.setHours(0, 0, 0, 0)
                      //     );
                      //   },
                      //   style: {
                      //     filter: 'blur(2.5px)',       // subtle blur
                      //     opacity: '0.85',             // keep color visibility
                      //     pointerEvents: 'none',       // disable clicks if you want
                      //     transition: 'filter 0.3s ease',
                      //   },
                      // },
                      {
                        when: row => {
                          const assigned = new Date(row.assigned_date);
                          const now = new Date();

                          // Only unblur when assigned date and time are reached or passed
                          return assigned > now; // this means still in the future → keep blurred
                        },
                        style: {
                          filter: 'blur(2.5px)',       // blur effect
                          opacity: '0.85',
                          pointerEvents: 'none',
                          transition: 'filter 0.3s ease',
                        },
                      }
                    ]}


                    customStyles={{
                      rows: {
                        style: {
                          border: '1px solid #dee2e6',
                          backgroundColor: '#fff',
                          padding: '6px 6px',
                          fontSize: '0.99rem',
                        },
                      },
                      headRow: {
                        style: {
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #dee2e6',
                        },
                      },
                      headCells: {
                        style: {
                          fontWeight: '600',
                          fontSize: '0.95rem',
                          padding: '12px',
                          borderRight: '1px solid #dee2e6',
                          backgroundColor: '#f1f1f1',
                        },
                      },
                      cells: {
                        style: {
                          padding: '4px',
                          borderRight: '1px solid #dee2e6',
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* ✅ Filter Modal */}
      <div className="modal fade" id="filterModal" tabIndex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="filterModalLabel">Filter Tasks</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Client</label>
                <select
                  className="form-select"
                  value={filters.client}
                  onChange={e => setFilters({ ...filters, client: e.target.value })}
                >
                  <option value="">All</option>
                  {clients.map((client, idx) => (
                    <option key={idx} value={client}>{client}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="To-do">To-do</option>
                  <option value="Working">Working</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.from}
                  onChange={e => setFilters({ ...filters, from: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.to}
                  onChange={e => setFilters({ ...filters, to: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={resetFilter}>Reset</button>
              <button className="btn btn-primary btn-sm" onClick={handleFilter} data-bs-dismiss="modal">Apply Filter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
