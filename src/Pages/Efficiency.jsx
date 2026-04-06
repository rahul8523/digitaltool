
// import React from 'react'
import React, { useState, useEffect } from "react";
import { useUser } from '../context/UserContext';
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Barchart from '../components/Barchart'
import axiosInstance from '../api/axios'
import dayjs from "dayjs";
import TimeSpentCard from "../components/TimeSpentCard";

const Efficiency = () => {
    const { employee } = useUser();
    console.log(employee?.emp_id)
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
    const [monthsList, setMonthsList] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [metrics, setMetrics] = useState({
        efficiency: 0,
        punctuality: 0,
        productivity: 0,
        completion: 0,
        time_spent: 0
    });

    //Define function OUTSIDE useEffect
    const fetchMetrics = async () => {
        if (!employee?.emp_id) {
            console.warn("Employee ID not available yet");
            return;
        }

        try {
            const response = await axiosInstance.get(`/employee/efficiency`, {
                params: {
                    emp_id: employee.emp_id,
                    month: month || dayjs().format("YYYY-MM"),
                },
            });

            const data = response.data.metrics;
            console.log(data)
            setMetrics({
                efficiency: parseFloat(data.efficiency || 0),
                punctuality: parseFloat(data.punctuality || 0),
                productivity: parseFloat(data.productivity || 0),
                completion: parseFloat(data.completion_rate || 0),
                time_spent: data.total_time_spent || "00:00:00",
            });

        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    // ✅ Called when user clicks Filter button
    const handleFilter = () => {
        fetchMetrics();
    };

    // ✅ Auto-load once on mount
    useEffect(() => {
        if (employee?.emp_id && month) {
            fetchMetrics();
        }
    }, [employee?.emp_id, month]); // runs only once

    // 🔹 Optional: Fetch when search changes (debounced)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search.trim() !== "") fetchMetrics();
        }, 500);
        return () => clearTimeout(timeout);
    }, [search]);

    // 🔹 Generate last 12 months dropdown
    useEffect(() => {
        const months = [];
        for (let i = 0; i < 12; i++) {
            const m = dayjs().subtract(i, "month");
            months.push({
                label: m.format("MMMM YYYY"), // e.g. October 2025
                value: m.format("YYYY-MM"),   // e.g. 2025-10
            });
        }
        setMonthsList(months);
    }, []);

    // ✅ Helper function also outside useEffect
    const getOffset = (percent, radius) => {
        const circumference = 2 * Math.PI * radius;
        return circumference - (percent / 100) * circumference;
    };
    const getOffset2Punctuality = (percent, radius) => {
        const circumference = 2 * Math.PI * radius;
        return circumference - (percent / 30) * circumference;
    };
    const getOffset2Productivity = (percent, radius) => {
        const circumference = 2 * Math.PI * radius;
        return circumference - (percent / 50) * circumference;
    };
    const getOffsetTaskCompletion = (percent, radius) => {
        const circumference = 2 * Math.PI * radius;
        return circumference - (percent / 20) * circumference;
    };
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Header />
                <div className="p-4">
                    <h3>Efficiency Mechanism</h3>
                    {/* Filters */}
                    <div className="mt-3">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-4 col-sm-12">
                                <label htmlFor="search" className="form-label fw-semibold">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    className="form-control"
                                    placeholder="Search by name, ID, or keyword"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            {/* 🔸 Month Dropdown */}
                            <div className="col-md-3 col-sm-6">
                                <label htmlFor="month" className="form-label fw-semibold">
                                    Select Month
                                </label>
                                <select
                                    id="month"
                                    className="form-select"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                >
                                    {monthsList.map((m) => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2 col-sm-6">
                                <label htmlFor="fromDate" className="form-label fw-semibold">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    id="fromDate"
                                    className="form-control"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-2 col-sm-6">
                                <label htmlFor="toDate" className="form-label fw-semibold">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    id="toDate"
                                    className="form-control"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>
                            <div className="col-md-1 col-sm-6">
                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={handleFilter}
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="mt-3 row">
                        {/* Efficiency Section (Large Card) */}
                        <div className="col-md-4 col-sm-12 mb-4">
                            <div className="card shadow-sm p-3 mb-4 text-center">
                                <h6 className="text-center mb-3">
                                    Efficiency ({month ? month : "Current Month"})
                                </h6>
                                <div
                                    className="position-relative d-flex justify-content-center align-items-center"
                                    style={{ height: "150px" }}
                                >
                                    <svg width="120" height="120">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="#e6e6e6"
                                            strokeWidth="10"
                                            fill="none"
                                        />
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="#28a745"
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray="314"
                                            strokeDashoffset={getOffset(metrics.efficiency, 50)}
                                            transform="rotate(-90 60 60)"
                                            style={{
                                                transition: "stroke-dashoffset 1s ease-in-out",
                                                strokeLinecap: "round",
                                            }}
                                        />
                                    </svg>
                                    <div className="position-absolute">
                                        <h5 className="mb-0 fw-bold text-success">
                                            {metrics.efficiency.toFixed(2)}%
                                        </h5>
                                    </div>
                                </div>
                                <p className="text-muted small mb-0">
                                    Keep up the great work this month 💪
                                </p>
                            </div>
                            <div className="mt-3 card shadow-sm p-3 mb-4 text-center">
                                <TimeSpentCard totalTime={metrics.time_spent} />
                            </div>
                        </div>

                        {/* 3 Small Metrics Side-by-Side */}
                        <div className="col-md-8 col-sm-12 mb-4">
                            <div className="row g-3">
                                {/* Punctuality */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 text-center">
                                        <h6 className="fw-semibold mb-1">Punctuality</h6>
                                        <p className="text-muted small mb-2">
                                            {month ? month : "This Month"}
                                        </p>
                                        <div
                                            className="position-relative mx-auto"
                                            style={{ width: "80px", height: "80px" }}
                                        >
                                            <svg width="80" height="80">
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="#e6e6e6"
                                                    strokeWidth="8"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="#ffc107"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray="220"
                                                    strokeDashoffset={getOffset2Punctuality(metrics.punctuality, 35)}
                                                    transform="rotate(-90 40 40)"
                                                    style={{
                                                        transition: "stroke-dashoffset 1s ease-in-out",
                                                        strokeLinecap: "round",
                                                    }}
                                                />
                                            </svg>
                                            <div style={{ fontSize: '13px' }} className="position-absolute top-50 start-50 translate-middle text-warning fw-bold">
                                                {metrics.punctuality.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Productivity */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 text-center">
                                        <h6 className="fw-semibold mb-1">Productivity</h6>
                                        <p className="text-muted small mb-2">
                                            {month ? month : "This Month"}
                                        </p>
                                        <div
                                            className="position-relative mx-auto"
                                            style={{ width: "80px", height: "80px" }}
                                        >
                                            <svg width="80" height="80">
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="#e6e6e6"
                                                    strokeWidth="8"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="#28a745"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray="220"
                                                    strokeDashoffset={getOffset2Productivity(metrics.productivity, 35)}
                                                    transform="rotate(-90 40 40)"
                                                    style={{
                                                        transition: "stroke-dashoffset 1s ease-in-out",
                                                        strokeLinecap: "round",
                                                    }}
                                                />
                                            </svg>
                                            <div style={{ fontSize: '13px' }} className="position-absolute top-50 start-50 translate-middle text-success fw-bold">
                                                {metrics.productivity.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Task Completion Rate */}
                                <div className="col-md-4 col-sm-6">
                                    <div className="card shadow-sm p-3 text-center">
                                        <h6 className="fw-semibold mb-1">Task Completion</h6>
                                        <p className="text-muted small mb-2">
                                            {month ? month : "This Month"}
                                        </p>
                                        <div
                                            className="position-relative mx-auto"
                                            style={{ width: "80px", height: "80px" }}
                                        >
                                            <svg width="80" height="80">
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="#e6e6e6"
                                                    strokeWidth="8"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="40"
                                                    cy="40"
                                                    r="35"
                                                    stroke="#007bff"
                                                    strokeWidth="8"
                                                    fill="none"
                                                    strokeDasharray="220"
                                                    strokeDashoffset={getOffsetTaskCompletion(metrics.completion, 35)}
                                                    transform="rotate(-90 40 40)"
                                                    style={{
                                                        transition: "stroke-dashoffset 1s ease-in-out",
                                                        strokeLinecap: "round",
                                                    }}
                                                />
                                            </svg>
                                            <div style={{ fontSize: '13px' }} className="position-absolute top-50 start-50 translate-middle text-primary fw-bold">
                                                {metrics.completion?.toFixed(2) ?? 0}%
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chart Section Below the Cards */}
                            <div className="mt-4">
                                <Barchart
                                    search={search}
                                    month={month}
                                    fromDate={fromDate}
                                    toDate={toDate}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Efficiency;