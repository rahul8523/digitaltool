import { Clock } from "lucide-react"; // timer icon

const TimeSpentCard = ({ totalTime }) => {
    // Dummy data for now
    // const totalTime = "45:32:10"; 

    return (
        <div className="mt-3 p-4 mb-4 text-center rounded-2xl bg-white hover:shadow-md transition-all">
            <div className="flex flex-col items-center">
                {/* Timer Icon */}
                <div className="p-3 bg-blue-100 rounded-full mb-2">
                    <Clock size={58} className="text-blue-600" />
                </div>

                {/* Label */}
                <p className="text-gray-600 text-sm font-medium mb-1">
                    Total Time Spent
                </p>

                {/* Time Text */}
                <h2 className="font-bold text-gray-900 tracking-wide timerFont">
                    {totalTime ? totalTime : "00:00:00"}
                </h2>
            </div>
        </div>
    );
};

export default TimeSpentCard;
