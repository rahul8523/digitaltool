import React from 'react';
import { useUser } from '../context/UserContext'; // Make sure your context is set
import { format } from 'date-fns';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { NavLink, useNavigate } from 'react-router-dom';

const Profile = () => {
    const { employee } = useUser();
    const navigate = useNavigate();

    return (
        <>
            <div className="d-flex">
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
                        <h2 className="mb-4 fw-bold">My Profile</h2>
                        <div className="row g-4">
                            {/* Left Column - Profile Card */}
                            <div className="col-lg-4">
                                <div className="card shadow border-0 text-center p-4">
                                    <img
                                        src={
                                            employee?.image_url ||
                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(employee?.name || 'User')}&background=0D8ABC&color=fff&size=120`
                                        }
                                        alt="Profile"
                                        className="rounded-circle mx-auto mb-3"
                                        width="120"
                                        height="120"
                                    />
                                    <h4 className="fw-bold">{employee?.name || 'N/A'}</h4>
                                    <p className="text-muted">{employee?.post || 'DX Member'}</p>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <button className="btn btn-outline-primary btn-sm w-100">Edit Profile</button>
                                        </div>

                                        <div className="col-md-6">
                                            <NavLink to={'/dashboard/update-password'}>
                                                <button className="btn btn-success btn-sm w-100">Update Password</button>
                                            </NavLink>
                                        </div>

                                    </div>

                                </div>

                                {/* Infographic Cards Below (Mobile-friendly) */}

                            </div>

                            {/* Right Column - Details and About */}
                            <div className="col-lg-8">
                                <div className="card shadow-lg border-0 mb-4">
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-3">Personal Information</h5>
                                        <div className="row mb-3">
                                            <div className="col-sm-4 text-muted fw-medium">Employee ID:</div>
                                            <div className="col-sm-8">{employee?.emp_id || 'N/A'}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-4 text-muted fw-medium">Email:</div>
                                            <div className="col-sm-8">{employee?.email || 'N/A'}</div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-sm-4 text-muted fw-medium">Department:</div>
                                            <div className="col-sm-8">{employee?.department || 'N/A'}</div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col-sm-4 text-muted fw-medium">Joining Date:</div>
                                            <div className="col-sm-8">
                                                {employee?.joining_date
                                                    ? format(new Date(employee.joining_date), 'dd MMM yyyy')
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card shadow-sm border-0">
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-3">About</h5>
                                        <p className="text-muted mb-0">
                                            {employee?.about || 'This employee hasn’t written anything yet.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Profile;
