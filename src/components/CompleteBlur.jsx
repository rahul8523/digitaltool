import React from "react";

const CompleteBlur = () => {
    return (
        <>
            {/* Full page blur overlay */}
            <div className="complete-blur-overlay"></div>

            {/* Centered message box */}
            <div className="complete-blur-message-box">
                <h3>Your account is temporarily disabled</h3>
                <p>Please contact your administrator for further assistance.</p>
            </div>
        </>
    );
};

export default CompleteBlur;