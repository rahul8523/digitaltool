import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import icon1 from '../assets/up.png'
import icon2 from '../assets/past.png'
import icon3 from '../assets/participant.png'
import UpcomingEvent from '../components/UpcomingEvent'
import PastEvent from '../components/PastEvent'
import BirthdayCard from '../components/BirthdayCard'


const OfficeEvents = () => {
   
    const grid = [
        {
            id: 1,
            img: icon1,
            heading: "Upcoming Events",
            number: 3
        },
        {
            id: 2,
            img: icon2,
            heading: "Past Events",
            number: 10
        },
        {
            id: 3,
            img: icon3,
            heading: "Participants",
            number: "500+"
        }
    ]

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1">
                <Header />
                <div className="p-4">
                    <h3>Office Events</h3>
                    <p>Explore upcoming and past office events, celebrations, and important dates here.</p>

                    <hr className="my-3 border-gray-300" />


                    {/* Event summary cards */}
                    <div className="row">
                        {grid.map((grids) => (
                            <div key={grids.id} className="col-md-4 mb-3">
                                <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
                                    <img
                                        src={grids.img}
                                        alt={grids.heading}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            objectFit: "contain",
                                            marginRight: "15px"
                                        }}
                                    />
                                    <div>
                                        <h5 className="mb-1">{grids.heading}</h5>
                                        <p className="mb-0 text-muted">{grids.number}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* upcoming event start here */}
                    <div className='row py-4'>
                        <div className='col-lg-12'>
                            <h2 className='fw-bold py-3'>Upcoming Event</h2>

                        </div>
                        <div className='col-lg-9'>
                            <UpcomingEvent />
                        </div>
                        <div className='col-lg-3'>
                            <BirthdayCard/>
                         
                        </div>

                    </div>



                    {/* past event start here */}
                    <div className='row'>
                        <div className='col-lg-12'>
                            <h2 className='fw-bold py-3'>Past Events</h2>

                        </div>
                        <div className='col-lg-9'>

                            <PastEvent />

                        </div>
                        <div className='col-lg-3'>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OfficeEvents
