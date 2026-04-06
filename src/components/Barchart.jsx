import React, { useEffect, useState } from "react";
import { useUser } from '../context/UserContext';
import dayjs from "dayjs";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    YAxis,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from "recharts";

import axiosInstance from "../api/axios";

const data = [
    { month: "Jan", Efficiency: 85, Punctuality: 90, Productivity: 80 },
    { month: "Feb", Efficiency: 88, Punctuality: 85, Productivity: 83 },
    { month: "Mar", Efficiency: 82, Punctuality: 88, Productivity: 86 },
    { month: "Apr", Efficiency: 90, Punctuality: 92, Productivity: 84 },
    { month: "May", Efficiency: 87, Punctuality: 86, Productivity: 88 },
    { month: "Jun", Efficiency: 92, Punctuality: 89, Productivity: 91 },
    { month: "Jul", Efficiency: 85, Punctuality: 91, Productivity: 84 },
    { month: "Aug", Efficiency: 89, Punctuality: 87, Productivity: 86 },
    { month: "Sep", Efficiency: 91, Punctuality: 90, Productivity: 89 },
    { month: "Oct", Efficiency: 88, Punctuality: 93, Productivity: 92 },
    { month: "Nov", Efficiency: 90, Punctuality: 89, Productivity: 87 },
    { month: "Dec", Efficiency: 93, Punctuality: 94, Productivity: 90 },
];

const Barchart = () => {
    const { employee } = useUser();
    console.log(employee?.emp_id)
    const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
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

    // Called when user clicks Filter button
    const handleFilter = () => {
        fetchMetrics();
    };

    // Auto-load once on mount
    useEffect(() => {
        if (employee?.emp_id && month) {
            fetchMetrics();
        }
    }, [employee?.emp_id, month]); // runs only once
    const colors = {
        Efficiency: "#6366F1", // Indigo
        Punctuality: "#22C55E", // Green
        Productivity: "#F59E0B", // Amber
    };

    return (
        <div className="card shadow-sm p-3"
            style={{
                outline: "none",
                width: "100%",
                height: 460,
                borderRadius: "18px",
                transition: "0.3s ease",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#1e293b",
                    fontWeight: "700",
                    letterSpacing: "0.5px",
                }}
            >
                Employee Performance Overview (2025)
            </h2>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                    barGap={5}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="month" tick={{ fill: "#475569" }} />

                    <YAxis domain={[70, 100]} tick={{ fill: "#475569" }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    />

                    <Legend wrapperStyle={{ fontWeight: "600", color: "#334155" }} />

                    <Bar
                        dataKey="Efficiency"
                        fill={colors.Efficiency}
                        radius={[10, 10, 0, 0]}
                        animationDuration={1200}
                    />
                    <Bar
                        dataKey="Punctuality"
                        fill={colors.Punctuality}
                        radius={[10, 10, 0, 0]}
                        animationDuration={1500}
                    />
                    <Bar
                        dataKey="Productivity"
                        fill={colors.Productivity}
                        radius={[10, 10, 0, 0]}
                        animationDuration={1800}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Barchart;
