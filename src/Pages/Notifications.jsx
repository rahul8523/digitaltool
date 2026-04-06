import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import axiosInstance from '../api/axios'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
    const { employee } = useUser()
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetching notifications
    useEffect(() => {
        if (employee?.emp_id) {
            axiosInstance.get(`/notifications/${employee?.emp_id}`)
                .then(res => {
                    setNotifications(res.data.notifications);
                    console.log(res.data)
                })
                .catch(err => {
                    console.error("Error fetching notifications:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [employee?.emp_id]);

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="flex-grow-1">
                <Header />
                <div className="p-4">
                    <button
                        className="btn btn-outline-dark rounded-circle mb-3"
                        style={{ width: '40px', height: '40px' }}
                        onClick={() => navigate(-1)}
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <h3 className="fw-bold">Notifications</h3>
                    <p className="mb-4 text-muted">
                        Explore upcoming and past office events, celebrations, and important dates here.
                    </p>

                    {loading ? (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="alert alert-info">No notifications yet.</div>
                    ) : (
                        <div className="list-group">
                            {notifications.map(note => (
                                <div
                                    key={note.id}
                                    className={`list-group-item list-group-item-${note.type} shadow-sm rounded mb-3 border-0`}
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-1">{note.title}</h5>
                                            <p className="mb-2">{note.message}</p>
                                            <small className="text-muted">{note.time}</small>
                                        </div>
                                        <div className="text-end">
                                            <i className="bi bi-bell-fill fs-4 text-dark mb-2"></i>
                                            <br />
                                            <a
                                                href={`/dashboard/task`}
                                                className="btn btn-sm btn-outline-dark"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default Notifications
