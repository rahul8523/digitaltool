import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const AttendanceMetrics = ({ totalWorkingDays, totalHolidays, totalPresent, totalAbsents,totalLeaves }) => {
    return (
        <div className="container-fluid">
            <div className="row g-3 attendance-cards">
                {/* Total Working Days */}
                <div className="col-md-6 col-sm-6">
                    <div className="card text-white bg-primary h-100">
                        <div className="card-body">
                            <h6 className="card-title mb-2">Total Working Days</h6>
                            <h3 className="card-text">{totalWorkingDays ?? 0}</h3>
                        </div>
                        <div className="card-footer bg-transparent border-top-0">
                            <Link
                                to="#"
                                className="text-white text-decoration-none d-flex justify-content-between align-items-center"
                            >
                                More info <i className="bi bi-arrow-right-circle"></i>
                            </Link>
                        </div>
                    </div>
                </div>



                {/* duplicate Total Holidays Days */}
                <div className="col-md-6 col-sm-6">
                    <div className="card text-white bg-warning h-100">
                        <div className="card-body">
                            <h6 className="card-title mb-2">Total Holidays Days</h6>
                            <h3 className="card-text">{totalHolidays ?? 0}</h3>
                        </div>
                        <div className="card-footer bg-transparent border-top-0">
                            <Link
                                to="#"
                                className="text-white text-decoration-none d-flex justify-content-between align-items-center"
                            >
                                More info <i className="bi bi-arrow-right-circle"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Total Present */}
                <div className="col-md-6 col-sm-6">
                    <div className="card text-white bg-success h-100">
                        <div className="card-body">
                            <h6 className="card-title mb-2">Total Present</h6>
                            <h3 className="card-text">{totalPresent ?? 0}</h3>
                        </div>
                        <div className="card-footer bg-transparent border-top-0">
                            <Link
                                to="#"
                                className="text-white text-decoration-none d-flex justify-content-between align-items-center"
                            >
                                More info <i className="bi bi-arrow-right-circle"></i>
                            </Link>
                        </div>
                    </div>
                </div>


                {/* duplicate Total Absents */}
                <div className="col-md-6 col-sm-6">
                    <div className="card text-white bg-info h-100">
                        <div className="card-body">
                            <h6 className="card-title mb-2">Total Absents</h6>
                            <h3 className="card-text">{totalAbsents ?? 0}</h3>
                        </div>
                        <div className="card-footer bg-transparent border-top-0">
                            <Link
                                to="#"
                                className="text-white text-decoration-none d-flex justify-content-between align-items-center"
                            >
                                More info <i className="bi bi-arrow-right-circle"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Total Leaves */}
                <div className="col-md-6 col-sm-6">
                    <div className="card text-white bg-danger h-100">
                        <div className="card-body">
                            <h6 className="card-title mb-2">Total Leaves</h6>
                            <h3 className="card-text">{totalLeaves ?? 0}</h3>
                        </div>
                        <div className="card-footer bg-transparent border-top-0">
                            <Link
                                to="#"
                                className="text-white text-decoration-none d-flex justify-content-between align-items-center"
                            >
                                More info <i className="bi bi-arrow-right-circle"></i>
                            </Link>
                        </div>
                    </div>
                </div>


                {/* dulicate  Total .... */}
                <div className="col-md-6 col-sm-6">
                    <div className="card text-white bg-secondary h-100">
                        <div className="card-body">
                            <h6 className="card-title mb-2">Total ....</h6>
                            <h3 className="card-text">{totalPresent ?? 0}</h3>
                        </div>
                        <div className="card-footer bg-transparent border-top-0">
                            <Link
                                to="#"
                                className="text-white text-decoration-none d-flex justify-content-between align-items-center"
                            >
                                More info <i className="bi bi-arrow-right-circle"></i>
                            </Link>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    );
};

export default AttendanceMetrics;
