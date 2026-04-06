import React from 'react'
import img1 from '../assets/diwali.jpg'
const UpcomingEvent = () => {
    const upevent = [
        {
            id: 1,
            title: "Annual Company Meeting",
            date: "Jan 15, 2024",
            description: "Our yearly gathering to discuss progress and plans.",
            image: img1

        },

        {
            id: 2,
            title: "Team Building Workshop",
            date: "Feb 22, 2024",
            description: "A fun workshop to strengthen our team bonds.",
            image: img1
        },
        {
            id: 3,
            title: "Product Launch Workshop",
            date: "2025-10-30",
            description: "Join us to unvell our latest product.",
            image: img1
        }


    ]
    return (
        <>
            <div className='row'>
                {
                    upevent.map((item) => (
                        <div key={item.id} className="col-md-4 mb-4">
                            <div
                                className="event-card card shadow-sm h-100 border-0"
                                style={{
                                    borderRadius: "14px",
                                    overflow: "hidden",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    cursor: "pointer",
                                }}
                            >
                                <div style={{ overflow: "hidden", height: "200px" }}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-100 h-100"
                                        style={{ objectFit: "cover", transition: "0.4s ease" }}
                                    />
                                </div>
                                <div className="p-4">
                                    <h5 className="card-title mb-3 fw-semibold">{item.title}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">📅 {item.date}</h6>
                                    <p className="card-text text-secondary">
                                        {item.description}
                                    </p>
                                    <button className="btn btn-primary btn-sm mt-2">Register</button>
                                </div>
                            </div>
                        </div>
                    ))

                }

            </div>




        </>

    )
}
export default UpcomingEvent;