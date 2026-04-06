import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const BarChartComponent = ({ data }) => {
    if (!data || data.length === 0) {
        return <p className="text-gray-500 text-sm">No performance data available</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Efficiency" fill="#4e79a7" />
                <Bar dataKey="Punctuality" fill="#f28e2b" />
                <Bar dataKey="Productivity" fill="#e15759" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
