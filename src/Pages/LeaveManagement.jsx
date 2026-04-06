import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const LeaveManagement = () => {


    const { employee } = useUser();
    const emp_id = employee?.emp_id;

    const [leaveStats, setLeaveStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [leaveForm, setLeaveForm] = useState({
        subject: '',
        leave_type: '',
        from_date: '',
        to_date: '',
        reason: '',
        remarks: ''
    });


    const [leaveHistory, setLeaveHistory] = useState([]);

    const handleChange = (e) => {
        setLeaveForm({
            ...leaveForm,
            [e.target.name]: e.target.value
        });
    };

    // submit lead form
    const submitLeave = async () => {
        try {
            const payload = {
                emp_id: emp_id, // from context
                ...leaveForm
            };

            const res = await axiosInstance.post('/leave/apply', payload);

            if (res.data.status) {
                toast.success('Leave request submitted successfully');

                setLeaveForm({
                    subject: '',
                    leave_type: '',
                    from_date: '',
                    to_date: '',
                    reason: '',
                    remarks: ''
                });

                document.getElementById('closeLeaveModal').click();
            }
        } catch (error) {
            toast.error('Failed to submit leave request');
        }
    };

    // Fetch my leaves 
    useEffect(() => {

        if (!emp_id) return;

        const fetchLeavesHistory = async () => {
            try {
                setLoading(true);

                const response = await axiosInstance.get('/leave/my-leaves', {
                    params: { emp_id }
                });

                if (response.data.status) {
                    setLeaveHistory(response.data.data);
                }

            } catch (error) {
                console.error('Error fetching leave history', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeavesHistory();

    }, [emp_id]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-success';
            case 'applied':
                return 'bg-warning text-dark';
            case 'rejected':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    useEffect(() => {
        if (!emp_id) return;

        const fetchLeaveStats = async () => {
            try {
                const res = await axiosInstance.post('/employee/leave-stats', {
                    emp_id
                });

                if (res.data.status) {
                    setLeaveStats(res.data.data);
                } else {
                    setError('Unable to fetch leave stats');
                }
            } catch (err) {
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveStats();
    }, [emp_id]);

    return (
        <div className="d-flex">
            <Sidebar />

            <div className="flex-grow-1" style={{ minHeight: '100vh', background: '#f4f6f9' }}>
                <Header />

                <div className="p-4">

                    <h4 className="mb-4 fw-bold">My Leave Dashboard</h4>

                    {/* Loader */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {/* CARDS */}
                    {leaveStats && (
                        <div className="row g-4 row-cols-1 row-cols-sm-2 row-cols-md-5">

                            {/* TOTAL PAID LEAVES */}
                            <div className="col">
                                <div className="card text-white bg-primary h-100">
                                    <div className="card-body">
                                        <h6>Total Paid Leaves</h6>
                                        <h2 className="fw-bold">
                                            {leaveStats.paid_leaves.total}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* TOTAL SICK LEAVES */}
                            <div className="col">
                                <div className="card text-white bg-success h-100">
                                    <div className="card-body">
                                        <h6>Total Sick Leaves</h6>
                                        <h2 className="fw-bold">
                                            {leaveStats.sick_leaves.total}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* USED PAID LEAVES */}
                            <div className="col">
                                <div className="card text-white bg-danger h-100">
                                    <div className="card-body">
                                        <h6>Used Paid Leaves</h6>
                                        <h2 className="fw-bold">
                                            {leaveStats.paid_leaves.used}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* USED SICK LEAVES */}
                            <div className="col">
                                <div className="card text-white bg-warning h-100">
                                    <div className="card-body">
                                        <h6>Used Sick Leaves</h6>
                                        <h2 className="fw-bold">
                                            {leaveStats.sick_leaves.used}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            {/* TOTAL BALANCE LEFT */}
                            <div className="col">
                                <div className="card text-white bg-info h-100">
                                    <div className="card-body">
                                        <h6>Total Balance Left</h6>
                                        <h2 className="fw-bold">
                                            {leaveStats.paid_leaves.remaining +
                                                leaveStats.sick_leaves.remaining}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}


                    <div className="card shadow-sm border-0 my-5">
                        <div className="bg-white p-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-semibold">Leave History</h5>

                                <div className="d-flex align-items-center gap-2">
                                    <button className="btn btn-sm btn-warning d-flex align-items-center gap-2"
                                        data-bs-toggle="modal"
                                        data-bs-target="#applyLeaveModal"
                                    >
                                        <i className="bi bi-calendar-plus"></i>
                                        Apply Leave
                                    </button>

                                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                                        <i className="bi bi-funnel"></i>
                                        Filters
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Leave Type</th>
                                            <th>Reason</th>
                                            <th>Leave Date</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {leaveHistory.map((leave, index) => (
                                            <tr key={leave.id}>
                                                <td>{index + 1}</td>
                                                <td>{leave.leave_type}</td>
                                                <td>{leave.reason}</td>
                                                <td>
                                                    {leave.from_date} → {leave.to_date}
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadge(leave.status)}`}>
                                                        {leave.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Apply leave modal popup */}
            {/* Apply leave modal popup */}
            <div className="modal fade" id="applyLeaveModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">

                        {/* Header */}
                        <div className="modal-header">
                            <h5 className="modal-title d-flex align-items-center gap-2">
                                <i className="bi bi-calendar-check"></i>
                                Apply for Leave
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                id="closeLeaveModal"
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            <form>

                                <div className="row g-3">

                                    {/* Subject */}
                                    <div className="col-md-6">
                                        <label className="form-label">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            className="form-control"
                                            placeholder="Eg. Medical Leave"
                                            value={leaveForm.subject}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Leave Type */}
                                    <div className="col-md-6">
                                        <label className="form-label">Leave Type</label>
                                        <select
                                            className="form-select"
                                            name="leave_type"
                                            value={leaveForm.leave_type}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select Leave Type</option>
                                            <option value="paid">Paid Leave</option>
                                            <option value="sick">Sick Leave</option>
                                        </select>
                                    </div>

                                    {/* From Date */}
                                    <div className="col-md-6">
                                        <label className="form-label">From Date</label>
                                        <input
                                            type="date"
                                            name="from_date"
                                            className="form-control"
                                            value={leaveForm.from_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* To Date */}
                                    <div className="col-md-6">
                                        <label className="form-label">To Date</label>
                                        <input
                                            type="date"
                                            name="to_date"
                                            className="form-control"
                                            value={leaveForm.to_date}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="col-12">
                                        <label className="form-label">Description / Reason</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            name="reason"
                                            placeholder="Brief reason for leave"
                                            value={leaveForm.reason}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                    {/* Additional Remarks */}
                                    <div className="col-12">
                                        <label className="form-label">Additional Remarks (Optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows="2"
                                            name="remarks"
                                            placeholder="Any additional notes"
                                            value={leaveForm.remarks}
                                            onChange={handleChange}
                                        ></textarea>
                                    </div>

                                </div>

                            </form>
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                onClick={submitLeave}
                            >
                                <i className="bi bi-send"></i>
                                Submit Leave Request
                            </button>
                        </div>

                    </div>
                </div>
            </div>


        </div>



    );
};

export default LeaveManagement;
