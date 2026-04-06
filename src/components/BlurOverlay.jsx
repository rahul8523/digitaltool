import React from "react";

const BlurOverlay = ({ isBlurred, onPunchIn, employeeName, img, msg }) => {
    if (!isBlurred) return null; // Don’t render overlay if not blurred

    // Dynamic greeting based on current time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="blur-overlay">
            <div className="overlay-box personalized-box d-flex align-items-center p-3 shadow-sm">
                {/* Profile Image */}
                <img
                    src={img}
                    alt="Employee"
                    className="rounded-circle me-3 profile-img"
                />
                {/* Greeting and Info */}
                <div className="flex-grow-1">
                    <h5 className="mb-1">
                        {getGreeting()}, <span className="text-primary">{employeeName}</span>
                    </h5>
                    <p className="text-muted mb-2 small">
                        {msg}
                    </p>
                </div>

                {/* Punch In Button */}
                <button className="btn btn-primary ms-3 btn-sm dxBtn" onClick={onPunchIn}>
                    <i className="bi bi-fingerprint me-3"></i>
                    Punch In
                </button>
            </div>
        </div>
    );
};

export default BlurOverlay;
